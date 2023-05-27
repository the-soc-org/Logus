export class KeywordSettings
{
    teamNameTrigger: string = "20";
    projectTitlePrefix: string = "sensor-";
    openPullRequestDateProjectFieldName?: string;
    lastReviewSubmitDateProjectFieldName?: string;
    projectTemplateNumber?: Number;
}

export class AppGlobalSettings {
    keywordSettings: KeywordSettings[] = []
};

export async function loadFirstKeywordSettings(context: any, testingName: string): Promise<KeywordSettings | undefined>
{
    const config: AppGlobalSettings = await loadAppGlobalSettings(context);
    return config.keywordSettings.find(s => testingName.includes(s.teamNameTrigger));
}

export async function loadAppGlobalSettings(context: any) : Promise<AppGlobalSettings>
{
    const defaultSettings = new AppGlobalSettings;
    defaultSettings.keywordSettings.push(new KeywordSettings)

    const configHolder = await context.octokit.config.get({
        owner: context.payload.organization.login,
        repo: ".github-private",
        path: ".github/sensor-room.yml",
        defaults: defaultSettings
    });

    return <AppGlobalSettings>configHolder.config;
}