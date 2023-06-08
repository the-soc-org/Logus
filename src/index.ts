import { Probot } from "probot";
import { KeywordSettings, loadFirstKeywordSettings, AppGlobalSettings, loadAppGlobalSettings } from "./settings";
import { ProjectInOrgQueryResultElement, getProjectV2Id, listProjectsInOrg, listUserTeamsInOrgRelatedToRepo } from "./czujnikowniaGraphQueries"
import { copyProjectV2, createProjectV2, updateItemDateField, addItemToProjIfNotExist, closeProjectV2 } from "./czujnikowniaGraphMutations"

async function updateDateField(context: any, date: string, fieldNameSelector: (s: KeywordSettings) => string | undefined, log?: any) 
{
  try {
    const userTeams: string[] = await listUserTeamsInOrgRelatedToRepo(context);
    const projects: ProjectInOrgQueryResultElement[] = await listProjectsInOrg(context);
    const globalSettings: AppGlobalSettings = await loadAppGlobalSettings(context);

    for(const teamName of userTeams)
    {
      const settings: KeywordSettings | undefined = globalSettings.keywordSettings
        .find(s => teamName.includes(s.teamNameTrigger) && fieldNameSelector(s) !== undefined)
      if(settings === undefined)
        continue;

      const proj: ProjectInOrgQueryResultElement | undefined = projects.find(x => x.title === settings.getProjectTitle(teamName));
      if(proj === undefined)
        continue

      const fieldId: string | undefined = proj.fields.find(f => f.name == fieldNameSelector(settings))?.id;
      if(fieldId === undefined)
        continue;
      
      const itemId = await addItemToProjIfNotExist(context, proj.id, context.payload.pull_request.node_id);
      await updateItemDateField(context, proj.id, itemId, fieldId, date);
      log?.info(`Field ${fieldId} updated in ${proj.title} project to value ${date}.`);
    }
  }
  catch(ex)
  {
    log?.error({ex});
    throw ex;
  }
}

export = (app: Probot) => {
  app.on("team.created", async (context) => {

    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been created.`);

    const keywordSettings: KeywordSettings | undefined = await loadFirstKeywordSettings(context, teamName);
    if(keywordSettings !== undefined) {
      const projectTitle: string = keywordSettings.getProjectTitle(teamName);

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

  app.on("team.deleted", async (context) => {
    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been deleted.`);

    const keywordSettings: KeywordSettings | undefined = await loadFirstKeywordSettings(context, teamName);
    if(keywordSettings === undefined)
      return;

    const projectsInOrg: ProjectInOrgQueryResultElement[] = await listProjectsInOrg(context);
    const projectToClose: ProjectInOrgQueryResultElement | undefined = projectsInOrg
      .find(p => p.title === keywordSettings.getProjectTitle(teamName))  

    if(projectToClose === undefined)
      return;

    await closeProjectV2(context, projectToClose.id);
    app.log.info(`ProjectV2 ${projectToClose.title} has been closed.`);
  });

  app.on("pull_request.opened", async (context) => {
    const createdAt = context.payload.pull_request.created_at;
    const repoId = context.payload.repository.node_id;
    app.log.info(`Pull request ${context.payload.number} in the repo ${repoId} opened at ${createdAt}.`);
    
    await updateDateField(context, createdAt, s => s.openPullRequestDateProjectFieldName, app.log);
  });

  app.on("pull_request_review.submitted", async (context) => {
    const reviewDate = context.payload.review.submitted_at;
    const repoId = context.payload.repository.node_id;
    app.log.info(`Review ${context.payload.review.node_id} submitted in the repo ${repoId} opened at ${reviewDate}.`);

    await updateDateField(context, reviewDate, s => s.lastReviewSubmitDateProjectFieldName, app.log);
  });

  app.onAny(async (context) => {
    app.log.debug({ id: context.id, event: context.name });
  });
};
