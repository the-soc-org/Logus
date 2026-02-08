/**
 * GraphQL mutation for updating a text field value of a project item.
 *
 * @remarks
 * This mutation updates a text field on an item in a GitHub Project V2.
 * It requires the project ID, item ID, field ID, and the new text value.
 *
 * @example
 * ```
 * mutation updateItemField($projectId: ID!, $itemId: ID!, $fieldId: ID!, $text: String) {
 *   updateProjectV2ItemFieldValue(
 *     input: {
 *       projectId: $projectId
 *       itemId: $itemId
 *       fieldId: $fieldId
 *       value: { text: $text }
 *     }
 *   ) {
 *     projectV2Item { id }
 *   }
 * }
 * ```
 */
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

/**
 * Type alias for the successful result data from the update item text mutation.
 *
 * @remarks
 * This represents the data payload when the mutation executes successfully.
 */
export type UpdateItemTextResult = Data;

/**
 * Raw result interface for the update item text mutation response.
 *
 * @remarks
 * This interface represents the complete GraphQL response structure,
 * including both successful data and potential errors.
 *
 * To parse JSON data:
 * ```typescript
 * import { Convert, UpdateItemTextRawResult } from "./file";
 * const updateItemTextRawResult = Convert.toUpdateItemTextRawResult(json);
 * ```
 */
export interface UpdateItemTextRawResult {
  /** The data payload if the mutation succeeded, null otherwise */
  data: Data | null;
  /** Array of errors if the mutation failed */
  errors?: Error[];
}

/**
 * Data payload interface for the update item text mutation.
 *
 * @remarks
 * Contains the result of the updateProjectV2ItemFieldValue mutation operation.
 */
export interface Data {
  /** The payload containing the updated project item */
  updateProjectV2ItemFieldValue: UpdateProjectV2ItemFieldValuePayload | null;
}

/**
 * Payload interface for the updateProjectV2ItemFieldValue mutation result.
 *
 * @remarks
 * Represents the wrapper containing the project item that was updated.
 */
export interface UpdateProjectV2ItemFieldValuePayload {
  /** The project item that had its text field updated */
  projectV2Item: ProjectV2Item | null;
}

/**
 * Project item interface representing an item in a GitHub Project V2.
 *
 * @remarks
 * Contains the identifier of the project item that was updated.
 */
export interface ProjectV2Item {
  /** The unique identifier of the project item */
  id: string;
}

/**
 * Error interface for GraphQL mutation errors.
 *
 * @remarks
 * Represents an error that occurred during the mutation execution.
 */
export interface Error {
  /** Human-readable error message describing what went wrong */
  message: string;
}

/**
 * Utility class for converting between JSON strings and typed objects.
 *
 * @remarks
 * Provides static methods for serializing and deserializing the update item text mutation results.
 */
export class Convert {
  /**
   * Converts a JSON string to an UpdateItemTextRawResult object.
   *
   * @param json - The JSON string to parse
   * @returns The parsed UpdateItemTextRawResult object
   *
   * @example
   * ```typescript
   * const result = Convert.toUpdateItemTextRawResult(jsonString);
   * ```
   */
  public static toUpdateItemTextRawResult(
    json: string,
  ): UpdateItemTextRawResult {
    return JSON.parse(json);
  }

  /**
   * Converts an UpdateItemTextRawResult object to a JSON string.
   *
   * @param value - The UpdateItemTextRawResult object to serialize
   * @returns The JSON string representation
   *
   * @example
   * ```typescript
   * const jsonString = Convert.updateItemTextRawResultToJson(result);
   * ```
   */
  public static updateItemTextRawResultToJson(
    value: UpdateItemTextRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
