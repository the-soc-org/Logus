import { Probot } from "probot";
import { KeywordSettings, loadFirstKeywordSettings, AppGlobalSettings, loadAppGlobalSettings } from "./settings";
import { ProjectInOrgQueryResultElement, getProjectV2Id, listProjectsInOrg, listUserTeamsInOrgRelatedToRepo } from "./czujnikowniaGraphQueries"
import { copyProjectV2, createProjectV2, updateItemDateField, addItemToProjIfNotExist } from "./czujnikowniaGraphMutations"

export = (app: Probot) => {

  app.on("team.created", async (context) => {

    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been created.`);

    const keywordSettings: KeywordSettings | undefined = await loadFirstKeywordSettings(context, teamName);

    if(keywordSettings !== undefined) {
      const projectTitle = keywordSettings.projectTitlePrefix + teamName;

      if(keywordSettings.projectTemplateNumber == undefined) {
        await createProjectV2(context, projectTitle);

        app.log.info(`Project ${projectTitle} has been created.`);
      }
      else {
        try {
          const templateId = await getProjectV2Id(context, keywordSettings.projectTemplateNumber);
          await copyProjectV2(context, projectTitle, templateId);

          app.log.info(`Project ${projectTitle} has been created from template ${keywordSettings.projectTemplateNumber}`);
        } 
        catch {
          app.log.error(`Faild to create project ${projectTitle}. Probably template project ${keywordSettings.projectTemplateNumber} doesn't exisis.`);
        }
      }
    }
  });

  app.on("pull_request.opened", async (context) => {
    const createdAt = context.payload.pull_request.created_at;
    const repoId = context.payload.repository.node_id;
    app.log.info(`Pull request ${context.payload.number} in the repo ${repoId} opened at ${createdAt}.`);

    try {
      const userTeams: string[] = await listUserTeamsInOrgRelatedToRepo(context);
      const projects: ProjectInOrgQueryResultElement[] = await listProjectsInOrg(context);
      const globalSettings: AppGlobalSettings = await loadAppGlobalSettings(context);

      for(const teamName of userTeams)
      {
        const settings: KeywordSettings | undefined = globalSettings.keywordSettings
          .find(s => teamName.includes(s.teamNameTrigger) && s.openPullRequestDateProjectFieldName !== undefined)
        if(settings === undefined)
          continue;

        const proj: ProjectInOrgQueryResultElement | undefined = projects.find(x => x.title.includes(teamName));
        if(proj === undefined)
          continue

        const fieldId: string | undefined = proj.fields.find(f => f.name == settings.openPullRequestDateProjectFieldName)?.id;
        if(fieldId === undefined)
          continue;
        
        const itemId = await addItemToProjIfNotExist(context, proj.id, context.payload.pull_request.node_id);
        await updateItemDateField(context, proj.id, itemId, fieldId, createdAt);
        app.log.info(`Field ${fieldId} updated in ${proj.title} project.`);
      }
    }
    catch(ex)
    {
      app.log.error({ex});
      throw ex;
    }
    
  });

  app.onAny(async (context) => {
    app.log.debug({ id: context.id, event: context.name });
  });
  
};
