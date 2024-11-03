import type { CzujnikowniaLog, CzujnikowniaOctokit } from "../../czujnikowniaContexts";
import type { AddAssigneeResult } from "./addAssigneeGenerated";
import { addAssigneeMutation } from "./addAssigneeGenerated";


export async function addAssignee(context: {octokit: CzujnikowniaOctokit}, pullRequestId: string, assigneeId: string, log: CzujnikowniaLog) : Promise<string>
{
  const result: AddAssigneeResult = await context.octokit.graphql(addAssigneeMutation, {
    pullRequestId,   
    assignee: assigneeId,
  });

  log?.debug(`Added assignee ${assigneeId} to PR ${pullRequestId}.`);

  return result.addAssigneesToAssignable?.assignable?.id ?? '';
}