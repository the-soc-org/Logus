import { Context, Probot } from "probot";
import { closeProject, listOpenedProjectsInOrg, ProjectInOrgQueryResultElement } from "../graphql";
import { KeywordConfiguration } from "../organizationConfig";
import Behaviour from "./behaviour";

export default class CloseProjectOnTeamDeleted implements Behaviour {
    register(agent: Probot): void {
        agent.on("team.deleted", async (context) => this.closeProjectAction(agent, context));
      }

    private async closeProjectAction(agent: Probot, context: Context<"team.deleted">): Promise<void> { 
        const teamName: string = context.payload.team.name;
        agent.log.info(`Team ${teamName} has been deleted.`);

        const keywordConfig: KeywordConfiguration | undefined = await KeywordConfiguration.loadFirst(context, teamName);
        if(keywordConfig === undefined) {
            agent.log.info(`There is no config related to team ${teamName}.`);
            return;
        }

        const projectToCloseTitle = keywordConfig.getProjectTitle(teamName).toLowerCase();

        const projectsInOrg: ProjectInOrgQueryResultElement[] = await listOpenedProjectsInOrg(context);
        const projectToClose: ProjectInOrgQueryResultElement | undefined = projectsInOrg
            .find(p => p.title.toLowerCase() === projectToCloseTitle);

        if(projectToClose === undefined) {
            agent.log.info(`There is no project ${projectToCloseTitle} to close.`);
            return;
        }

        await closeProject(context, projectToClose.id, agent.log);
        agent.log.info(`ProjectV2 ${projectToClose.title} has been closed.`);
    }
}