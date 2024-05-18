import { Context, Probot } from "probot";
import { PRCzujnikowniaContext } from "../czujnikowniaContexts";
import { addAssignee, listTeamsInOrgRelatedToRepo } from "../graphql";
import { OrganizationConfig } from "../organizationConfig";
import Behaviour from "./behaviour";

export default class AddAssigneeOnPullRequestOpened implements Behaviour {
    register(agent: Probot): void {
        agent.on("pull_request.opened", async (context) => this.setAssigneeAction(agent, context));
    }
    
    private async setAssigneeAction(agent: Probot, context: Context<"pull_request.opened">): Promise<void> {
        const prContext: PRCzujnikowniaContext = context as PRCzujnikowniaContext;

        const config: OrganizationConfig = await OrganizationConfig.load(prContext);
        const teams = await listTeamsInOrgRelatedToRepo(prContext, config.projectTitlePrefix, config.teamNameTrigger);
        
        if(teams.length != 0) {
            await addAssignee(context, context.payload.pull_request.node_id, context.payload.sender.node_id, agent.log);
            agent.log.info(`User ${context.payload.sender.name} added as assignee on PR ${context.payload.pull_request.number}`)
            return;
        }   
    }
}