import type { LogusContext, LogusLog } from "../../logusContexts";
import type { UpdateItemNumberResult } from "./updateItemNumberGenerated";
import { updateItemNumberMutation } from "./updateItemNumberGenerated";

/**
 * Updates the number field of an item in a project.
 * @param context - The context object containing necessary information.
 * @param projectId - The ID of the project.
 * @param itemId - The ID of the item to update.
 * @param fieldId - The ID of the field to update.
 * @param number - The new number value to set.
 * @param log - Optional logger instance.
 * @returns A promise that resolves to the ID of the updated item.
 */
export async function updateItemNumber(
  context: LogusContext,
  projectId: string,
  itemId: string,
  fieldId: string,
  number: number,
  log?: LogusLog,
): Promise<string> {
  const result: UpdateItemNumberResult = await context.octokit.graphql(
    updateItemNumberMutation,
    {
      projectId,
      itemId,
      fieldId,
      number,
    },
  );

  log?.debug(
    `updateItemNumberField mutation result:\n${JSON.stringify(result)}`,
  );

  return result?.updateProjectV2ItemFieldValue?.projectV2Item?.id ?? "";
}
