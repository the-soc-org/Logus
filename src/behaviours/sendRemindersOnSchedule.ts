import { Probot } from "probot";
import { ScheduleContext } from "../czujnikowniaContexts";
import { RepoSettings } from "../repoSettings";
import Behaviour from "./behaviour";

import { listRepoPullRequests } from "../graphql";

const createScheduler = require('probot-scheduler')

// TODO:
export default class SendRemindersOnSchedule implements Behaviour {
    register(agent: Probot): void {
        createScheduler(agent, {
            interval: /*24 * 60 **/ 60 * 1000
        });

        agent.onAny(async (context) => {
            if(context.name.includes('schedule'))
                await this.sendReminders(agent, context as any as ScheduleContext);
        })
    }

    private async sendReminders(agent: Probot, context: ScheduleContext) {
        const repoSettings = await RepoSettings.load(context);

        if(!repoSettings.reviewReminder.isEnabled && !repoSettings.replayToReviewReminder.isEnabled)
            return;

        const pullRequestsList = await listRepoPullRequests(context);
        
        for(const pull_request of pullRequestsList.repository?.pullRequests.nodes ?? []) {
            agent.log.info(pull_request?.title ?? '');
        }
  
        //agent.log.debug(repoSettings.reviewReminder.message);
    }
}