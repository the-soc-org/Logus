export const addAssigneeMutation: string =`
mutation addAssignee($pullRequestId: ID!, $assignee: ID!) {
  addAssigneesToAssignable(input:
    {
      assignableId: $pullRequestId,
    	assigneeIds: [
      	$assignee
    	]
    }) {
    assignable {
      ... on PullRequest {
        id
      }
    }
  }
}`;
export type AddAssigneeResult = Data
// To parse this data:
//
//   import { Convert, AddAssigneeRawResult } from "./file";
//
//   const addAssigneeRawResult = Convert.toAddAssigneeRawResult(json);

export interface AddAssigneeRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    addAssigneesToAssignable: AddAssigneesToAssignablePayload | null;
}

export interface AddAssigneesToAssignablePayload {
    assignable: Assignable | null;
}

export interface Assignable {
    id?: string;
}

export interface Error {
    message: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toAddAssigneeRawResult(json: string): AddAssigneeRawResult {
        return JSON.parse(json);
    }

    public static addAssigneeRawResultToJson(value: AddAssigneeRawResult): string {
        return JSON.stringify(value);
    }
}
