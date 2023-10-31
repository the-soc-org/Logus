import { Context } from "probot";

export declare type CzujnikowniaOctokit = Pick<Context["octokit"], "graphql" | "rest" | "config" | "pulls">

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

export interface ScheduleContext {
    octokit: CzujnikowniaOctokit;
    payload: {
        repository: {
            node_id: string;
            name: string;
            open_issues: number;
            owner: {
                node_id: string;
                login: string;
            }
        },
        installation: {
            account: {
                login: string;
            }
        }
    }
}