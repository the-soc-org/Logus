export const copyProjectMutation: string =`
mutation copyProject($projectId: ID!, $ownerId: ID!, $title: String!){
  copyProjectV2(input:{projectId: $projectId, ownerId: $ownerId, title: $title}) {
    projectV2 {
      id,
      number
    }
  }
}`;
export type CopyProjectResult = Data
// To parse this data:
//
//   import { Convert, CopyProjectRawResult } from "./file";
//
//   const copyProjectRawResult = Convert.toCopyProjectRawResult(json);

export interface CopyProjectRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    copyProjectV2: CopyProjectV2Payload | null;
}

export interface CopyProjectV2Payload {
    projectV2: ProjectV2 | null;
}

export interface ProjectV2 {
    id:     string;
    number: number;
}

export interface Error {
    message: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCopyProjectRawResult(json: string): CopyProjectRawResult {
        return JSON.parse(json);
    }

    public static copyProjectRawResultToJson(value: CopyProjectRawResult): string {
        return JSON.stringify(value);
    }
}
