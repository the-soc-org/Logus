import { Probot } from "probot";
import { ScheduleContext } from "../czujnikowniaContexts";
import { RepoSettings } from "../repoSettings";
import Behaviour from "./behaviour";

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
        /*const pullList = */context.octokit.pulls.list({
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
          state: "open"
        });
  
        const repoSettings: RepoSettings = await RepoSettings.load(context);
        agent.log.debug(repoSettings.reviewReminder.message);
        //agent.log.debug(`schedule event for ${context.id}`);
    }
}