import { CzujnikowniaContext, CzujnikowniaLog } from "../../czujnikowniaContexts";
import { updateItemNumberMutation, UpdateItemNumberResult } from "./updateItemNumberGenerated";

export async function updateItemNumber(context: CzujnikowniaContext, projectId: string, itemId: string, fieldId: string, number: number, log?: CzujnikowniaLog): Promise<string>
{
  const result: UpdateItemNumberResult = await context.octokit.graphql(updateItemNumberMutation, {
    projectId,
    itemId,
    fieldId,
    number,
  });

  log?.debug(`updateItemNumberField mutation result:\n${JSON.stringify(result)}`);

  return result?.updateProjectV2ItemFieldValue?.projectV2Item?.id ?? '';
}