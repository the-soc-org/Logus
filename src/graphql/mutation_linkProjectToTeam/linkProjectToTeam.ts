import { CzujnikowniaContext } from "../../czujnikowniaContexts";
import { linkProjectToTeamMutation, LinkProjectToTeamResult } from "./linkProjectToTeamGenerated";

export async function linkProjectToTeam(context: CzujnikowniaContext, projectId: string, teamId: string)
: Promise<string> {
    
  const result: LinkProjectToTeamResult = await context.octokit.graphql(linkProjectToTeamMutation, {
    projectId,
    teamId
  });

  return result?.linkProjectV2ToTeam?.team?.id ?? '';
}