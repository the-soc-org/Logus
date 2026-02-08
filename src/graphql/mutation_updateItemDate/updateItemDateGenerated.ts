/**
 * GraphQL mutation for updating a date field value of a project item.
 *
 * @remarks
 * This mutation updates a date field on an item in a GitHub Project V2.
 * It requires the project ID, item ID, field ID, and the new date value.
 *
 * @example
 * ```
 * mutation updateItemField($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date) {
 *   updateProjectV2ItemFieldValue(
 *     input: {
 *       projectId: $projectId
 *       itemId: $itemId
 *       fieldId: $fieldId
 *       value: { date: $date }
 *     }
 *   ) {
 *     projectV2Item { id }
 *   }
 * }
 * ```
 */
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

/**
 * Type alias for the successful result data from the update item date mutation.
 *
 * @remarks
 * This represents the data payload when the mutation executes successfully.
 */
export type UpdateItemDateResult = Data;

/**
 * Raw result interface for the update item date mutation response.
 *
 * @remarks
 * This interface represents the complete GraphQL response structure,
 * including both successful data and potential errors.
 *
 * To parse JSON data:
 * ```typescript
 * import { Convert, UpdateItemDateRawResult } from "./file";
 * const updateItemDateRawResult = Convert.toUpdateItemDateRawResult(json);
 * ```
 */
export interface UpdateItemDateRawResult {
  /** The data payload if the mutation succeeded, null otherwise */
  data: Data | null;
  /** Array of errors if the mutation failed */
  errors?: Error[];
}

/**
 * Data payload interface for the update item date mutation.
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
  /** The project item that had its date field updated */
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
 * Provides static methods for serializing and deserializing the update item date mutation results.
 */
export class Convert {
  /**
   * Converts a JSON string to an UpdateItemDateRawResult object.
   *
   * @param json - The JSON string to parse
   * @returns The parsed UpdateItemDateRawResult object
   *
   * @example
   * ```typescript
   * const result = Convert.toUpdateItemDateRawResult(jsonString);
   * ```
   */
  public static toUpdateItemDateRawResult(
    json: string,
  ): UpdateItemDateRawResult {
    return JSON.parse(json);
  }

  /**
   * Converts an UpdateItemDateRawResult object to a JSON string.
   *
   * @param value - The UpdateItemDateRawResult object to serialize
   * @returns The JSON string representation
   *
   * @example
   * ```typescript
   * const jsonString = Convert.updateItemDateRawResultToJson(result);
   * ```
   */
  public static updateItemDateRawResultToJson(
    value: UpdateItemDateRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
