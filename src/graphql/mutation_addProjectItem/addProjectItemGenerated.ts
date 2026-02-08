/**
 * GraphQL mutation for adding an item to a GitHub project.
 *
 * @remarks
 * This mutation adds a content item (such as an issue or pull request) to a GitHub Project V2.
 * It requires the project ID, content ID, and field name as parameters.
 *
 * @example
 * ```
 * mutation addProjectItem($projectId:ID!, $contentId:ID!, $fieldName: String!) {
 *   addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
 *     item {
 *       id,
 *       fieldValueByName(name: $fieldName) {
 *         ... on ProjectV2ItemFieldNumberValue { number },
 *         ... on ProjectV2ItemFieldDateValue { date }
 *       }
 *     }
 *   }
 * }
 * ```
 */
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

/**
 * Type alias for the successful result data from the add project item mutation.
 *
 * @remarks
 * This represents the data payload when the mutation executes successfully.
 */
export type AddProjectItemResult = Data;

/**
 * Raw result interface for the add project item mutation response.
 *
 * @remarks
 * This interface represents the complete GraphQL response structure,
 * including both successful data and potential errors.
 *
 * To parse JSON data:
 * ```typescript
 * import { Convert, AddProjectItemRawResult } from "./file";
 * const addProjectItemRawResult = Convert.toAddProjectItemRawResult(json);
 * ```
 */
export interface AddProjectItemRawResult {
  /** The data payload if the mutation succeeded, null otherwise */
  data: Data | null;
  /** Array of errors if the mutation failed */
  errors?: Error[];
}

/**
 * Data payload interface for the add project item mutation.
 *
 * @remarks
 * Contains the result of the addProjectV2ItemById mutation operation.
 */
export interface Data {
  /** The payload containing the newly added project item */
  addProjectV2ItemById: AddProjectV2ItemByIDPayload | null;
}

/**
 * Payload interface for the addProjectV2ItemById mutation result.
 *
 * @remarks
 * Represents the wrapper containing the project item that was added.
 */
export interface AddProjectV2ItemByIDPayload {
  /** The project item that was added to the project */
  item: ProjectV2Item | null;
}

/**
 * Project item interface representing an item in a GitHub Project V2.
 *
 * @remarks
 * Contains the item's identifier and field values (number or date).
 */
export interface ProjectV2Item {
  /** The unique identifier of the project item */
  id: string;
  /** The field value associated with the specified field name, can be a number or date */
  fieldValueByName: ProjectV2ItemFieldValue | null;
}

/**
 * Field value interface for project item fields.
 *
 * @remarks
 * Represents a field value that can be either a number or a date.
 * Only one of the properties will be populated depending on the field type.
 */
export interface ProjectV2ItemFieldValue {
  /** The numeric value if the field is a number type */
  number?: number | null;
  /** The date value if the field is a date type */
  date?: null | string;
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
 * Provides static methods for serializing and deserializing the add project item mutation results.
 */
export class Convert {
  /**
   * Converts a JSON string to an AddProjectItemRawResult object.
   *
   * @param json - The JSON string to parse
   * @returns The parsed AddProjectItemRawResult object
   *
   * @example
   * ```typescript
   * const result = Convert.toAddProjectItemRawResult(jsonString);
   * ```
   */
  public static toAddProjectItemRawResult(
    json: string,
  ): AddProjectItemRawResult {
    return JSON.parse(json);
  }

  /**
   * Converts an AddProjectItemRawResult object to a JSON string.
   *
   * @param value - The AddProjectItemRawResult object to serialize
   * @returns The JSON string representation
   *
   * @example
   * ```typescript
   * const jsonString = Convert.addProjectItemRawResultToJson(result);
   * ```
   */
  public static addProjectItemRawResultToJson(
    value: AddProjectItemRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
