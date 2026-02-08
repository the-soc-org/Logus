/**
 * GraphQL query for listing GitHub Projects in an organization.
 *
 * @remarks
 * This query retrieves all GitHub Project V2 items in an organization,
 * including their metadata (id, number, title, closed status) and field configurations.
 * Supports filtering projects by a search query.
 *
 * @example
 * ```
 * query listProjectsInOrg($organizationLogin: String!, $projectQuery: String) {
 *   organization(login: $organizationLogin) {
 *     projectsV2(first: 100, query: $projectQuery) {
 *       edges { node { id, number, title, closed, fields(first: 100) { ... } } }
 *     }
 *   }
 * }
 * ```
 */
export const listOpenedProjectsInOrgQuery: string = `
query listProjectsInOrg($organizationLogin: String!, $projectQuery: String) { 
  organization(login: $organizationLogin) {
    projectsV2(first: 100, query: $projectQuery) {
      edges {
        node {
          id,
          number,
          title,
          closed,
          fields(first: 100) {
            edges {
              node {
                 ... on ProjectV2Field {
                  id,
                  name,
                  dataType,
                }
              }
            }
          }
        }
      }
    }
  }
}`;

/**
 * Type alias for the successful result data from the list opened projects query.
 *
 * @remarks
 * This represents the data payload when the query executes successfully.
 */
export type ListOpenedProjectsInOrgResult = Data;

/**
 * Raw result interface for the list opened projects query response.
 *
 * @remarks
 * This interface represents the complete GraphQL response structure,
 * including both successful data and potential errors.
 *
 * To parse JSON data:
 * ```typescript
 * import { Convert, ListOpenedProjectsInOrgRawResult } from "./file";
 * const listOpenedProjectsInOrgRawResult = Convert.toListOpenedProjectsInOrgRawResult(json);
 * ```
 */

export interface ListOpenedProjectsInOrgRawResult {
  data: Data | null;
  errors?: Error[];
}

/**
 * Data payload interface for the list opened projects query.
 *
 * @remarks
 * Contains the result of the organization query operation with its projects.
 */
export interface Data {
  /** The organization containing the projects */
  organization: Organization | null;
}

/**
 * Organization interface representing a GitHub organization.
 *
 * @remarks
 * Contains the connection to projects in the organization.
 */
export interface Organization {
  /** The connection containing all projects in this organization */
  projectsV2: ProjectV2Connection;
}

/**
 * Connection interface for Project V2 edges.
 *
 * @remarks
 * Represents a paginated connection of projects, allowing traversal through edges.
 */
export interface ProjectV2Connection {
  /** Array of edges, each containing a project node */
  edges: Array<ProjectV2Edge | null> | null;
}

/**
 * Edge interface wrapping a Project V2 node.
 *
 * @remarks
 * Represents an edge in the project connection, containing the actual project data.
 */
export interface ProjectV2Edge {
  /** The project node at the end of this edge */
  node: ProjectV2 | null;
}

/**
 * Project V2 interface representing a GitHub Project.
 *
 * @remarks
 * Contains comprehensive project metadata including fields configuration.
 */
export interface ProjectV2 {
  /** The unique identifier of the project */
  id: string;
  /** The project number within the organization */
  number: number;
  /** The title of the project */
  title: string;
  /** Whether the project is closed */
  closed: boolean;
  /** The connection to fields configured in this project */
  fields: ProjectV2FieldConfigurationConnection;
}

/**
 * Connection interface for Project V2 field configuration edges.
 *
 * @remarks
 * Represents a paginated connection of field configurations in a project.
 */
export interface ProjectV2FieldConfigurationConnection {
  /** Array of edges, each containing a field configuration node */
  edges: Array<ProjectV2FieldConfigurationEdge | null> | null;
}

/**
 * Edge interface wrapping a field configuration node.
 *
 * @remarks
 * Represents an edge in the field configuration connection.
 */
export interface ProjectV2FieldConfigurationEdge {
  /** The field configuration node at the end of this edge */
  node: ProjectV2FieldConfiguration | null;
}

/**
 * Field configuration interface for Project V2 fields.
 *
 * @remarks
 * Contains metadata about a field in a project, including its name and data type.
 */
export interface ProjectV2FieldConfiguration {
  /** The unique identifier of the field */
  id?: string;
  /** The name of the field */
  name?: string;
  /** The data type of the field */
  dataType?: ProjectV2FieldType;
}

/**
 * Enumeration of Project V2 field types.
 *
 * @remarks
 * Represents the different types of fields that can be configured in a GitHub Project V2.
 */
export enum ProjectV2FieldType {
  /** Assignees field type for tracking assigned users */
  Assignees = "ASSIGNEES",
  /** Date field type for date values */
  Date = "DATE",
  /** Iteration field type for tracking iterations */
  Iteration = "ITERATION",
  /** Labels field type for labeling items */
  Labels = "LABELS",
  /** Linked pull requests field type */
  LinkedPullRequests = "LINKED_PULL_REQUESTS",
  /** Milestone field type for milestone tracking */
  Milestone = "MILESTONE",
  /** Number field type for numeric values */
  Number = "NUMBER",
  /** Repository field type */
  Repository = "REPOSITORY",
  /** Reviewers field type for code review tracking */
  Reviewers = "REVIEWERS",
  /** Single select field type for dropdown selections */
  SingleSelect = "SINGLE_SELECT",
  /** Text field type for text values */
  Text = "TEXT",
  /** Title field type for item titles */
  Title = "TITLE",
  /** Tracked by field type for dependency tracking */
  TrackedBy = "TRACKED_BY",
  /** Tracks field type for tracking relationships */
  Tracks = "TRACKS",
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
 * Provides static methods for serializing and deserializing the list opened projects query results.
 */
export class Convert {
  /**
   * Converts a JSON string to a ListOpenedProjectsInOrgRawResult object.
   *
   * @param json - The JSON string to parse
   * @returns The parsed ListOpenedProjectsInOrgRawResult object
   *
   * @example
   * ```typescript
   * const result = Convert.toListOpenedProjectsInOrgRawResult(jsonString);
   * ```
   */
  public static toListOpenedProjectsInOrgRawResult(
    json: string,
  ): ListOpenedProjectsInOrgRawResult {
    return JSON.parse(json);
  }

  /**
   * Converts a ListOpenedProjectsInOrgRawResult object to a JSON string.
   *
   * @param value - The ListOpenedProjectsInOrgRawResult object to serialize
   * @returns The JSON string representation
   *
   * @example
   * ```typescript
   * const jsonString = Convert.listOpenedProjectsInOrgRawResultToJson(result);
   * ```
   */
  public static listOpenedProjectsInOrgRawResultToJson(
    value: ListOpenedProjectsInOrgRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
