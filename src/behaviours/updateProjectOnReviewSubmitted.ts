import type { Context, Probot } from "probot";
import type { Behaviour } from "./behaviour";
import type { PRLogusContext } from "../logusContexts";
import type { ProjectFieldValueUpdater } from "../projectFieldValueUpdater";
import { ProjectFieldValueUpdaterFactory } from "../projectFieldValueUpdater";

/**
 * Class to update the project fields with review submission details when a pull request review is submitted.
 */
export default class UpdateProjectOnReviewSubmitted implements Behaviour {
  /**
   * Registers the behaviour to the Probot agent.
   * @param agent - The Probot agent.
   */
  register(agent: Probot): void {
    agent.on("pull_request_review.submitted", async (context) =>
      this.updateProjectAction(agent, context),
    );
  }

  /**
   * Updates the project fields with review submission details.
   * @param agent - The Probot agent.
   * @param context - The context of the pull request review submitted event.
   */
  private async updateProjectAction(
    agent: Probot,
    context: Context<"pull_request_review.submitted">,
  ): Promise<void> {
    const reviewDate: string = context.payload.review.submitted_at;
    const repoId: string = context.payload.repository.node_id;
    agent.log.info(
      `Review ${context.payload.review.node_id} submitted in the repo ${repoId} opened at ${reviewDate}.`,
    );

    if (context.payload.organization === undefined) return;

    const fieldUpdater: ProjectFieldValueUpdater =
      await ProjectFieldValueUpdaterFactory.create(
        context as PRLogusContext,
        agent.log,
      );
    await fieldUpdater.updateDate(
      (s) => s.lastReviewSubmitDateProjectFieldName,
      reviewDate,
    );

    if (context.payload.review.state === "approved")
      await fieldUpdater.updateDate(
        (s) => s.lastApprovedReviewSubmitDateProjectFieldName,
        reviewDate,
      );

    await fieldUpdater.increment(
      (s) => s.reviewIterationNumberProjectFieldName,
    );

    await fieldUpdater.updateDate(
      (s) => s.firstReviewSubmitDateProjectFieldName,
      reviewDate,
      (val: string) => {
        if (val && val !== "0") return false;
        return true;
      },
    );
  }
}
