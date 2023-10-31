import { WithoutNullableKeys } from "..";
import { CzujnikowniaContext } from "../../czujnikowniaContexts";
import { getProjectIdQuery, GetProjectIdResult } from "./getProjectIdGenerated";

export async function getProjectV2Id(context: CzujnikowniaContext, projectNumber: Number): Promise<string> {
    const result: WithoutNullableKeys<GetProjectIdResult> = await context.octokit.graphql(getProjectIdQuery, {
        organizationLogin: context.payload.organization.login,
        projectNumber: projectNumber,
    });
    return result.organization.projectV2.id;
}