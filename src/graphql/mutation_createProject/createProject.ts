import { CzujnikowniaContext } from "../../czujnikowniaContexts";
import { createProjectMutation, CreateProjectResult } from "./createProjectGenerated";

export async function createProject(context: CzujnikowniaContext, title: string, log?: any)
: Promise<string>
{
  const projectCreateArgs: any = {
      ownerId: context.payload.organization.node_id,
      title: title,
    };
  const result: CreateProjectResult = await context.octokit.graphql(createProjectMutation, projectCreateArgs);
  
  log?.debug(`createProjectV2 mutation result:\n${JSON.stringify(result)}`);

  return result?.createProjectV2?.projectV2?.id ?? '';
}