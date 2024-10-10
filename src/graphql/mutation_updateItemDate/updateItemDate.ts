import type { CzujnikowniaContext, CzujnikowniaLog } from "../../czujnikowniaContexts";
import type { UpdateItemDateResult } from "./updateItemDateGenerated";
import { updateItemDateMutation } from "./updateItemDateGenerated";

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