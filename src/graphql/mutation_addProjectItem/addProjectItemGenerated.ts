export const addProjectItemMutation: string = `
mutation addProjectItem($projectId:ID!, $contentId:ID!, $fieldName: String!) {
    addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
      item {
        id,
        fieldValueByName(name: $fieldName) {
          ... on ProjectV2ItemFieldNumberValue {
            number
          },
          ... on ProjectV2ItemFieldDateValue {
            date
          }
        }
      }
    }
  }`;
export type AddProjectItemResult = Data;
// To parse this data:
//
//   import { Convert, AddProjectItemRawResult } from "./file";
//
//   const addProjectItemRawResult = Convert.toAddProjectItemRawResult(json);

export interface AddProjectItemRawResult {
  data: Data | null;
  errors?: Error[];
}

export interface Data {
  addProjectV2ItemById: AddProjectV2ItemByIDPayload | null;
}

export interface AddProjectV2ItemByIDPayload {
  item: ProjectV2Item | null;
}

export interface ProjectV2Item {
  id: string;
  fieldValueByName: ProjectV2ItemFieldValue | null;
}

export interface ProjectV2ItemFieldValue {
  number?: number | null;
  date?: null | string;
}

export interface Error {
  message: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toAddProjectItemRawResult(
    json: string,
  ): AddProjectItemRawResult {
    return JSON.parse(json);
  }

  public static addProjectItemRawResultToJson(
    value: AddProjectItemRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
