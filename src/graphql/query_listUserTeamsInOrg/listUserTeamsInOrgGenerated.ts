export const listUserTeamsInOrgQuery: string =`
query listUserTeamsInOrg($userLogin: String!, $organizationLogin: String!, $teamQuery: String, $repoQuery: String){ 
  user(login: $userLogin) { 
	  organization(login: $organizationLogin) {
     	login,
      teams(first: 100, query: $teamQuery) {
        edges {
          node {
            name,
            repositories(first: 100, query: $repoQuery) {
              edges {
                node {
                  id,
                  name,
                }
              }
            }
          }
        }
      }
    }
  }
}`;
export type ListUserTeamsInOrgResult = Data
// To parse this data:
//
//   import { Convert, ListUserTeamsInOrgRawResult } from "./file";
//
//   const listUserTeamsInOrgRawResult = Convert.toListUserTeamsInOrgRawResult(json);

export interface ListUserTeamsInOrgRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    user: User | null;
}

export interface User {
    organization: Organization | null;
}

export interface Organization {
    login: string;
    teams: TeamConnection;
}

export interface TeamConnection {
    edges: Array<TeamEdge | null> | null;
}

export interface TeamEdge {
    node: Team | null;
}

export interface Team {
    name:         string;
    repositories: TeamRepositoryConnection;
}

export interface TeamRepositoryConnection {
    edges: Array<TeamRepositoryEdge | null> | null;
}

export interface TeamRepositoryEdge {
    node: Repository;
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
    public static toListUserTeamsInOrgRawResult(json: string): ListUserTeamsInOrgRawResult {
        return JSON.parse(json);
    }

    public static listUserTeamsInOrgRawResultToJson(value: ListUserTeamsInOrgRawResult): string {
        return JSON.stringify(value);
    }
}
