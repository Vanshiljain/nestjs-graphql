
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Gender {
    Male = "Male",
    Female = "Female"
}

export enum Role {
    admin = "admin",
    user = "user",
    superadmin = "superadmin"
}

export enum RepositoryType {
    UserRepo = "UserRepo",
    OrganizationRepo = "OrganizationRepo"
}

export interface InputCourses {
    courseName?: Nullable<string>;
    courseStatus?: Nullable<string>;
    publication?: Nullable<string>;
    year?: Nullable<number>;
}

export interface InputAddress {
    mainAddress?: Nullable<string>;
    city?: Nullable<string>;
    pincode?: Nullable<number>;
}

export interface Units {
    quantity?: Nullable<number>;
    pricePerUnit?: Nullable<number>;
    totalPrice?: Nullable<number>;
}

export interface Descriptions {
    label?: Nullable<string>;
    unit?: Nullable<Units>;
}

export interface InputProduct {
    name?: Nullable<string>;
    description?: Nullable<Descriptions>;
    ingridients?: Nullable<string[]>;
    manufacturer?: Nullable<string>;
}

export interface InputBook {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    age?: Nullable<number>;
}

export interface UserInput {
    name?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    gender?: Nullable<Gender>;
    role?: Nullable<Role>;
    address?: Nullable<InputAddress>;
    courses?: Nullable<InputCourses[]>;
    age?: Nullable<number>;
    lastCourse?: Nullable<InputCourses>;
    completedCourses?: Nullable<InputCourses[]>;
    product?: Nullable<InputProduct[]>;
    token?: Nullable<string>;
    privateKey?: Nullable<string>;
    countryCode?: Nullable<string>;
    mobileNumber?: Nullable<number>;
    githubId?: Nullable<string>;
}

export interface BookInput {
    _id?: Nullable<string>;
    title?: Nullable<string>;
    price?: Nullable<number>;
    year?: Nullable<number>;
    author?: Nullable<AuthorInput[]>;
    userId?: Nullable<string>;
    userCollection?: Nullable<UserInput>;
    authorCollection?: Nullable<AuthorInput>;
    authorId?: Nullable<string>;
}

export interface AuthorInput {
    _id?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    age?: Nullable<number>;
}

export interface Courses {
    courseName?: Nullable<string>;
    courseStatus?: Nullable<string>;
    publication?: Nullable<string>;
    year?: Nullable<number>;
}

export interface Address {
    mainAddress?: Nullable<string>;
    city?: Nullable<string>;
    pincode?: Nullable<number>;
}

export interface Unit {
    quantity?: Nullable<number>;
    pricePerUnit?: Nullable<number>;
    totalPrice?: Nullable<number>;
}

export interface Description {
    label?: Nullable<string>;
    unit?: Nullable<Unit>;
}

export interface Product {
    name?: Nullable<string>;
    description?: Nullable<Description>;
    ingridients?: Nullable<string[]>;
    manufacturer?: Nullable<string>;
}

export interface User {
    _id?: Nullable<string>;
    name?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    gender?: Nullable<Gender>;
    role?: Nullable<Role>;
    address?: Nullable<Address>;
    courses: Courses[];
    age: number;
    lastCourse?: Nullable<Courses>;
    completedCourses?: Nullable<Courses[]>;
    product: Product[];
    filterProducts: Product[];
    totalSumPrice?: Nullable<number>;
    OveralltotalSumPrice?: Nullable<number>;
    allCourses?: Nullable<Courses[]>;
    token?: Nullable<string>;
    privateKey?: Nullable<string>;
    countryCode?: Nullable<string>;
    mobileNumber?: Nullable<number>;
    githubId?: Nullable<string>;
}

export interface AccessTokenResponse {
    access_token?: Nullable<string>;
    token_type?: Nullable<string>;
    refresh_token?: Nullable<string>;
    expires_in?: Nullable<string>;
}

export interface GithubAuthResponse {
    githubAuthUrl?: Nullable<string>;
}

export interface Author {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    age?: Nullable<number>;
}

export interface Book {
    _id?: Nullable<string>;
    title?: Nullable<string>;
    price?: Nullable<number>;
    year?: Nullable<number>;
    author?: Nullable<Author[]>;
    userId?: Nullable<string>;
    userCollection?: Nullable<User>;
    authorCollection?: Nullable<Author>;
    authorId?: Nullable<string>;
}

export interface GitHubUserDetails {
    _id: string;
    username?: Nullable<string>;
    email?: Nullable<string>;
    name?: Nullable<string>;
    githubUserMetadata?: Nullable<JSONObject>;
    access_token?: Nullable<string>;
    token_type?: Nullable<string>;
    refresh_token?: Nullable<string>;
    expires_in?: Nullable<number>;
}

export interface GitHubRepository {
    user_id: string;
    repository_type: RepositoryType;
    id?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    url?: Nullable<string>;
    githubRepositoryMetadata?: Nullable<JSONObject>;
}

export interface GitHubUserOrganization {
    id?: Nullable<number>;
    user_id: string;
    org_name?: Nullable<string>;
    node_id?: Nullable<string>;
    url?: Nullable<string>;
    repos_url?: Nullable<string>;
    members_url?: Nullable<string>;
    githubOrganizationMetadata?: Nullable<JSONObject>;
}

export interface GitHubPull {
    github_pull_metadata?: Nullable<JSONObject>;
    title: string;
    url: string;
    createdAt: DateTime;
    mergedAt: DateTime;
    closedAt: DateTime;
    updatedAt: DateTime;
    user_id: string;
    repo_id: string;
    repo_owner: string;
    repo_name: string;
    state: string;
    number: number;
    author_id: string;
}

export interface IQuery {
    index(): string | Promise<string>;
    findAllUser(role: string, minAge: number, maxAge: number): User[] | Promise<User[]>;
    findUserAll(): User[] | Promise<User[]>;
    findUserByMatch(role: string): User[] | Promise<User[]>;
    findUserByQty(quantity: number): User[] | Promise<User[]>;
    totalSumPrice(): number | Promise<number>;
    getAllCourses(): User[] | Promise<User[]>;
    findOne(email: string): User | Promise<User>;
    findEmail(email: string): User | Promise<User>;
    getGithubUserDetails(username: string): GitHubUserDetails | Promise<GitHubUserDetails>;
    findAllBookUser(): Book[] | Promise<Book[]>;
    findAllAuhtor(): Book[] | Promise<Book[]>;
    githubRepositories(username: string): GitHubRepository[] | Promise<GitHubRepository[]>;
    githubOrganizationRepositories(username: string, org_name: string): GitHubRepository[] | Promise<GitHubRepository[]>;
    githubUserOrganizations(username: string): GitHubUserOrganization[] | Promise<GitHubUserOrganization[]>;
    getPullRequests(username: string, repo_name: string): GitHubPull[] | Promise<GitHubPull[]>;
}

export interface IMutation {
    createUser(payload: UserInput): User | Promise<User>;
    updateUser(email: string, payload: UserInput): User | Promise<User>;
    deleteUser(id: string): User | Promise<User>;
    githubLogin(): GithubAuthResponse | Promise<GithubAuthResponse>;
    githubCodeExchange(code: string): AccessTokenResponse | Promise<AccessTokenResponse>;
    getGithubUser(accessToken: string): GitHubUserDetails | Promise<GitHubUserDetails>;
    createBook(title: string, author: InputBook[], price: number, year: number, userId: string): Book | Promise<Book>;
    updateBook(bookInput: BookInput, _id: string): Book | Promise<Book>;
    login(email: string, password: string): string | Promise<string>;
    logout(email: string): string | Promise<string>;
    checkDate(date: string): string | Promise<string>;
}

export type JSONObject = any;
export type DateTime = any;
type Nullable<T> = T | null;
