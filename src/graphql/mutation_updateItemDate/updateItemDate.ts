import { CzujnikowniaContext } from "../../czujnikowniaContexts";
import { updateItemDateMutation, UpdateItemDateResult } from "./updateItemDateGenerated";

export async function updateItemDate(context: CzujnikowniaContext, projectId: string, itemId: string, fieldId: string, date: string, log?: any)
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