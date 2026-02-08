/**
 * GraphQL mutation for adding assignees to a pull request.
 *
 * @remarks
 * This mutation adds specified assignees to a pull request using GitHub's GraphQL API.
 * It requires the pull request ID and assignee ID as parameters.
 *
 * @example
 * ```
 * mutation addAssignee($pullRequestId: ID!, $assignee: ID!) {
 *   addAssigneesToAssignable(input: {
 *     assignableId: $pullRequestId,
 *     assigneeIds: [$assignee]
 *   }) {
 *     assignable {
 *       ... on PullRequest {
 *         id
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const addAssigneeMutation: string = `
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

/**
 * Type alias for the successful result data from the add assignee mutation.
 *
 * @remarks
 * This represents the data payload when the mutation executes successfully.
 */
export type AddAssigneeResult = Data;

/**
 * Raw result interface for the add assignee mutation response.
 *
 * @remarks
 * This interface represents the complete GraphQL response structure,
 * including both successful data and potential errors.
 *
 * To parse JSON data:
 * ```typescript
 * import { Convert, AddAssigneeRawResult } from "./file";
 * const addAssigneeRawResult = Convert.toAddAssigneeRawResult(json);
 * ```
 */
export interface AddAssigneeRawResult {
  /** The data payload if the mutation succeeded, null otherwise */
  data: Data | null;
  /** Array of errors if the mutation failed */
  errors?: Error[];
}

/**
 * Data payload interface for the add assignee mutation.
 *
 * @remarks
 * Contains the result of the addAssigneesToAssignable mutation operation.
 */
export interface Data {
  /** The payload containing the assignable entity (pull request) with updated assignees */
  addAssigneesToAssignable: AddAssigneesToAssignablePayload | null;
}

/**
 * Payload interface for the addAssigneesToAssignable mutation result.
 *
 * @remarks
 * Represents the wrapper containing the assignable entity after adding assignees.
 */
export interface AddAssigneesToAssignablePayload {
  /** The assignable entity (pull request) that received the assignees */
  assignable: Assignable | null;
}

/**
 * Assignable entity interface representing a pull request.
 *
 * @remarks
 * Contains the identifier of the assignable entity (pull request) that was modified.
 */
export interface Assignable {
  /** The unique identifier of the assignable entity */
  id?: string;
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
 * Provides static methods for serializing and deserializing the add assignee mutation results.
 */
export class Convert {
  /**
   * Converts a JSON string to an AddAssigneeRawResult object.
   *
   * @param json - The JSON string to parse
   * @returns The parsed AddAssigneeRawResult object
   *
   * @example
   * ```typescript
   * const result = Convert.toAddAssigneeRawResult(jsonString);
   * ```
   */
  public static toAddAssigneeRawResult(json: string): AddAssigneeRawResult {
    return JSON.parse(json);
  }

  /**
   * Converts an AddAssigneeRawResult object to a JSON string.
   *
   * @param value - The AddAssigneeRawResult object to serialize
   * @returns The JSON string representation
   *
   * @example
   * ```typescript
   * const jsonString = Convert.addAssigneeRawResultToJson(result);
   * ```
   */
  public static addAssigneeRawResultToJson(
    value: AddAssigneeRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
