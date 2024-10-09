import { Probot } from "probot";

import { Behaviour } from "./behaviours/behaviour";
import UpdateProjectOnPullRequestOpened from "./behaviours/updateProjectOnPullRequestOpened";
import UpdateProjectOnReviewSubmitted from "./behaviours/updateProjectOnReviewSubmitted";
import LogDebugOnAny from "./behaviours/logDebugOnAny";
import AddAssigneeOnPullRequestOpened from "./behaviours/addAssigneeOnPullRequestOpened";

const behaviours: Behaviour[] = [
  new UpdateProjectOnPullRequestOpened,
  new AddAssigneeOnPullRequestOpened,
  new UpdateProjectOnReviewSubmitted,
  new LogDebugOnAny,
];

export = (agent: Probot) => {

  for(const behavior of behaviours)
    behavior.register(agent);
};