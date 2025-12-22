import type { CzujnikowniaLog, CzujnikowniaOctokit } from "../../czujnikowniaContexts";
import type { AddAssigneeResult } from "./addAssigneeGenerated";
import { addAssigneeMutation } from "./addAssigneeGenerated";

/**
 * Adds an assignee to a pull request.
 * @param context - The context object containing necessary information.
 * @param pullRequestId - The ID of the pull request.
 * @param assigneeId - The ID of the assignee to add.
 * @param log - The logger instance.
 * @returns A promise that resolves to the ID of the assignable.
 */
export async function addAssignee(context: {octokit: CzujnikowniaOctokit}, pullRequestId: string, assigneeId: string, log: CzujnikowniaLog) : Promise<string>
{
  const result: AddAssigneeResult = await context.octokit.graphql(addAssigneeMutation, {
    pullRequestId,   
    assignee: assigneeId,
  });

  log?.debug(`Added assignee ${assigneeId} to PR ${pullRequestId}.`);

  return result.addAssigneesToAssignable?.assignable?.id ?? '';
}