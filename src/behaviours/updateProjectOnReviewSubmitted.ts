import type { Context, Probot } from "probot";
import type { Behaviour } from "./behaviour";
import type { PRCzujnikowniaContext } from "../czujnikowniaContexts";
import type { ProjectFieldValueUpdater } from "../projectFieldValueUpdater";
import { ProjectFieldValueUpdaterFactory } from "../projectFieldValueUpdater";

export default class UpdateProjectOnReviewSubmitted implements Behaviour {

    register(agent: Probot): void {
        agent.on("pull_request_review.submitted", async (context) => this.updateProjectAction(agent, context));
    }

    private async updateProjectAction(agent: Probot, context: Context<"pull_request_review.submitted">): Promise<void> {
        const reviewDate: string = context.payload.review.submitted_at;
        const repoId: string = context.payload.repository.node_id;
        agent.log.info(`Review ${context.payload.review.node_id} submitted in the repo ${repoId} opened at ${reviewDate}.`);
    
        if(context.payload.organization === undefined)
          return;
              
        const fieldUpdater: ProjectFieldValueUpdater = await ProjectFieldValueUpdaterFactory
          .create(context as PRCzujnikowniaContext, agent.log);
        await fieldUpdater.updateDate(s => s.lastReviewSubmitDateProjectFieldName, reviewDate);
    
        if(context.payload.review.state === "approved")
          await fieldUpdater.updateDate(s => s.lastApprovedReviewSubmitDateProjectFieldName, reviewDate);
    
        await fieldUpdater.increment(s => s.reviewIterationNumberProjectFieldName);

        await fieldUpdater.updateDate(s => s.firstReviewSubmitDateProjectFieldName, reviewDate, 
          (val: string) => {
            if(val)
              return false;
            return true;
          });
    }
}