import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubWebhookController } from './githubWebhook.controller';
import { GithubWebhookService } from './githubWebhook.service';
import { GithubWebhook, GithubWebhookSchema } from './githubWebhook.schema';
import { GithubRepositoryModule } from 'src/githubRepository/githubRepository.module';
import { GithubLoginModule } from 'src/githubLogin/githubLogin.module';
import { GithubPullModule } from 'src/githubPull/githubPull.module';
import { GithubWorkflowModule } from 'src/githubWorkflow/githubWorkflow.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: GithubWebhook.name, schema: GithubWebhookSchema }]), GithubLoginModule, GithubRepositoryModule, GithubPullModule, GithubWorkflowModule],
    controllers: [GithubWebhookController],
    providers: [GithubWebhookService],
    exports: [GithubWebhookService]
})
export class GithubWebhookModule { }
