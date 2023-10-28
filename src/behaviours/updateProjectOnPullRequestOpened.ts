import { Context, Probot } from "probot";
import { PRCzujnikowniaContext } from "../czujnikowniaContexts";
import { ProjectFieldValueUpdater, ProjectFieldValueUpdaterFactory } from "../projectFieldValueUpdater";
import Behaviour from "./behaviour";

export default class UpdateProjectOnPullRequestOpened implements Behaviour {

    register(agent: Probot): void {
        agent.on("pull_request.opened", async (context) => this.updateDateInProject(agent, context));
    }

    private async updateDateInProject(agent: Probot, context: Context<"pull_request.opened">): Promise<void> {
        const createdAt: string = context.payload.pull_request.created_at;
        const repoId: string = context.payload.repository.node_id;
        agent.log.info(`Pull request ${context.payload.number} in the repo ${repoId} opened at ${createdAt}.`);
        
        if(context.payload.organization === undefined)
          return;
    
        const fieldUpdater: ProjectFieldValueUpdater = await ProjectFieldValueUpdaterFactory
          .create(context as PRCzujnikowniaContext, agent.log);
        await fieldUpdater.updateDate(s => s.openPullRequestDateProjectFieldName, createdAt)
    }
}