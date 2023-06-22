import { CzujnikowniaContext, PRCzujnikowniaContext } from "./czujnikowniaContexts";

const getProjectIdQuery: string = `
query getProjectId($organizationLogin: String!, $projectNumber: Int!) {
  organization(login: $organizationLogin) {
    projectV2(number: $projectNumber) {
      id
    }
  }
}`;

export async function getProjectV2Id(context: CzujnikowniaContext, projectNumber: Number): Promise<Number> {
    const result: any = await context.octokit.graphql(getProjectIdQuery, {
        organizationLogin: context.payload.organization.login,
        projectNumber: projectNumber,
    });
    return result.organization.projectV2.id as Number;
}

const listUserTeamsInOrgQuery: string = `
query listUserTeamsInOrg($userLogin: String!, $organizationLogin: String!){ 
  user(login: $userLogin) { 
	  organization(login: $organizationLogin) {
     	login,
      teams(first: 100) {
        edges {
          node {
            name,
            repositories(first: 100) {
              edges {
                node {
                  id,
                  name,
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export async function listUserTeamsInOrgRelatedToRepo(context: PRCzujnikowniaContext): Promise<string[]>
{
  const repoId = context.payload.repository.node_id;
  const userTeamsData: any = await context.octokit.graphql(listUserTeamsInOrgQuery, {
    userLogin: context.payload.sender.login,
    organizationLogin: context.payload.organization.login
  });

  return userTeamsData.user.organization.teams.edges
    .filter((n: any) => n.node.repositories.edges.some((nn: any) => nn.node.id == repoId))
    .map((n: any) => n.node.name as string);
}

const listProjectsInOrgQuery: string = `
query listProjectsInOrg($organizationLogin: String!) { 
		organization(login: $organizationLogin) {
      projectsV2(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
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

export async function listProjectsInOrg(context: CzujnikowniaContext): Promise<ProjectInOrgQueryResultElement[]>
{
  const projectsInOrgData: any = await context.octokit.graphql(listProjectsInOrgQuery, {
    organizationLogin: context.payload.organization.login
  });
  return projectsInOrgData.organization.projectsV2.edges.map((n: any) => {
    return new ProjectInOrgQueryResultElement(n.node);
  });
}

export interface FieldOfProjectInOrgQueryResultElement
{
  id: string;
  name: string;
  dataType: string;
}

export class ProjectInOrgQueryResultElement
{
  id: string ;
  number: Number;
  title: string;
  closed: boolean = false;
  fields: FieldOfProjectInOrgQueryResultElement[] = [];

  constructor(node: any)
  {
    this.id = node.id;
    this.number = node.number;
    this.title = node.title;
    this.closed = node.closed;
    this.fields = node.fields.edges.map((n: any) => n.node as FieldOfProjectInOrgQueryResultElement);
  }
}