import type { Context, Probot } from "probot";
import type { Behaviour } from "./behaviour";
import type { PRLogusContext } from "../logusContexts";
import { OrganizationConfig } from "../organizationConfig";
import { addAssignee, listTeamsInOrgRelatedToRepo } from "../graphql";

/**
 * Class to add the pull request author as an assignee when a pull request is opened.
 */
export default class AddAssigneeOnPullRequestOpened implements Behaviour {
  /**
   * Registers the behaviour to the Probot agent.
   * @param agent - The Probot agent.
   */
  register(agent: Probot): void {
    agent.on("pull_request.opened", async (context) =>
      this.setAssigneeAction(agent, context),
    );
  }

  /**
   * Sets the assignee action when a pull request is opened.
   * @param agent - The Probot agent.
   * @param context - The context of the pull request opened event.
   */
  private async setAssigneeAction(
    agent: Probot,
    context: Context<"pull_request.opened">,
  ): Promise<void> {
    const prContext: PRLogusContext = context as PRLogusContext;

    const config: OrganizationConfig = await OrganizationConfig.load(prContext);

    if (!config.addPullRequestAuthorAsAssignee) {
      agent.log.info(`Adding assignee is disabled in the configuration.`);
      return;
    }

    const teams = await listTeamsInOrgRelatedToRepo(
      prContext,
      config.projectTitlePrefix,
    );

    if (teams.length !== 0) {
      await addAssignee(
        context,
        context.payload.pull_request.node_id,
        context.payload.sender.node_id,
        agent.log,
      );
      agent.log.info(
        `User ${context.payload.sender.login} added as assignee on PR ${context.payload.pull_request.number}`,
      );
      return;
    }
  }
}
