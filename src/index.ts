import { Probot } from "probot";
import { KeywordSettings, loadFirstKeywordSettings } from "./settings";
import { ProjectInOrgQueryResultElement, getProjectV2Id, listProjectsInOrg } from "./czujnikowniaGraphQueries"
import { copyProjectV2, createProjectV2, closeProjectV2 } from "./czujnikowniaGraphMutations"
import { ProjectFieldValueUpdater } from "./projectFieldValueUpdater";
import { PRCzujnikowniaContext } from "./czujnikowniaContexts";

export = (app: Probot) => {
  
  app.on("team.created", async (context) => {

    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been created.`);

    const keywordSettings: KeywordSettings | undefined = await loadFirstKeywordSettings(context, teamName);
    if(keywordSettings !== undefined) {
      const projectTitle: string = keywordSettings.getProjectTitle(teamName);

      if(keywordSettings.projectTemplateNumber == undefined) {
        await createProjectV2(context, projectTitle, app.log);

        app.log.info(`Project ${projectTitle} has been created.`);
      }
      else {
        try {
          const templateId: Number = await getProjectV2Id(context, keywordSettings.projectTemplateNumber);
          await copyProjectV2(context, projectTitle, templateId, app.log);

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

    await closeProjectV2(context, projectToClose.id, app.log);
    app.log.info(`ProjectV2 ${projectToClose.title} has been closed.`);
  });

  app.on("pull_request.opened", async (context) => {
    const createdAt: string = context.payload.pull_request.created_at;
    const repoId: string = context.payload.repository.node_id;
    app.log.info(`Pull request ${context.payload.number} in the repo ${repoId} opened at ${createdAt}.`);
    
    if(context.payload.organization === undefined)
      return;

    const fieldUpdater: ProjectFieldValueUpdater = await ProjectFieldValueUpdater
      .initialize(context as PRCzujnikowniaContext, app.log);
    await fieldUpdater.updateDate(s => s.openPullRequestDateProjectFieldName, createdAt)
  });

  app.on("pull_request_review.submitted", async (context) => {
    const reviewDate: string = context.payload.review.submitted_at;
    const repoId: string = context.payload.repository.node_id;
    app.log.info(`Review ${context.payload.review.node_id} submitted in the repo ${repoId} opened at ${reviewDate}.`);

    if(context.payload.organization === undefined)
      return;

    const fieldUpdater: ProjectFieldValueUpdater = await ProjectFieldValueUpdater
      .initialize(context as PRCzujnikowniaContext, app.log);
    await fieldUpdater.updateDate(s => s.lastReviewSubmitDateProjectFieldName, reviewDate);

    if(context.payload.review.state == "approved")
      await fieldUpdater.updateDate(s => s.lastApprovedReviewSubmitDateProjectFieldName, reviewDate);

    await fieldUpdater.increment(s => s.reviewIterationNumberProjectFieldName);
  });

  app.onAny(async (context) => {
    app.log.debug({ id: context.id, event: context.name });
  });
};
