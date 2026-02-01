export const updateItemNumberMutation: string = `
mutation updateItemField($projectId: ID!, $itemId: ID!, $fieldId: ID!, $number: Float){
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { 
        number: $number      
      }
    }
  ) {
    projectV2Item {
      id
    }
  }
}`;
export type UpdateItemNumberResult = Data;
// To parse this data:
//
//   import { Convert, UpdateItemNumberRawResult } from "./file";
//
//   const updateItemNumberRawResult = Convert.toUpdateItemNumberRawResult(json);

export interface UpdateItemNumberRawResult {
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
  public static toUpdateItemNumberRawResult(
    json: string,
  ): UpdateItemNumberRawResult {
    return JSON.parse(json);
  }

  public static updateItemNumberRawResultToJson(
    value: UpdateItemNumberRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
