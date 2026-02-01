export const getProjectIdQuery: string = `
query getProjectId($organizationLogin: String!, $projectNumber: Int!) {
  organization(login: $organizationLogin) {
    projectV2(number: $projectNumber) {
      id
    }
  }
}`;
export type GetProjectIdResult = Data;
// To parse this data:
//
//   import { Convert, GetProjectIDRawResult } from "./file";
//
//   const getProjectIDRawResult = Convert.toGetProjectIDRawResult(json);

export interface GetProjectIDRawResult {
  data: Data | null;
  errors?: Error[];
}

export interface Data {
  organization: Organization | null;
}

export interface Organization {
  projectV2: ProjectV2 | null;
}

export interface ProjectV2 {
  id: string;
}

export interface Error {
  message: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toGetProjectIDRawResult(json: string): GetProjectIDRawResult {
    return JSON.parse(json);
  }

  public static getProjectIDRawResultToJson(
    value: GetProjectIDRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
