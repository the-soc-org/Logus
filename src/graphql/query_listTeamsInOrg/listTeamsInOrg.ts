import { WithoutNullableKeys } from "..";
import { PRCzujnikowniaContext } from "../../czujnikowniaContexts";
import { Data, listTeamsInOrgQuery, Team } from "./listTeamsInOrgGenerated";

export async function listTeamNodesRelatedToRepo(context: PRCzujnikowniaContext, 
    projectQuery: string, teamQuery: string | null = null): Promise<WithoutNullableKeys<Team>[]> {
if(context.payload.organization === undefined)
    throw "Can't list user teams in organization with this payload";

const repoName = context.payload.repository.name;
const teamsData: WithoutNullableKeys<Data> = await context.octokit.graphql(listTeamsInOrgQuery, {
    organizationLogin: context.payload.organization.login,
    repoQuery: repoName,
    teamQuery,
});

return teamsData.organization.teams.nodes
    .filter((n: WithoutNullableKeys<Team>) => n.repositories.nodes.some(r => r.name == repoName)
        && n.projectsV2.nodes.some(p => !p.closed && p.title.includes(projectQuery)));
}

export async function listTeamsInOrgRelatedToRepo(context: PRCzujnikowniaContext, 
    projectQuery: string, teamQuery: string | null = null): Promise<string[]> {

    return (await listTeamNodesRelatedToRepo(context, projectQuery, teamQuery)).map((n: WithoutNullableKeys<Team>) => n.name);
}