export const closeProjectMutation: string =`
mutation closeProjectV2($projectId: ID!){
  updateProjectV2(input: {
    projectId: $projectId,
    closed: true
  }) {
    projectV2 {
      id
    }
  }
}`;
export type CloseProjectResult = Data
// To parse this data:
//
//   import { Convert, CloseProjectRawResult } from "./file";
//
//   const closeProjectRawResult = Convert.toCloseProjectRawResult(json);

export interface CloseProjectRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    updateProjectV2: UpdateProjectV2Payload | null;
}

export interface UpdateProjectV2Payload {
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
    public static toCloseProjectRawResult(json: string): CloseProjectRawResult {
        return JSON.parse(json);
    }

    public static closeProjectRawResultToJson(value: CloseProjectRawResult): string {
        return JSON.stringify(value);
    }
}
