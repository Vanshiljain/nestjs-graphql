import { Field, ID, ObjectType, Scalar } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
@Schema()
export class GitHubUserDetails extends Document {
  @Field(() => ID) 
  _id: string;

  @Field(() => String, { nullable: true })
  @Prop()
  userName: string;

  @Field(() => String, { nullable: true })
  @Prop()
  email: string;

  @Field(() => String, { nullable: true })
  @Prop()
  name: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: Object })
  githubUserMetadata: object;

  @Field(() => String, { nullable: true })
  @Prop()
  accessToken: string;

  @Field(() => String, { nullable: true })
  @Prop()
  tokenType: string;

  @Field(() => String, { nullable: true })
  @Prop()
  refreshToken: string;

  @Field(() => Number, { nullable: true })
  @Prop()
  expiresIn: Number;
}

export const GitHubUserDetailsSchema = SchemaFactory.createForClass(GitHubUserDetails);
