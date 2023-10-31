export const addCommentMutation: string =`
mutation addCommentMutation($subjectId: ID!, $body: String!) {
  addComment(
    input: {
      subjectId: $subjectId,
      body: $body
    }
  ) {
    subject {
      id
    }
  }
}`;
export type AddCommentResult = Data
// To parse this data:
//
//   import { Convert, AddCommentRawResult } from "./file";
//
//   const addCommentRawResult = Convert.toAddCommentRawResult(json);

export interface AddCommentRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    addComment: AddCommentPayload | null;
}

export interface AddCommentPayload {
    subject: Node | null;
}

export interface Node {
    id: string;
}

export interface Error {
    message: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toAddCommentRawResult(json: string): AddCommentRawResult {
        return JSON.parse(json);
    }

    public static addCommentRawResultToJson(value: AddCommentRawResult): string {
        return JSON.stringify(value);
    }
}
