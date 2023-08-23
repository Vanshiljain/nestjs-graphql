import { Injectable } from "@nestjs/common";
import { GithubLoginService } from "../github_login/github_login.service";
import axios from "axios";
import { GitHubPull } from "./github_pull.schema";
import { GithubRepositoryService } from "src/github_repository/github_repository.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class GithubPullService {
  constructor(
    private readonly githubLoginService: GithubLoginService,
    private readonly githubRepositoryService: GithubRepositoryService,
    @InjectModel(GitHubPull.name) private readonly GitHubPullModel: Model<GitHubPull>
  ) { }

  async createPullRequests(username: string, repo_name: string): Promise<GitHubPull[]> {
    const user = await this.githubLoginService.getGithubUserDetails(username);
    const repo = await this.githubRepositoryService.getRepoIdByName(repo_name);

    const query = `
    query {
      repository(owner: "${username}", name: "${repo_name}") {
        defaultBranchRef {
          name
        }
        description
        isInOrganization
        isPrivate
        name
        nameWithOwner
        pullRequests(first: 10, orderBy: { direction: DESC, field: CREATED_AT }) {
          nodes {
            number
            additions
            author {
              avatarUrl
              login
              url
            }
            baseRefName
            body
            bodyText
            changedFiles
            closed
            commits(first: 10) {
              nodes {
                resourcePath
                commit {
                  abbreviatedOid
                  additions
                  authoredByCommitter
                  authoredDate
                  changedFiles
                  committer {
                    avatarUrl
                    name
                  }
                  commitUrl
                  deletions
                  message
                  messageBody
                  messageHeadline
                  oid
                  pushedDate
                }
                url
              }
            }
            createdAt
            headRefName
            number
            title
            url
          }
        }
        url
      }
    }
  `;

    try {
      const response = await axios.post(
        "https://api.github.com/graphql",
        { query },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      console.log('Full API Response:', JSON.stringify(response.data.data.repository.pullRequests.nodes));

      const pullRequests = response.data.data.repository.pullRequests.nodes;

      if (!pullRequests) {
        console.error("Pull requests data not found in API response");
        throw new Error("Failed to fetch pull requests");
      }

      const data = pullRequests.map((pullRequest) => ({
        updateOne: {
          filter: {
            number: pullRequest.number,
            repo_id: repo._id,
          },
          update: {
            $set: {
              title: pullRequest.title,
              url: pullRequest.url,
              createdAt: pullRequest.createdAt,
              updatedAt: pullRequest.updatedAt,
              closedAt: pullRequest.closedAt,
              mergedAt: pullRequest.mergedAt,
              state: pullRequest.state,
              github_pull_metadata: pullRequest,
              user_id: repo.user_id,
              repo_id: repo._id,
              author_id: user._id,
              repo_name: repo_name,
              repo_owner: username,
              number: pullRequest.number,
            },
          },
          upsert: true,
        },
      }));
  
      await this.GitHubPullModel.bulkWrite(data);
      return data;
    } catch (error) {
      console.error("GitHub API Request Error:", error);
      throw new Error("Failed to fetch pull requests");
    }
  }

  async getPullRequestFromDb(username: string): Promise<GitHubPull[]> {
    const user = await this.githubLoginService.getGithubUserDetails(username);
    const pullRequests = await this.GitHubPullModel.find({ author_id: user._id });
    console.log('Pull Requests from DB:', pullRequests);
    return pullRequests;
  }

  async getFilteredPullRequests(username: string, searchKeyword: string): Promise<GitHubPull[]> {
    const user = await this.githubLoginService.getGithubUserDetails(username);
  
    const reg = searchKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, ' ');
    console.log('reg >>>>>>>>>>>>>>>>>>>:', reg);
    const aggregationPipeline = [
      {
        $match: {
          author_id: user._id,
          $or: [
            { title: { $regex: reg, $options: 'i' } },
            { baseRefName: { $regex: reg, $options: 'i' } },
            { number: { $regex: reg, $options: 'i' } },
          ],
        },
      },
    ];
  
    const pullRequests = await this.GitHubPullModel.aggregate(aggregationPipeline);
    console.log('Filtered Pull Requests from DB:', pullRequests);
    return pullRequests;
  } 
}

