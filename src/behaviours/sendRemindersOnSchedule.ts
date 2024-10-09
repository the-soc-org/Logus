import { Probot } from "probot";
import { CzujnikowniaOrgConfigContext, ScheduleContext } from "../czujnikowniaContexts";
import { ReminderConfig, RepoConfig } from "../repoConfig";
import { Behaviour } from "./behaviour";

import { addComment, ListOpenedPullRequestsResult, listRepoPullRequests } from "../graphql";
import { PullRequest } from "../graphql/query_listOpenedPullRequests/listOpenedPullRequestsGenerated";
import MessageVariable from "./messageVariable";
import { OrganizationConfig } from "../organizationConfig";

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
                await this.sendReminders(agent, context as unknown as ScheduleContext);
        })
    }

    private async sendReminders(agent: Probot, context: ScheduleContext) : Promise<void> {
        const repoConfig: RepoConfig = await RepoConfig.load(context);

        if(repoConfig.sendRemindersOnlyIfRepoIsRelatableToTeamWithKeyword)
            if(!(await this.checkIfRepoIsRel(context))) {
                agent.log.debug(`Repositry ${context.payload.repository.name} is not relatable.`);
                return;
            }

        if(!this.shouldSendAnyReminderNow(repoConfig)) {
            agent.log.debug(`No reminder should be sent in repo ${context.payload.repository.name}.`);
            return;
        }
            
        const pullRequestsList: ListOpenedPullRequestsResult = await listRepoPullRequests(context);
        
        for(const pullRequest of pullRequestsList.repository?.pullRequests.nodes ?? []) {
            if(pullRequest!.reviewRequests?.nodes?.length !== 0) {
                await this.sendReminderIfShould(repoConfig.reviewReminder, pullRequest!, context, agent);
            }
            else if(pullRequest!.reviews?.nodes?.length !== 0) {
                await this.sendReminderIfShould(repoConfig.replayToReviewReminder, pullRequest!, context, agent);
            }
        }
    }

    private async checkIfRepoIsRel(context: ScheduleContext): Promise<boolean> {
        const orgConfigPromise: Promise<OrganizationConfig> = OrganizationConfig.load(
            this.scheduleContextToOrgConfigContext(context));
        const teamsPromise = context.octokit.repos.listTeams({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name
        });

        const orgConfig: OrganizationConfig = await orgConfigPromise;
        const teams = await teamsPromise;

        for (const team of teams.data)
            if(orgConfig.keywordConfigs.some(config => config.nameIncludeTrigger(team.name)))
                return true;

        return false;
    }

    private scheduleContextToOrgConfigContext(scheduleContext: ScheduleContext): CzujnikowniaOrgConfigContext {
        const result = scheduleContext as any;
        result.payload.organization = {login: scheduleContext.payload.installation.account.login};
        return result as CzujnikowniaOrgConfigContext;
    }

    private shouldSendAnyReminderNow(config: RepoConfig): boolean {
        if(!config.reviewReminder.isEnabled && !config.replayToReviewReminder.isEnabled)
            return false;

        const currentUTCHourOfDay: number = new Date().getUTCHours();
        if(currentUTCHourOfDay < config.minUTCHourOfDayToSendReminder 
            || currentUTCHourOfDay > config.maxUTCHourOfDayToSendReminder)
            return false;
            
        return false;
    }       

    private async sendReminderIfShould(config: ReminderConfig, pullRequest: PullRequest, context: ScheduleContext, agent: Probot): Promise<void> {
        const updatedAt: Date = new Date(pullRequest!.updatedAt);

        if(this.shouldSendThisReminder(config, updatedAt)) {
            const body: string = this.prepereReminderBody(config, pullRequest);
            await addComment(context, pullRequest.id, body);

            agent.log.debug(`The reminder has been sent in PR #${pullRequest.id}, ${context.payload.repository.name}.`);
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