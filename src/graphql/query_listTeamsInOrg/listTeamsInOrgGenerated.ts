/**
 * GraphQL query for listing teams in a GitHub organization.
 *
 * @remarks
 * This query retrieves all teams in a GitHub organization, including their metadata,
 * associated projects V2, and repositories. Supports filtering teams and repositories by search queries.
 *
 * @example
 * ```
 * query listTeamsInOrg($organizationLogin: String!, $repoQuery: String!, $teamQuery: String) {
 *   organization(login: $organizationLogin) {
 *     login,
 *     teams(first: 100, query: $teamQuery) {
 *       nodes { id, name, projectsV2(...), repositories(...) }
 *     }
 *   }
 * }
 * ```
 */
export const listTeamsInOrgQuery: string = `
query listTeamsInOrg($organizationLogin: String!, $repoQuery: String!, $teamQuery: String){  
organization(login: $organizationLogin) {
     	login,
      teams(first: 100, query: $teamQuery) {
          nodes {
            id,
            name,
            projectsV2(first: 100) {
              nodes {
                id,
                title,
                closed,
              }
            },
            repositories(first: 100, query: $repoQuery) {
              nodes {
                id,
                name,
              }
            }
          }
      }
    }
}`;

/**
 * Type alias for the successful result data from the list teams query.
 *
 * @remarks
 * This represents the data payload when the query executes successfully.
 */
export type ListTeamsInOrgResult = Data;

/**
 * Raw result interface for the list teams query response.
 *
 * @remarks
 * This interface represents the complete GraphQL response structure,
 * including both successful data and potential errors.
 *
 * To parse JSON data:
 * ```typescript
 * import { Convert, ListTeamsInOrgRawResult } from "./file";
 * const listTeamsInOrgRawResult = Convert.toListTeamsInOrgRawResult(json);
 * ```
 */

export interface ListTeamsInOrgRawResult {
  data: Data | null;
  errors?: Error[];
}

/**
 * Data payload interface for the list teams query.
 *
 * @remarks
 * Contains the result of the organization query operation with its teams.
 */
export interface Data {
  /** The organization containing the teams */
  organization: Organization | null;
}

/**
 * Organization interface representing a GitHub organization.
 *
 * @remarks
 * Contains the organization login and connection to its teams.
 */
export interface Organization {
  /** The login name of the organization */
  login: string;
  /** The connection containing all teams in this organization */
  teams: TeamConnection;
}

/**
 * Connection interface for team nodes.
 *
 * @remarks
 * Represents a connection of teams in an organization.
 */
export interface TeamConnection {
  /** Array of team nodes in this connection */
  nodes: Array<Team | null> | null;
}

/**
 * Team interface representing a GitHub team.
 *
 * @remarks
 * Contains team metadata, associated projects, and repositories.
 */
export interface Team {
  /** The unique identifier of the team */
  id: string;
  /** The name of the team */
  name: string;
  /** The connection to Project V2 items associated with this team */
  projectsV2: ProjectV2Connection;
  /** The connection to repositories that this team manages */
  repositories: TeamRepositoryConnection;
}

/**
 * Connection interface for Project V2 nodes.
 *
 * @remarks
 * Represents a paginated connection of projects.
 */
export interface ProjectV2Connection {
  /** Array of project nodes in this connection */
  nodes: Array<ProjectV2 | null> | null;
}

/**
 * Project V2 interface representing a GitHub Project.
 *
 * @remarks
 * Contains basic project metadata.
 */
export interface ProjectV2 {
  /** The unique identifier of the project */
  id: string;
  /** The title of the project */
  title: string;
  /** Whether the project is closed */
  closed: boolean;
}

/**
 * Connection interface for repository nodes.
 *
 * @remarks
 * Represents a paginated connection of repositories.
 */
export interface TeamRepositoryConnection {
  /** Array of repository nodes in this connection */
  nodes: Array<Repository | null> | null;
}

/**
 * Repository interface representing a GitHub repository.
 *
 * @remarks
 * Contains basic repository metadata.
 */
export interface Repository {
  /** The unique identifier of the repository */
  id: string;
  /** The name of the repository */
  name: string;
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
 * Provides static methods for serializing and deserializing the list teams query results.
 */
export class Convert {
  /**
   * Converts a JSON string to a ListTeamsInOrgRawResult object.
   *
   * @param json - The JSON string to parse
   * @returns The parsed ListTeamsInOrgRawResult object
   *
   * @example
   * ```typescript
   * const result = Convert.toListTeamsInOrgRawResult(jsonString);
   * ```
   */
  public static toListTeamsInOrgRawResult(
    json: string,
  ): ListTeamsInOrgRawResult {
    return JSON.parse(json);
  }

  /**
   * Converts a ListTeamsInOrgRawResult object to a JSON string.
   *
   * @param value - The ListTeamsInOrgRawResult object to serialize
   * @returns The JSON string representation
   *
   * @example
   * ```typescript
   * const jsonString = Convert.listTeamsInOrgRawResultToJson(result);
   * ```
   */
  public static listTeamsInOrgRawResultToJson(
    value: ListTeamsInOrgRawResult,
  ): string {
    return JSON.stringify(value);
  }
}
