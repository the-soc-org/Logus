import { Context, Probot } from "probot";
import { copyProject, createProject, getProjectV2Id, linkProjectToTeam } from "../graphql";
import { KeywordConfiguration } from "../organizationConfig";
import { Behaviour } from "./behaviour";

export default class CreateProjectOnTeamCreated implements Behaviour {
  
  register(agent: Probot): void {
    agent.on("team.created", async (context) => this.createProjectAction(agent, context));
  }
  
  private async createProjectAction(app: Probot, context: Context<"team.created">): Promise<void> {
    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been created.`);

    const keywordConfigs: KeywordConfiguration | undefined = await KeywordConfiguration.loadFirst(context, teamName);
    if(keywordConfigs === undefined) 
      return;
    
    const projectTitle: string = keywordConfigs.getProjectTitle(teamName);

    let newProjectId: string = '';

    if(keywordConfigs.projectTemplateNumber === undefined) {
      newProjectId = await createProject(context, projectTitle, app.log);

      app.log.info(`Project ${projectTitle} has been created.`);
    } 
    else {
      try {
        const templateId: string = await getProjectV2Id(context, keywordConfigs.projectTemplateNumber);
        newProjectId = await copyProject(context, projectTitle, templateId, app.log);

        app.log.info(`Project ${projectTitle} has been created from template ${keywordConfigs.projectTemplateNumber}.`);
      } 
      catch {
        app.log.error(`Faild to create project ${projectTitle}. Probably template project ${keywordConfigs.projectTemplateNumber} doesn't exisis.`);
      }
    }

    if(newProjectId !== '') {
      await linkProjectToTeam(context, newProjectId, context.payload.team.node_id);
      app.log.info(`Project ${projectTitle} has been linked to ${context.payload.team.name} team.`);
    }
  }
}