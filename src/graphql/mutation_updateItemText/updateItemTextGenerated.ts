export const updateItemTextMutation: string = `
mutation updateItemField($projectId: ID!, $itemId: ID!, $fieldId: ID!, $text: String){
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { 
        text: $text      
      }
    }
  ) {
    projectV2Item {
      id
    }
  }
}`;
export type UpdateItemTextResult = Data;
// To parse this data:
//
//   import { Convert, UpdateItemTextRawResult } from "./file";
//
//   const updateItemTextRawResult = Convert.toUpdateItemTextRawResult(json);

export interface UpdateItemTextRawResult {
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
  public static toUpdateItemTextRawResult(
    json: string,
  ): UpdateItemTextRawResult {
    return JSON.parse(json);
  }

  public static updateItemTextRawResultToJson(
    value: UpdateItemTextRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
