import type { LogusContext, LogusLog } from "../../logusContexts";
import type { UpdateItemTextResult } from "./updateItemTextGenerated";
import { updateItemTextMutation } from "./updateItemTextGenerated";

/**
 * Updates the text field of an item in a project.
 * @param context - The context object containing necessary information.
 * @param projectId - The ID of the project.
 * @param itemId - The ID of the item to update.
 * @param fieldId - The ID of the field to update.
 * @param text - The new text value to set.
 * @param log - Optional logger instance.
 * @returns A promise that resolves to the ID of the updated item.
 */
export async function updateItemText(
  context: LogusContext,
  projectId: string,
  itemId: string,
  fieldId: string,
  text: string,
  log: LogusLog | undefined = undefined,
): Promise<string> {
  const result: UpdateItemTextResult = await context.octokit.graphql(
    updateItemTextMutation,
    {
      projectId,
      itemId,
      fieldId,
      text,
    },
  );

  log?.debug(`updateItemText mutation result:\n${JSON.stringify(result)}`);

  return result?.updateProjectV2ItemFieldValue?.projectV2Item?.id ?? "";
}
