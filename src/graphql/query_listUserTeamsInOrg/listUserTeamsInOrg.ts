import { WithoutNullableKeys } from "..";
import { PRCzujnikowniaContext } from "../../czujnikowniaContexts";
import { Data, listUserTeamsInOrgQuery, TeamEdge, TeamRepositoryEdge } from "./listUserTeamsInOrgGenerated";

export async function listUserTeamsInOrgRelatedToRepo(context: PRCzujnikowniaContext, 
    teamQuery: string = ""): Promise<string[]>
  {
    if(context.payload.organization === undefined)
      throw "Can't list user teams in organization with this payload";
  
    const repoId = context.payload.repository.node_id;
    const userTeamsData: WithoutNullableKeys<Data> = await context.octokit.graphql(listUserTeamsInOrgQuery, {
      userLogin: context.payload.sender.login,
      organizationLogin: context.payload.organization.login,
      repoQuery: context.payload.repository.name,
      teamQuery,
    });
  
    return userTeamsData.user.organization.teams.edges
        .filter((n: WithoutNullableKeys<TeamEdge>) => n.node.repositories.edges
            .some((nn: WithoutNullableKeys<TeamRepositoryEdge>) => nn.node.id === repoId))
        .map((n: WithoutNullableKeys<TeamEdge>) => n.node.name as string);
  }
  