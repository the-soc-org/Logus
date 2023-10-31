import { Probot } from "probot";
import { ScheduleContext } from "../czujnikowniaContexts";
import { ReminderSettings, RepoSettings } from "../repoSettings";
import Behaviour from "./behaviour";

import { addComment, ListOpenedPullRequestsResult, listRepoPullRequests } from "../graphql";
import { PullRequest } from "../graphql/query_listOpenedPullRequests/listOpenedPullRequestsGenerated";
import MessageVariable from "./messageVariable";

const createScheduler = require('probot-scheduler')

export default class SendRemindersOnSchedule implements Behaviour {
    private readonly messageVariables: MessageVariable<PullRequest>[] = [
        new MessageVariable("@reviewer", pr => `@${pr.reviewRequests?.nodes?.at(0)?.requestedReviewer?.login ?? 'reviewer'}`),
        new MessageVariable("@assignee", pr => `@${pr.assignees?.nodes?.at(0)?.login ?? 'assignee'}`),
        new MessageVariable("@author", pr => `@${pr.author?.login ?? 'author'}`),
        new MessageVariable("#number", pr => `#${pr.number}`),
    ];

    register(agent: Probot): void {
        createScheduler(agent, {
            interval: 3 * 60 * 60 * 1000 // uruchamianie co 3h
        });

        agent.onAny(async (context) => {
            if(context.name.includes("schedule"))
                await this.sendReminders(agent, context as any as ScheduleContext);
        })
    }

    private async sendReminders(agent: Probot, context: ScheduleContext) : Promise<void> {
        const repoSettings = await RepoSettings.load(context);

        if(!this.shouldSendAnyReminderNow(repoSettings)) {
            agent.log.debug(`No reminder should be sent.`);
            return;
        }
            
        const pullRequestsList: ListOpenedPullRequestsResult = await listRepoPullRequests(context);
        
        for(const pullRequest of pullRequestsList.repository?.pullRequests.nodes ?? []) {
            if(pullRequest!.reviewRequests?.nodes?.length !== 0) {
                await this.sendReminderIfShould(repoSettings.reviewReminder, pullRequest!, context);
            }
            else if(pullRequest!.reviews?.nodes?.length !== 0) {
                await this.sendReminderIfShould(repoSettings.replayToReviewReminder, pullRequest!, context);
            }
        }
    }

    private shouldSendAnyReminderNow(settings: RepoSettings): boolean {
        if(!settings.reviewReminder.isEnabled && !settings.replayToReviewReminder.isEnabled)
            return false;

        const currentUTCHourOfDay: number = new Date().getUTCHours();
        if(currentUTCHourOfDay < settings.minUTCHourOfDayToSendReminder 
            || currentUTCHourOfDay > settings.maxUTCHourOfDayToSendReminder)
            return false;

        return true;
    }

    private async sendReminderIfShould(settings: ReminderSettings, pullRequest: PullRequest, context: ScheduleContext): Promise<void> {
        const updatedAt: Date = new Date(pullRequest!.updatedAt);

        if(this.shouldSendThisReminder(settings, updatedAt)) {
            const body: string = this.prepereReminderBody(settings, pullRequest);
            await addComment(context, pullRequest.id, body)
        }
    }

    private shouldSendThisReminder(settings: ReminderSettings, refDate: Date): boolean {    
        if(!settings.isEnabled)
            return false;

        const elapsedMs: number = (new Date).getTime() - refDate.getTime();
        const elapsedMins: number = elapsedMs / (1000 * 60);

        if(elapsedMins >= settings.minimalInactivityMinToSend)
            return true;

        return false;
    }

    private prepereReminderBody(settings: ReminderSettings, pullRequest: PullRequest): string {
        let body: string = settings.message;
        for(const msgVar of this.messageVariables)
            body = msgVar.replaceInMessage(body, pullRequest);
        return body;
    }
}