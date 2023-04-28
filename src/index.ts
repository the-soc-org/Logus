import { Probot } from "probot";

class AppGlobalSettings
{
  teamNameKeywordTrigger: string = "20";
  projectTitlePrefix: string = "monitor-";
}

async function loadGlobalSettings(context: any): Promise<AppGlobalSettings>
{
  const configHolder = await context.octokit.config.get({
    owner: context.payload.organization.login,
    repo: ".github-private",
    path: ".github/sensor-room.yml",
    defaults: {config: new AppGlobalSettings()},
    branch: "main"
  });
  return <AppGlobalSettings>configHolder.config;
}

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

    const settings: AppGlobalSettings = await loadGlobalSettings(context);

    const teamName: string = context.payload.team.name;
    app.log.info(`Team ${teamName} has been created.`);
    
    if(teamName.includes(settings.teamNameKeywordTrigger))
    {
      const projectTitle = settings.projectTitlePrefix + teamName;
      
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
