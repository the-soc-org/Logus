export const createProjectMutation: string =`
mutation createProject($ownerId: ID!, $title: String!) { 
  createProjectV2(input: {ownerId: $ownerId, title: $title}) {
    projectV2 {
      id
    }
  }
}`;
export type CreateProjectResult = Data
// To parse this data:
//
//   import { Convert, CreateProjectRawResult } from "./file";
//
//   const createProjectRawResult = Convert.toCreateProjectRawResult(json);

export interface CreateProjectRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    createProjectV2: CreateProjectV2Payload | null;
}

export interface CreateProjectV2Payload {
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
    public static toCreateProjectRawResult(json: string): CreateProjectRawResult {
        return JSON.parse(json);
    }

    public static createProjectRawResultToJson(value: CreateProjectRawResult): string {
        return JSON.stringify(value);
    }
}
