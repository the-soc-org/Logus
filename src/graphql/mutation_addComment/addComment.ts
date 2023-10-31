import { CzujnikowniaOctokit } from "../../czujnikowniaContexts";
import { addCommentMutation, AddCommentResult } from "./addCommentGenerated";

export async function addComment(context: {octokit: CzujnikowniaOctokit}, prOrIssueNodeId: string, body: string, log?: any) : Promise<string>
{
  const result: AddCommentResult = await context.octokit.graphql(addCommentMutation, {
    subjectId: prOrIssueNodeId,   
    body,
  });

  log?.debug(`Added comment to PR/Issue ${prOrIssueNodeId} with body: ${body}`);

  return result?.addComment?.subject?.id ?? '';
}