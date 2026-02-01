export const listOpenedProjectsInOrgQuery: string = `
query listProjectsInOrg($organizationLogin: String!, $projectQuery: String) { 
  organization(login: $organizationLogin) {
    projectsV2(first: 100, query: $projectQuery) {
      edges {
        node {
          id,
          number,
          title,
          closed,
          fields(first: 100) {
            edges {
              node {
                 ... on ProjectV2Field {
                  id,
                  name,
                  dataType,
                }
              }
            }
          }
        }
      }
    }
  }
}`;
export type ListOpenedProjectsInOrgResult = Data;
// To parse this data:
//
//   import { Convert, ListOpenedProjectsInOrgRawResult } from "./file";
//
//   const listOpenedProjectsInOrgRawResult = Convert.toListOpenedProjectsInOrgRawResult(json);

export interface ListOpenedProjectsInOrgRawResult {
  data: Data | null;
  errors?: Error[];
}

export interface Data {
  organization: Organization | null;
}

export interface Organization {
  projectsV2: ProjectV2Connection;
}

export interface ProjectV2Connection {
  edges: Array<ProjectV2Edge | null> | null;
}

export interface ProjectV2Edge {
  node: ProjectV2 | null;
}

export interface ProjectV2 {
  id: string;
  number: number;
  title: string;
  closed: boolean;
  fields: ProjectV2FieldConfigurationConnection;
}

export interface ProjectV2FieldConfigurationConnection {
  edges: Array<ProjectV2FieldConfigurationEdge | null> | null;
}

export interface ProjectV2FieldConfigurationEdge {
  node: ProjectV2FieldConfiguration | null;
}

export interface ProjectV2FieldConfiguration {
  id?: string;
  name?: string;
  dataType?: ProjectV2FieldType;
}

export enum ProjectV2FieldType {
  Assignees = "ASSIGNEES",
  Date = "DATE",
  Iteration = "ITERATION",
  Labels = "LABELS",
  LinkedPullRequests = "LINKED_PULL_REQUESTS",
  Milestone = "MILESTONE",
  Number = "NUMBER",
  Repository = "REPOSITORY",
  Reviewers = "REVIEWERS",
  SingleSelect = "SINGLE_SELECT",
  Text = "TEXT",
  Title = "TITLE",
  TrackedBy = "TRACKED_BY",
  Tracks = "TRACKS",
}

export interface Error {
  message: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toListOpenedProjectsInOrgRawResult(
    json: string,
  ): ListOpenedProjectsInOrgRawResult {
    return JSON.parse(json);
  }

  public static listOpenedProjectsInOrgRawResultToJson(
    value: ListOpenedProjectsInOrgRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
