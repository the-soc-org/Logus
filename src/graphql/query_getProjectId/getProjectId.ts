import type { WithoutNullableKeys } from "..";
import type { CzujnikowniaContext } from "../../czujnikowniaContexts";
import type { GetProjectIdResult } from "./getProjectIdGenerated";
import { getProjectIdQuery } from "./getProjectIdGenerated";

/**
 * Retrieves the ID of a project in an organization.
 * @param context - The context containing the Octokit instance and payload information.
 * @param projectNumber - The number of the project to retrieve the ID for.
 * @returns A promise that resolves to the ID of the project.
 */
export async function getProjectV2Id(context: CzujnikowniaContext, projectNumber: Number): Promise<string> {
    const result: WithoutNullableKeys<GetProjectIdResult> = await context.octokit.graphql(getProjectIdQuery, {
        organizationLogin: context.payload.organization.login,
        projectNumber: projectNumber,
    });
    return result.organization.projectV2.id;
}