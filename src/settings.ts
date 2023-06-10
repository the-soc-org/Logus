export class KeywordSettings
{
    readonly teamNameTrigger: string = "-";
    readonly projectTitlePrefix: string = "sensor-";
    readonly openPullRequestDateProjectFieldName?: string;
    readonly lastReviewSubmitDateProjectFieldName?: string;
    readonly reviewIterationNumberProjectFieldName?: string;
    readonly projectTemplateNumber?: Number;

    public getProjectTitle(teamName:string) : string {
        return this.projectTitlePrefix + teamName;
    }

    constructor(settings: KeywordSettings | null = null) {
        if(settings)
            Object.assign(this, settings);
    }
}

export class AppGlobalSettings {
    readonly keywordSettings: KeywordSettings[] = []

    constructor(globalSettings: AppGlobalSettings | null = null) {
        if(globalSettings)
            for(const x of globalSettings.keywordSettings)
                this.keywordSettings.push(new KeywordSettings(x));
    }
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

    return new AppGlobalSettings(configHolder.config);
}