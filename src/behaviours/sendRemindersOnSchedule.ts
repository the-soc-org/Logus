import { Probot } from "probot";
import { ScheduleContext } from "../czujnikowniaContexts";
import { ReminderConfig, RepoConfig } from "../repoConfig";
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
        const repoConfig: RepoConfig = await RepoConfig.load(context);

        if(!this.shouldSendAnyReminderNow(repoConfig)) {
            agent.log.debug(`No reminder should be sent.`);
            return;
        }
            
        const pullRequestsList: ListOpenedPullRequestsResult = await listRepoPullRequests(context);
        
        for(const pullRequest of pullRequestsList.repository?.pullRequests.nodes ?? []) {
            if(pullRequest!.reviewRequests?.nodes?.length !== 0) {
                await this.sendReminderIfShould(repoConfig.reviewReminder, pullRequest!, context);
            }
            else if(pullRequest!.reviews?.nodes?.length !== 0) {
                await this.sendReminderIfShould(repoConfig.replayToReviewReminder, pullRequest!, context);
            }
        }
    }

    private shouldSendAnyReminderNow(config: RepoConfig): boolean {
        if(!config.reviewReminder.isEnabled && !config.replayToReviewReminder.isEnabled)
            return false;

        const currentUTCHourOfDay: number = new Date().getUTCHours();
        if(currentUTCHourOfDay < config.minUTCHourOfDayToSendReminder 
            || currentUTCHourOfDay > config.maxUTCHourOfDayToSendReminder)
            return false;

        return true;
    }

    private async sendReminderIfShould(config: ReminderConfig, pullRequest: PullRequest, context: ScheduleContext): Promise<void> {
        const updatedAt: Date = new Date(pullRequest!.updatedAt);

        if(this.shouldSendThisReminder(config, updatedAt)) {
            const body: string = this.prepereReminderBody(config, pullRequest);
            await addComment(context, pullRequest.id, body)
        }
    }

    private shouldSendThisReminder(config: ReminderConfig, refDate: Date): boolean {    
        if(!config.isEnabled)
            return false;

        const elapsedMs: number = (new Date).getTime() - refDate.getTime();
        const elapsedHours: number = elapsedMs / (1000 * 60 * 60);

        if(elapsedHours >= config.minimalInactivityHoursToSend)
            return true;

        return false;
    }

    private prepereReminderBody(config: ReminderConfig, pullRequest: PullRequest): string {
        let body: string = config.message;
        for(const msgVar of this.messageVariables)
            body = msgVar.replaceInMessage(body, pullRequest);
        return body;
    }
}