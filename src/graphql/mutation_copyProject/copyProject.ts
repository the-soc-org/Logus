import { CzujnikowniaContext, CzujnikowniaLog } from "../../czujnikowniaContexts";
import { copyProjectMutation, CopyProjectResult } from "../mutation_copyProject/copyProjectGenerated";

export async function copyProject(context: CzujnikowniaContext, newProjectTitle: string, templateProjectNumber: string, log?: CzujnikowniaLog) 
: Promise<string> {

  const projectCreateArgs = {
      ownerId: context.payload.organization.node_id,
      title: newProjectTitle,
      projectId: templateProjectNumber
  };

  const result: CopyProjectResult = await context.octokit.graphql(copyProjectMutation, projectCreateArgs);  

  log?.debug(`copyProjectV2 mutation result:\n${JSON.stringify(result)}`);

  return result?.copyProjectV2?.projectV2?.id ?? '';
}