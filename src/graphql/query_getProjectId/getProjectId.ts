import type { WithoutNullableKeys } from "..";
import type { CzujnikowniaContext } from "../../czujnikowniaContexts";
import type { GetProjectIdResult } from "./getProjectIdGenerated";
import { getProjectIdQuery } from "./getProjectIdGenerated";

export async function getProjectV2Id(context: CzujnikowniaContext, projectNumber: Number): Promise<string> {
    const result: WithoutNullableKeys<GetProjectIdResult> = await context.octokit.graphql(getProjectIdQuery, {
        organizationLogin: context.payload.organization.login,
        projectNumber: projectNumber,
    });
    return result.organization.projectV2.id;
}