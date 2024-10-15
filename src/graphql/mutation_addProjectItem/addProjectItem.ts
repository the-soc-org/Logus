import type { CzujnikowniaContext, CzujnikowniaLog } from "../../czujnikowniaContexts";
import type { AddProjectItemResult, ProjectV2Item } from "./addProjectItemGenerated";
import { addProjectItemMutation } from "./addProjectItemGenerated";

export async function addProjectItem(context: CzujnikowniaContext, projectId: string, contentId: string, fieldName: string, log?: CzujnikowniaLog)
: Promise<{itemId: string, fieldValue: number | string}>
{
  const result: AddProjectItemResult = await context.octokit.graphql(addProjectItemMutation, {
    projectId,
    contentId,
    fieldName,
  });

  log?.debug(`addItemToProjIfNotExist mutation result:\n${JSON.stringify(result)}`);

  const item: ProjectV2Item | null | undefined = result?.addProjectV2ItemById?.item;

  return {
    itemId: item?.id ?? "",
    fieldValue: item?.fieldValueByName?.number ?? item?.fieldValueByName?.date ?? 0,
  };
}