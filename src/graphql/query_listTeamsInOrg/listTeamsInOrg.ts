import type { WithoutNullableKeys } from "..";
import type { PRCzujnikowniaContext } from "../../czujnikowniaContexts";
import type { Data, Team } from "./listTeamsInOrgGenerated";
import { listTeamsInOrgQuery } from "./listTeamsInOrgGenerated";

/**
 * Lists all team nodes related to a repository in an organization.
 * @param context - The context containing the Octokit instance and payload information.
 * @param projectQuery - The query string to filter projects.
 * @param teamQuery - The query string to filter teams. Optional.
 * @returns A promise that resolves to an array of team nodes.
 * @throws Will throw an error if the organization is not defined in the payload.
 */
export async function listTeamNodesRelatedToRepo(context: PRCzujnikowniaContext, 
    projectQuery: string, teamQuery: string | undefined = undefined): Promise<WithoutNullableKeys<Team>[]> {
if(context.payload.organization === undefined)
    throw "Can't list user teams in organization with this payload";

const repoName = context.payload.repository.name;
const teamsData: WithoutNullableKeys<Data> = await context.octokit.graphql(listTeamsInOrgQuery, {
    organizationLogin: context.payload.organization.login,
    repoQuery: repoName,
    teamQuery: teamQuery ?? "",
});

return teamsData.organization.teams.nodes
    .filter((n: WithoutNullableKeys<Team>) => n.repositories.nodes.some(r => r.name == repoName)
        && n.projectsV2.nodes.some(p => !p.closed && p.title.includes(projectQuery)));
}

/**
 * Lists all team names related to a repository in an organization.
 * @param context - The context containing the Octokit instance and payload information.
 * @param projectQuery - The query string to filter projects.
 * @param teamQuery - The query string to filter teams. Optional.
 * @returns A promise that resolves to an array of team names.
 */
export async function listTeamsInOrgRelatedToRepo(context: PRCzujnikowniaContext, 
    projectQuery: string, teamQuery: string | undefined = undefined): Promise<string[]> {

    return (await listTeamNodesRelatedToRepo(context, projectQuery, teamQuery)).map((n: WithoutNullableKeys<Team>) => n.name);
}