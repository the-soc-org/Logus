export const listOpenedPullRequestsQuery: string =`
query listOpenedPullRequests($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    pullRequests(states: OPEN, first: 100) {
      nodes {
        id
        number
        title
        updatedAt
        author {
          login
        }
        assignees(first: 5) {
          nodes {
            login
          }
        }
        reviewRequests(last: 5) {
          nodes {
            asCodeOwner
            requestedReviewer {
              ... on User {
                login
              }
            }
          }
        }
        reviews(last: 10) {
          nodes {
            id
            updatedAt
            state
            author {
              login
            }
            comments(last: 50) {
              nodes {
                id
                updatedAt
                author {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
}`;
export type ListOpenedPullRequestsResult = Data
// To parse this data:
//
//   import { Convert, ListOpenedPullRequestsRawResult } from "./file";
//
//   const listOpenedPullRequestsRawResult = Convert.toListOpenedPullRequestsRawResult(json);

export interface ListOpenedPullRequestsRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    repository: Repository | null;
}

export interface Repository {
    pullRequests: PullRequestConnection;
}

export interface PullRequestConnection {
    nodes: Array<PullRequest | null> | null;
}

export interface PullRequest {
    id:             string;
    number:         number;
    title:          string;
    updatedAt:      string;
    author:         Actor | null;
    assignees:      UserConnection;
    reviewRequests: ReviewRequestConnection | null;
    reviews:        PullRequestReviewConnection | null;
}

export interface UserConnection {
    nodes: Array<Actor | null> | null;
}

export interface Actor {
    login?: string;
}

export interface ReviewRequestConnection {
    nodes: Array<ReviewRequest | null> | null;
}

export interface ReviewRequest {
    asCodeOwner:       boolean;
    requestedReviewer: Actor | null;
}

export interface PullRequestReviewConnection {
    nodes: Array<PullRequestReview | null> | null;
}

export interface PullRequestReview {
    id:        string;
    updatedAt: string;
    state:     PullRequestReviewState;
    author:    Actor | null;
    comments:  PullRequestReviewCommentConnection;
}

export interface PullRequestReviewCommentConnection {
    nodes: Array<PullRequestReviewComment | null> | null;
}

export interface PullRequestReviewComment {
    id:        string;
    updatedAt: string;
    author:    Actor | null;
}

export enum PullRequestReviewState {
    Approved = "APPROVED",
    ChangesRequested = "CHANGES_REQUESTED",
    Commented = "COMMENTED",
    Dismissed = "DISMISSED",
    Pending = "PENDING",
}

export interface Error {
    message: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toListOpenedPullRequestsRawResult(json: string): ListOpenedPullRequestsRawResult {
        return JSON.parse(json);
    }

    public static listOpenedPullRequestsRawResultToJson(value: ListOpenedPullRequestsRawResult): string {
        return JSON.stringify(value);
    }
}
