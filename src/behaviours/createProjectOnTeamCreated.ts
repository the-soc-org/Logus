import { Context, Probot } from "probot";
import { copyProjectV2, createProjectV2, linkProjectV2ToTeam } from "../czujnikowniaGraphMutations";
import { getProjectV2Id } from "../czujnikowniaGraphQueries";
import { KeywordSettings } from "../organizationSettings";
import Behaviour from "./behaviour";

export default class CreateProjectOnTeamCreated implements Behaviour {
  
  register(agent: Probot): void {
    agent.on("team.created", async (context) => this.createProjectAction(agent, context));
  }
  
  private async createProjectAction(app: Probot, context: Context<"team.created">): Promise<void> {
    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been created.`);

    const keywordSettings: KeywordSettings | undefined = await KeywordSettings.loadFirst(context, teamName);
    if(keywordSettings !== undefined) {
      const projectTitle: string = keywordSettings.getProjectTitle(teamName);

      let newProjectId: string | undefined = undefined;

      if(keywordSettings.projectTemplateNumber == undefined) {
        newProjectId = await createProjectV2(context, projectTitle, app.log);

        app.log.info(`Project ${projectTitle} has been created.`);
      }
      else {
        try {
          const templateId: Number = await getProjectV2Id(context, keywordSettings.projectTemplateNumber);
          newProjectId = await copyProjectV2(context, projectTitle, templateId, app.log);

          app.log.info(`Project ${projectTitle} has been created from template ${keywordSettings.projectTemplateNumber}.`);
        } 
        catch {
          app.log.error(`Faild to create project ${projectTitle}. Probably template project ${keywordSettings.projectTemplateNumber} doesn't exisis.`);
        }
      }

      if(newProjectId !== undefined) {
        await linkProjectV2ToTeam(context, newProjectId, context.payload.team.node_id);
        app.log.info(`Project ${projectTitle} has been linked to ${context.payload.team.name} team.`);
      }
    }
  }

}