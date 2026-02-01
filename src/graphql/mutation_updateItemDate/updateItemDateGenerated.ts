export const updateItemDateMutation: string = `
mutation updateItemField($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date){
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { 
        date: $date      
      }
    }
  ) {
    projectV2Item {
      id
    }
  }
}`;
export type UpdateItemDateResult = Data;
// To parse this data:
//
//   import { Convert, UpdateItemDateRawResult } from "./file";
//
//   const updateItemDateRawResult = Convert.toUpdateItemDateRawResult(json);

export interface UpdateItemDateRawResult {
  data: Data | null;
  errors?: Error[];
}

export interface Data {
  updateProjectV2ItemFieldValue: UpdateProjectV2ItemFieldValuePayload | null;
}

export interface UpdateProjectV2ItemFieldValuePayload {
  projectV2Item: ProjectV2Item | null;
}

export interface ProjectV2Item {
  id: string;
}

export interface Error {
  message: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toUpdateItemDateRawResult(
    json: string,
  ): UpdateItemDateRawResult {
    return JSON.parse(json);
  }

  public static updateItemDateRawResultToJson(
    value: UpdateItemDateRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
