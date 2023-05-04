export class KeywordSettings
{
    teamNameTrigger: string = "20";
    projectTitlePrefix: string = "sensor-";
    projectTemplateNumber?: Number;
}

class AppGlobalSettings {
    keywordSettings: KeywordSettings[] = []
};

export async function loadFirstKeywordSettings(context: any, testingName: string): Promise<KeywordSettings | undefined>
{
    const defaultSettings = new AppGlobalSettings;
    defaultSettings.keywordSettings.push(new KeywordSettings)

    const configHolder = await context.octokit.config.get({
        owner: context.payload.organization.login,
        repo: ".github-private",
        path: ".github/sensor-room.yml",
        defaults: defaultSettings
    });

    const config: AppGlobalSettings = <AppGlobalSettings>configHolder.config;

    return config.keywordSettings.find(s => testingName.includes(s.teamNameTrigger));
}