import { Probot } from "probot";
import { KeywordSettings, loadFirstKeywordSettings } from "./settings";

const createProjectMutation: string = `
mutation createProject($ownerId: ID!, $title: String!) { 
  createProjectV2(input: {ownerId: $ownerId, title: $title}) {
    projectV2 {
      id
    }
  }
}`;

const getProjectIdQuery: string = `
query getProjectId($organizationLogin: String!, $projectNumber: Int!) {
  organization(login: $organizationLogin) {
    projectV2(number: $projectNumber) {
      id
    }
  }
}`;

const copyProjectMutation: string = `
mutation copyProject($projectId: ID!, $ownerId: ID!, $title: String!){
  copyProjectV2(input:{projectId: $projectId, ownerId: $ownerId, title: $title}) {
    projectV2 {
      id,
      number
    }
  }
}`;

export = (app: Probot) => {

  app.on("team.created", async (context) => {

    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been created.`);

    const keywordSettings: KeywordSettings | undefined = await loadFirstKeywordSettings(context, teamName);

    if(keywordSettings !== undefined) {
      const projectTitle = keywordSettings.projectTitlePrefix + teamName;
      
      const projectCreateArgs: any = {
        ownerId: context.payload.organization.node_id,
        title: projectTitle,
      };

      if(keywordSettings.projectTemplateNumber == undefined) {
        await context.octokit.graphql(createProjectMutation, projectCreateArgs);
        
        app.log.info(`Project ${projectTitle} has been created.`);
      }
      else {
        const result: any = await context.octokit.graphql(getProjectIdQuery, {
          organizationLogin: context.payload.organization.login,
          projectNumber: keywordSettings.projectTemplateNumber,
        });

        projectCreateArgs.projectId = result.organization.projectV2.id;
        await context.octokit.graphql(copyProjectMutation, projectCreateArgs);

        app.log.info(`Project ${projectTitle} has been created from template ${keywordSettings.projectTemplateNumber}`);
      }
    }
  });

  app.onAny(async (context) => {
    app.log.info({ id: context.id, event: context.name });
  });

  // app.on("installation", async (context) => {
  // });
};
