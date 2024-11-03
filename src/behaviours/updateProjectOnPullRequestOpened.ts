import type { Context, Probot } from "probot";
import type { Behaviour } from "./behaviour";
import type { PRCzujnikowniaContext } from "../czujnikowniaContexts";
import type { ProjectFieldValueUpdater } from "../projectFieldValueUpdater";
import { ProjectFieldValueUpdaterFactory } from "../projectFieldValueUpdater";

export default class UpdateProjectOnPullRequestOpened implements Behaviour {

    register(agent: Probot): void {
        agent.on("pull_request.opened", async (context) => this.updateDateAction(agent, context));
    }

    private async updateDateAction(agent: Probot, context: Context<"pull_request.opened">): Promise<void> {
        const createdAt: string = context.payload.pull_request.created_at;
        const repoId: string = context.payload.repository.node_id;
        agent.log.info(`Pull request ${context.payload.number} in the repo ${repoId} opened at ${createdAt}.`);
        
        if(context.payload.organization === undefined) {
          agent.log.info(`Context doesn't contain required organization info.`);
          return;
        }
    
        const fieldUpdater: ProjectFieldValueUpdater = await ProjectFieldValueUpdaterFactory
          .create(context as PRCzujnikowniaContext, agent.log);
        await fieldUpdater.updateDate(s => s.openPullRequestDateProjectFieldName, createdAt);
    }
}