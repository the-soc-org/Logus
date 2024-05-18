import { CzujnikowniaContext } from "../../czujnikowniaContexts";
import { updateItemTextMutation, UpdateItemTextResult } from "./updateItemTextGenerated";

export async function updateItemText(context: CzujnikowniaContext, projectId: string, itemId: string, fieldId: string, text: string, log?: any): Promise<string>
{
  const result: UpdateItemTextResult = await context.octokit.graphql(updateItemTextMutation, {
    projectId,
    itemId,
    fieldId,
    text,
  });

  log?.debug(`updateItemText mutation result:\n${JSON.stringify(result)}`);

  return result?.updateProjectV2ItemFieldValue?.projectV2Item?.id ?? '';
}