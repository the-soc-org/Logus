import type { Context } from "probot";

/**
 * Represents selected properties of the `octokit` object from the Probot context.
 */
export declare type CzujnikowniaOctokit = Pick<Context["octokit"], "graphql" | "rest" | "config" | "pulls" | "repos">

/**
 * Represents the context for Czujnikownia organization configuration.
 * This context includes the `octokit` instance and the organization payload.
 */
export declare type CzujnikowniaOrgConfigContext = {octokit: CzujnikowniaOctokit} 
    & {
        payload: {
            /**
             * The organization object containing the login information.
             */
            organization: {
                /**
                 * The login name of the organization.
                 */
                login: string
            }
        }
    }

/**
 * Represents the general context for Czujnikownia.
 * This context includes the `octokit` instance and the organization payload.
 */
export declare type CzujnikowniaContext = {octokit: CzujnikowniaOctokit} 
    & {
        payload: Pick<Context<"organization">["payload"], "organization">
    }

/**
 * Represents the context for pull request events in Czujnikownia.
 * This context includes the `octokit` instance, sender, repository, pull request, and organization payloads.
 */
export declare type PRCzujnikowniaContext = {octokit: CzujnikowniaOctokit}
    & {
        payload: Pick<Context<"pull_request">["payload"], "sender" | "repository">
            & {
                /**
                 * The pull request object containing the node ID.
                 */
                pull_request: Pick<Context<"pull_request">["payload"]["pull_request"], "node_id">
            }
            & {
                /**
                 * The organization object, which is non-nullable.
                 */
                organization: NonNullable<Context<"pull_request">["payload"]["organization"]>
            } 
    }

/**
 * Interface representing logging in Czujnikownia.
 */
export interface CzujnikowniaLog
{
    /**
     * Logs an informational message.
     * @param message The message to log.
     */
    info(message: string): void;

    /**
     * Logs a debug message.
     * @param message The message to log.
     */
    debug(message: string): void;
}