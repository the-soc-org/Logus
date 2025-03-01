import { Probot } from "probot";

import type { Behaviour } from "./behaviours/behaviour";
import UpdateProjectOnPullRequestOpened from "./behaviours/updateProjectOnPullRequestOpened";
import UpdateProjectOnReviewSubmitted from "./behaviours/updateProjectOnReviewSubmitted";
import LogDebugOnAny from "./behaviours/logDebugOnAny";
import AddAssigneeOnPullRequestOpened from "./behaviours/addAssigneeOnPullRequestOpened";

/**
 * @internal
 * Array of behaviours to be registered with the Probot agent.
 */
const behaviours: Behaviour[] = [
  new UpdateProjectOnPullRequestOpened(),
  new AddAssigneeOnPullRequestOpened(),
  new UpdateProjectOnReviewSubmitted(),
  new LogDebugOnAny(),
];

/**
 * Main entry point for the Probot application.
 * 
 * This function registers all predefined behaviours with the Probot agent.
 * 
 * @param agent - The Probot agent instance.
 * 
 * @remarks
 * The function iterates through the `behaviours` array and calls the `register` method 
 * on each behaviour instance to bind it to the agent.
 */
export = (agent: Probot) => {
  for (const behavior of behaviours) {
    behavior.register(agent);
  }
};