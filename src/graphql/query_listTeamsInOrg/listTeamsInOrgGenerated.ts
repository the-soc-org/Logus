export const listTeamsInOrgQuery: string =`
query listTeamsInOrg($organizationLogin: String!, $repoQuery: String!, $teamQuery: String){  
organization(login: $organizationLogin) {
     	login,
      teams(first: 100, query: $teamQuery) {
          nodes {
            id,
            name,
            projectsV2(first: 100) {
              nodes {
                id,
                title,
                closed,
              }
            },
            repositories(first: 100, query: $repoQuery) {
              nodes {
                id,
                name,
              }
            }
          }
      }
    }
}`;
export type ListTeamsInOrgResult = Data
// To parse this data:
//
//   import { Convert, ListTeamsInOrgRawResult } from "./file";
//
//   const listTeamsInOrgRawResult = Convert.toListTeamsInOrgRawResult(json);

export interface ListTeamsInOrgRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    organization: Organization | null;
}

export interface Organization {
    login: string;
    teams: TeamConnection;
}

export interface TeamConnection {
    nodes: Array<Team | null> | null;
}

export interface Team {
    id:           string;
    name:         string;
    projectsV2:   ProjectV2Connection;
    repositories: TeamRepositoryConnection;
}

export interface ProjectV2Connection {
    nodes: Array<ProjectV2 | null> | null;
}

export interface ProjectV2 {
    id:     string;
    title:  string;
    closed: boolean;
}

export interface TeamRepositoryConnection {
    nodes: Array<Repository | null> | null;
}

export interface Repository {
    id:   string;
    name: string;
}

export interface Error {
    message: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toListTeamsInOrgRawResult(json: string): ListTeamsInOrgRawResult {
        return JSON.parse(json);
    }

    public static listTeamsInOrgRawResultToJson(value: ListTeamsInOrgRawResult): string {
        return JSON.stringify(value);
    }
}
