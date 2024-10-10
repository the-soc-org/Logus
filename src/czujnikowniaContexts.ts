import type { Context } from "probot";

export declare type CzujnikowniaOctokit = Pick<Context["octokit"], "graphql" | "rest" | "config" | "pulls" | "repos">

export declare type CzujnikowniaOrgConfigContext = {octokit: CzujnikowniaOctokit} 
    & {
        payload: {
            organization: {
                login: string
            }
        }
    }

export declare type CzujnikowniaContext = {octokit: CzujnikowniaOctokit} 
    & {
        payload: Pick<Context<"organization">["payload"], "organization">
    }

export declare type PRCzujnikowniaContext = {octokit: CzujnikowniaOctokit}
    & {
        payload: Pick<Context<"pull_request">["payload"], "sender" | "repository">
            & {
                pull_request: Pick<Context<"pull_request">["payload"]["pull_request"], "node_id">
            }
            & {
                organization: NonNullable<Context<"pull_request">["payload"]["organization"]>
            } 
    }

export interface CzujnikowniaLog
{
    info(message: string): void;
    debug(message: string): void;
}