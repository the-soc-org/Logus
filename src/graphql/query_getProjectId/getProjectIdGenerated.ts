/**
 * GraphQL query for retrieving a project ID from a GitHub organization.
 *
 * @remarks
 * This query fetches the ID of a GitHub Project V2 by its organization login and project number.
 *
 * @example
 * ```
 * query getProjectId($organizationLogin: String!, $projectNumber: Int!) {
 *   organization(login: $organizationLogin) {
 *     projectV2(number: $projectNumber) {
 *       id
 *     }
 *   }
 * }
 * ```
 */
export const getProjectIdQuery: string = `
query getProjectId($organizationLogin: String!, $projectNumber: Int!) {
  organization(login: $organizationLogin) {
    projectV2(number: $projectNumber) {
      id
    }
  }
}`;

/**
 * Type alias for the successful result data from the get project ID query.
 *
 * @remarks
 * This represents the data payload when the query executes successfully.
 */
export type GetProjectIdResult = Data;

/**
 * Raw result interface for the get project ID query response.
 *
 * @remarks
 * This interface represents the complete GraphQL response structure,
 * including both successful data and potential errors.
 *
 * To parse JSON data:
 * ```typescript
 * import { Convert, GetProjectIDRawResult } from "./file";
 * const getProjectIDRawResult = Convert.toGetProjectIDRawResult(json);
 * ```
 */

export interface GetProjectIDRawResult {
  data: Data | null;
  errors?: Error[];
}

/**
 * Data payload interface for the get project ID query.
 *
 * @remarks
 * Contains the result of the organization query operation.
 */
export interface Data {
  /** The organization containing the project */
  organization: Organization | null;
}

/**
 * Organization interface representing a GitHub organization.
 *
 * @remarks
 * Contains the project V2 that matches the specified project number.
 */
export interface Organization {
  /** The GitHub Project V2 within the organization */
  projectV2: ProjectV2 | null;
}

/**
 * Project V2 interface representing a GitHub Project (version 2).
 *
 * @remarks
 * Contains the unique identifier of the project.
 */
export interface ProjectV2 {
  /** The unique identifier of the project */
  id: string;
}

/**
 * Error interface for GraphQL query errors.
 *
 * @remarks
 * Represents an error that occurred during the query execution.
 */
export interface Error {
  /** Human-readable error message describing what went wrong */
  message: string;
}

/**
 * Utility class for converting between JSON strings and typed objects.
 *
 * @remarks
 * Provides static methods for serializing and deserializing the get project ID query results.
 */
export class Convert {
  /**
   * Converts a JSON string to a GetProjectIDRawResult object.
   *
   * @param json - The JSON string to parse
   * @returns The parsed GetProjectIDRawResult object
   *
   * @example
   * ```typescript
   * const result = Convert.toGetProjectIDRawResult(jsonString);
   * ```
   */
  public static toGetProjectIDRawResult(json: string): GetProjectIDRawResult {
    return JSON.parse(json);
  }

  /**
   * Converts a GetProjectIDRawResult object to a JSON string.
   *
   * @param value - The GetProjectIDRawResult object to serialize
   * @returns The JSON string representation
   *
   * @example
   * ```typescript
   * const jsonString = Convert.getProjectIDRawResultToJson(result);
   * ```
   */
  public static getProjectIDRawResultToJson(
    value: GetProjectIDRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
