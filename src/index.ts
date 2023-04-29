import { Probot } from "probot";
import { KeywordSettings, loadFirstKeywordSettings } from "./settings";

const createProjectQuery: string = `
mutation projectV2($ownerId: ID!, $title: String!) { 
  createProjectV2(input: {ownerId: $ownerId, title: $title}) {
    projectV2 {
      id
    }
  }
}
`;

export = (app: Probot) => {

  app.on("team.created", async (context) => {

    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been created.`);

    const keywordSettings: KeywordSettings | undefined = await loadFirstKeywordSettings(context, teamName);

    if(keywordSettings !== undefined)
    {
      const projectTitle = keywordSettings.projectTitlePrefix + teamName;
      
      await context.octokit.graphql(createProjectQuery, {
        ownerId: context.payload.organization.node_id,
        title: projectTitle,
      });

      app.log.info(`Project ${projectTitle} has been created.`);
    }
  });

  app.onAny(async (context) => {
    app.log.info({ id: context.id, event: context.name });
  });

  // app.on("installation", async (context) => {
  // });
};
