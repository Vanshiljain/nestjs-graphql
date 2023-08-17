import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GraphQLJSONObject } from "graphql-type-json";
import mongoose, { Document } from "mongoose";

@ObjectType()
@Schema()
export class GitHubPull extends Document {
    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    github_pull_metadata: object;

    @Field(() => String)
    @Prop()
    title: string;

    @Field(() => String)
    @Prop()
    url: string;

    @Field(() => Date)
    @Prop()
    createdAt: Date;
    
    @Field(() => Date)
    @Prop()
    mergedAt: Date;

    @Field(() => Date)
    @Prop()
    closedAt: Date;

    @Field(() => Date)
    @Prop()
    updatedAt: Date;

    @Field(() => ID)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    user_id: mongoose.Types.ObjectId;

    @Field(() => ID)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    repo_id: mongoose.Types.ObjectId;

    @Field(() => String)
    @Prop()
    repo_owner: string;

    @Field(() => String)
    @Prop()
    repo_name: string;

    @Field(() => String)
    @Prop()
    state: string;

    @Field(() => Number)
    @Prop()
    number : number;

    @Field(() => ID)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    author_id: mongoose.Types.ObjectId;
}
export const GitHubPullSchema = SchemaFactory.createForClass(GitHubPull);