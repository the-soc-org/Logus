import type { CzujnikowniaContext, CzujnikowniaLog } from "../../czujnikowniaContexts";
import type { UpdateItemDateResult } from "./updateItemDateGenerated";
import { updateItemDateMutation } from "./updateItemDateGenerated";

/**
 * Updates the date field of an item in a project.
 * @param context - The context object containing necessary information.
 * @param projectId - The ID of the project.
 * @param itemId - The ID of the item to update.
 * @param fieldId - The ID of the field to update.
 * @param date - The new date value to set.
 * @param log - Optional logger instance.
 * @returns A promise that resolves to the ID of the updated item.
 */
export async function updateItemDate(context: CzujnikowniaContext, projectId: string, itemId: string, fieldId: string, date: string, log?: CzujnikowniaLog)
: Promise<string>
{
  const result: UpdateItemDateResult = await context.octokit.graphql(updateItemDateMutation, {
    projectId,
    itemId,
    fieldId,
    date,
  });

  log?.debug(`updateItemDateField mutation result:\n${JSON.stringify(result)}`);

  return result?.updateProjectV2ItemFieldValue?.projectV2Item?.id ?? '';
}