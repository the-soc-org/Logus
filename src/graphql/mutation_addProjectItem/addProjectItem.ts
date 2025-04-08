import type { CzujnikowniaContext, CzujnikowniaLog } from "../../czujnikowniaContexts";
import type { AddProjectItemResult, ProjectV2Item } from "./addProjectItemGenerated";
import { addProjectItemMutation } from "./addProjectItemGenerated";

/**
 * Adds an item to a project.
 * @param context - The context object containing necessary information.
 * @param projectId - The ID of the project.
 * @param contentId - The ID of the content to add.
 * @param fieldName - The name of the field to add.
 * @param log - Optional logger instance.
 * @returns A promise that resolves to an object containing the item ID and field value.
 */
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