import { Probot } from "probot";

import Behaviour from "./behaviours/behaviour";
import CreateProjectOnTeamCreated from "./behaviours/createProjectOnTeamCreated";
import CloseProjectOnTeamDeleted from "./behaviours/closeProjectOnTeamDeleted";
import UpdateProjectOnPullRequestOpened from "./behaviours/updateProjectOnPullRequestOpened";
import UpdateProjectOnReviewSubmitted from "./behaviours/updateProjectOnReviewSubmitted";
import LogDebugOnAny from "./behaviours/logDebugOnAny";

const behaviours: Behaviour[] = [
  new CreateProjectOnTeamCreated,
  new CloseProjectOnTeamDeleted,
  new UpdateProjectOnPullRequestOpened,
  new UpdateProjectOnReviewSubmitted,
  // new SendRemindersOnSchedule,
  new LogDebugOnAny,
];

export = (agent: Probot) => {

  for(const behavior of behaviours)
    behavior.register(agent);
};