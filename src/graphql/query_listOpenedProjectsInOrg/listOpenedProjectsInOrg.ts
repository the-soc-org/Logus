import { CzujnikowniaContext } from "../../czujnikowniaContexts";
import { listOpenedProjectsInOrgQuery, ListOpenedProjectsInOrgResult, ProjectV2, ProjectV2FieldConfiguration } from "./listOpenedProjectsInOrgGenerated";

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

export class ProjectInOrgQueryResultElement
{
  id: string ;
  number: Number;
  title: string;
  closed: boolean = false;
  fields: ProjectV2FieldConfiguration[] = [];

  constructor(node: ProjectV2)
  {
    this.id = node.id;
    this.number = node.number;
    this.title = node.title;
    this.closed = node.closed;
    if(node.fields.edges)
      this.fields = node.fields.edges.map((n: any) => n.node as ProjectV2FieldConfiguration);
  }
}