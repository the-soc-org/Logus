import type { Context, Probot } from "probot";
import type { Behaviour } from "./behaviour";
import type { PRCzujnikowniaContext } from "../czujnikowniaContexts";
import { OrganizationConfig } from "../organizationConfig";
import { addAssignee, listTeamsInOrgRelatedToRepo } from "../graphql";

export default class AddAssigneeOnPullRequestOpened implements Behaviour {
    register(agent: Probot): void {
        agent.on("pull_request.opened", async (context) => this.setAssigneeAction(agent, context));
    }
    
    private async setAssigneeAction(agent: Probot, context: Context<"pull_request.opened">): Promise<void> {
        const prContext: PRCzujnikowniaContext = context as PRCzujnikowniaContext;

        const config: OrganizationConfig = await OrganizationConfig.load(prContext);

        if (!config.addPullRequestAuthorAsAssignee) {
            agent.log.info(`Adding assignee is disabled in the configuration.`);
            return;
        }

        const teams = await listTeamsInOrgRelatedToRepo(prContext, config.projectTitlePrefix);
        
        if(teams.length !== 0) {
            await addAssignee(context, context.payload.pull_request.node_id, context.payload.sender.node_id, agent.log);
            agent.log.info(`User ${context.payload.sender.login} added as assignee on PR ${context.payload.pull_request.number}`)
            return;
        }   
    }
}