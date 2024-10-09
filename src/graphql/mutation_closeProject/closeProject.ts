import { CzujnikowniaContext, CzujnikowniaLog } from "../../czujnikowniaContexts";
import { closeProjectMutation, CloseProjectResult } from "./closeProjectGenerated";

export async function closeProject(context: CzujnikowniaContext, projectId: string, log?: CzujnikowniaLog) : Promise<string>
{
  const result: CloseProjectResult = await context.octokit.graphql(closeProjectMutation, {
    projectId
  });

  log?.debug(`closeProjectV2Mutation mutation result:\n${JSON.stringify(result)}`);

  return result?.updateProjectV2?.projectV2?.id ?? '';
}
