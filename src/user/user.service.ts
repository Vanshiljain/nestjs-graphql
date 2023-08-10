import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, Product, UserInput, AccessTokenResponse } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Args } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import axios from 'axios';




@Injectable()
export class UserService {
  findById(userId: string) {
    throw new Error('Method not implemented.');
  }



  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }
  async createUser(userInput: UserInput): Promise<User> {

    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({

      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      }
    });


    const aggregation = new this.userModel({ ...userInput, password: await bcrypt.hash(userInput.password, 10) });
    aggregation.product.map((p: Product) => {
      const totalPrice = p.description.unit.quantity * p.description.unit.pricePerUnit;
      p.description.unit.totalPrice = totalPrice;
    });
    const totalSumPrice = aggregation.product.reduce((sum: number, p: Product) => {
      return sum + p.description.unit.totalPrice;
    }, 0);
    aggregation.totalSumPrice = totalSumPrice;
    const result = JSON.stringify(aggregation);
    const info = await transporter.sendMail({
      from: "niharkushwahcomputer@gmail.com", // sender address
      to: "nihark@linkites.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "User registered successfully!",
      html: `
      <h1>User registered successfully!</h1>
      <table border="1">
      <tr>
          <th>Name</th>
          <th>email</th>
          <th>Username</th>
          <th>age</th>
          <th>mobile number</th>
          <th>Address</th>
          
        </tr>
        <tr>
          <td>${aggregation.name}</td>
          <td>${aggregation.email}</td>
          <td>${aggregation.username}</td>
          <td>${aggregation.age}</td>
          <td>${aggregation.mobileNumber}</td>
          <td>${aggregation.address.mainAddress}, ${aggregation.address.city}, ${aggregation.address.pincode}</td>
          </tr>
          </table>

      `,
    });

    console.log("Message sent: %s", info.messageId);
    return aggregation.save();

  }

  async findAllUser() {
    return this.userModel.find().exec();
  }

  async findUserByMatch(role: string) {
    return this.userModel.aggregate([
      {
        $match: {
          $and: [
            { role: "user" },
            { age: { $gte: 18, $lte: 35 } },
          ]
        }
      },
      {
        $addFields: {
          length: {
            $size: "$completedCourses",
          }
        },
      },
      {
        $project: {
          courses: 1,
          name: 1,
          username: 1,
          email: 1,
          password: 1,
          
          completedCourses: {
            $filter: {
              input: "$courses",
              as: "course",
              cond: {
                $and: [
                  { $eq: ["$$course.courseStatus", "Completed"] },
                  { $eq: ["$$course.publication", "Publisher A"] }
                ]
              }
            }
          },
          lastCourse: {
            $arrayElemAt: ["$courses", -1]
          }
        }
      },
      {
        $addFields: {
          length: {
            $size: "$completedCourses",
          }
        },
      },
      {
        $match: {
          length: { $gt: 0 },
        }
      }
    ]).exec();
  }


  async findUserByQty(quantity: number) {
    return this.userModel.aggregate([
      {
        $project: {
          name: "$name",
          username: "$username",
          role: "$role",
          email: "$email",
          password: "$password",
          product: 1,
          filterProducts: {
            $filter: {
              input: "$product",
              as: "item",
              cond: {
                $let: {
                  vars: { description: "$$item.description" },
                  in: { $gte: ["$$description.unit.quantity", quantity] }
                }
              }
            }
          },
        }
      },
      {
        $addFields: {
          totalSumPrice: {
            $sum: "$filterProducts.description.unit.totalPrice"
          },
        }
      },
      {
        $addFields: {
          totalSumPrice: {
            $sum: '$product.description.unit.totalPrice',
          },
        },
      },
    ]).exec();
  }

  async totalSumPrice() {
    const result = await this.userModel.aggregate([
      {
        $group: {
          _id: null,
          totalSumPrice: { $sum: "$totalSumPrice" },
        }
      }
    ]).exec();
    return result[0].totalSumPrice;
  }

  
  async getAllCourses() {
    return this.userModel.aggregate([
      {
        $addFields: {
          allCourses: {
            $map: {
              input: '$courses',
              as: 'courseObj',
              in: {
                $cond: [
                  {
                    $eq: ['$$courseObj.courseStatus', 'Completed'],
                  },
                  {
                    $mergeObjects: [
                      '$$courseObj',
                      {
                        courseName: '$$courseObj.courseName',
                        courseStatus: '$$courseObj.courseStatus',
                        publication: '$$courseObj.publication',
                        year: { $add: ['$$courseObj.year', 2] },
                      },
                    ],
                  },
                  '$$courseObj',
                ],
              },
            },
          },
        },
      },
    ]).exec();
  }

  async findOne(@Args('email') email: String): Promise<User> {
    return this.userModel.findOne({ email: email });
  }

  async updateUser(email: string, userInput: UserInput): Promise<User> {
    return this.userModel.findOneAndUpdate({ email: email }, userInput, { new: true });
  }

  async deleteUser(_id: string): Promise<User> {
    return this.userModel.findOneAndDelete({ _id: _id });
  }

  async findEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email });
  }

  async githubLogin(): Promise<{ githubAuthUrl: string }> {
    const params = new URLSearchParams();
    params.append('client_id', process.env.GITHUB_CLIENT_ID);
    params.append('scope', 'read:user user:email');
    params.append('response_type', 'code');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&${params.toString()}`;
    return { githubAuthUrl };
  }

  // async githubLogin(): Promise<{ githubAuthUrl: string }> {
  //   const params = new URLSearchParams();
  //   params.append('client_id', process.env.GITHUB_CLIENT_ID);
  //   params.append('scope', 'read:user user:email');
  //   const githubAuthUrl = `
  //   https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}
  // `;
  //   try {
  //     const response = await axios.post(githubAuthUrl, null, {
  //       headers: {
  //         "Content-Type": 'application/json',
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error:', error);
  //     throw error;
  //   }

  // }


  // async githubCodeExchange(code: string): Promise<AccessTokenResponse> {
  //   const params = new URLSearchParams();
  //   params.append('client_id', process.env.GITHUB_CLIENT_ID);
  //   params.append('client_secret', process.env.GITHUB_CLIENT_SECRET);
  //   params.append('code', code);

  //   try {
  //     const response = await axios.post(
  //       `https://github.com/login/oauth/access_token`,
  //       params,
  //       {
  //         headers: {
  //           Accept: 'application/json',
  //         },
  //       }
  //     );

  //     console.log('GitHub Access Token Response:', response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('GitHub Code Exchange Failed:', error);
  //     throw new Error('GitHub code exchange failed');
  //   }
  // }  

  async githubCodeExchange(code: string): Promise<AccessTokenResponse> {
    try { 
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;
      const redirectUri = process.env.REDIRECT_URI;
  
      const response = await axios.post(`https://github.com/login/oauth/access_token`, null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri,
        },
        headers: {
          Accept: 'application/json',
        },
      });
      console.log('GitHub Access Token Response:', response.data);
      return response.data;
    } catch (error) {
      throw new Error('GitHub code exchange failed');
    }
  } 
}
