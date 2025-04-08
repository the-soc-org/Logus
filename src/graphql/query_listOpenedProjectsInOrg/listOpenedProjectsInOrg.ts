import type { CzujnikowniaContext } from "../../czujnikowniaContexts";
import type { ListOpenedProjectsInOrgResult, ProjectV2, ProjectV2FieldConfiguration, ProjectV2FieldConfigurationEdge } from "./listOpenedProjectsInOrgGenerated";
import { listOpenedProjectsInOrgQuery } from "./listOpenedProjectsInOrgGenerated";

/**
 * Lists all open projects in an organization.
 * @param context - The context containing the Octokit instance and payload information.
 * @param projectQuery - The query string to filter projects.
 * @returns A promise that resolves to an array of ProjectInOrgQueryResultElement.
 */
export async function listOpenedProjectsInOrg(context: CzujnikowniaContext, projectQuery: string = ""): Promise<ProjectInOrgQueryResultElement[]>
{
  const projectsInOrgData: ListOpenedProjectsInOrgResult 
    = await context.octokit.graphql(listOpenedProjectsInOrgQuery, {
      organizationLogin: context.payload.organization.login,
      projectQuery: `is:open ${projectQuery}`
    });

    return projectsInOrgData?.organization?.projectsV2?.edges?.map((edge) => {
      return new ProjectInOrgQueryResultElement(edge?.node!);
    }) ?? [];
}

/**
 * Class representing a project in an organization query result.
 */
export class ProjectInOrgQueryResultElement
{
  /**
   * The ID of the project.
   */
  id: string;

  /**
   * The number of the project.
   */
  number: number;

  /**
   * The title of the project.
   */
  title: string;

  /**
   * Indicates whether the project is closed.
   */
  closed: boolean = false;

  /**
   * The fields of the project.
   */
  fields: ProjectV2FieldConfiguration[] = [];

  /**
   * Constructor for ProjectInOrgQueryResultElement.
   * @param node - The project node from the query result.
   */
  constructor(node: ProjectV2)
  {
    this.id = node.id;
    this.number = node.number;
    this.title = node.title;
    this.closed = node.closed;
    if(node.fields.edges)
      this.fields = node.fields.edges.map((n: ProjectV2FieldConfigurationEdge | null) => n?.node as ProjectV2FieldConfiguration);
  }
}