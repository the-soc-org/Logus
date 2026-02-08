/**
 * GraphQL mutation for updating a number field value of a project item.
 *
 * @remarks
 * This mutation updates a numeric field on an item in a GitHub Project V2.
 * It requires the project ID, item ID, field ID, and the new number value.
 *
 * @example
 * ```
 * mutation updateItemField($projectId: ID!, $itemId: ID!, $fieldId: ID!, $number: Float) {
 *   updateProjectV2ItemFieldValue(
 *     input: {
 *       projectId: $projectId
 *       itemId: $itemId
 *       fieldId: $fieldId
 *       value: { number: $number }
 *     }
 *   ) {
 *     projectV2Item { id }
 *   }
 * }
 * ```
 */
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

/**
 * Type alias for the successful result data from the update item number mutation.
 *
 * @remarks
 * This represents the data payload when the mutation executes successfully.
 */
export type UpdateItemNumberResult = Data;

/**
 * Raw result interface for the update item number mutation response.
 *
 * @remarks
 * This interface represents the complete GraphQL response structure,
 * including both successful data and potential errors.
 *
 * To parse JSON data:
 * ```typescript
 * import { Convert, UpdateItemNumberRawResult } from "./file";
 * const updateItemNumberRawResult = Convert.toUpdateItemNumberRawResult(json);
 * ```
 */
export interface UpdateItemNumberRawResult {
  /** The data payload if the mutation succeeded, null otherwise */
  data: Data | null;
  /** Array of errors if the mutation failed */
  errors?: Error[];
}

/**
 * Data payload interface for the update item number mutation.
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
  /** The project item that had its number field updated */
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
 * Provides static methods for serializing and deserializing the update item number mutation results.
 */
export class Convert {
  /**
   * Converts a JSON string to an UpdateItemNumberRawResult object.
   *
   * @param json - The JSON string to parse
   * @returns The parsed UpdateItemNumberRawResult object
   *
   * @example
   * ```typescript
   * const result = Convert.toUpdateItemNumberRawResult(jsonString);
   * ```
   */
  public static toUpdateItemNumberRawResult(
    json: string,
  ): UpdateItemNumberRawResult {
    return JSON.parse(json);
  }

  /**
   * Converts an UpdateItemNumberRawResult object to a JSON string.
   *
   * @param value - The UpdateItemNumberRawResult object to serialize
   * @returns The JSON string representation
   *
   * @example
   * ```typescript
   * const jsonString = Convert.updateItemNumberRawResultToJson(result);
   * ```
   */
  public static updateItemNumberRawResultToJson(
    value: UpdateItemNumberRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
