import { ScheduleContext } from "../../czujnikowniaContexts";
import { ListOpenedPullRequestsResult, listOpenedPullRequestsQuery } from "./listOpenedPullRequestsGenerated";

export async function listRepoPullRequests(context: ScheduleContext): Promise<ListOpenedPullRequestsResult> {
    const result: ListOpenedPullRequestsResult = await context.octokit.graphql(listOpenedPullRequestsQuery, {
        owner: context.payload.installation.account.login,
        name: context.payload.repository.name,
    });

    return result;
}