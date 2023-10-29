import { CzujnikowniaContext } from "./czujnikowniaContexts";

export class OrganizationSettings {
    [key: string]: any;
    
    private static readonly settingsFileName: string = 'sensor-room.yml';

    readonly keywordSettings: KeywordSettings[] = [];

    constructor(globalSettings: OrganizationSettings | null = null) {
        if(globalSettings)
            for(const ks of globalSettings.keywordSettings)
                this.keywordSettings.push(new KeywordSettings(ks));
    }

    public static async load(context: CzujnikowniaContext) : Promise<OrganizationSettings>
    {
        const defaultSettings = new OrganizationSettings;
        defaultSettings.keywordSettings.push(new KeywordSettings)

        const configHolder = await context.octokit.config.get<OrganizationSettings>({
            owner: context.payload.organization.login,
            repo: ".github-private",
            path: `.github/${this.settingsFileName}`,
            defaults: defaultSettings
        });

        return new OrganizationSettings(configHolder.config);
    }
};

export class KeywordSettings
{
    [key: string]: any;

    readonly teamNameTrigger: string = "-";
    readonly projectTitlePrefix: string = "Sensor-";
    readonly openPullRequestDateProjectFieldName?: string;
    readonly lastReviewSubmitDateProjectFieldName?: string;
    readonly lastApprovedReviewSubmitDateProjectFieldName?: string;
    readonly reviewIterationNumberProjectFieldName?: string;
    readonly projectTemplateNumber?: Number;

    public getProjectTitle(teamName: string): string {
        return this.projectTitlePrefix + teamName;
    }

    constructor(settings: KeywordSettings | null = null) {
        if(settings)
            for(const key in settings)
                this[key] = settings[key];
    }

    public static async loadFirst(context: CzujnikowniaContext, testingTeamName: string): Promise<KeywordSettings | undefined>
    {
        const config: OrganizationSettings = await OrganizationSettings.load(context);
        return config.keywordSettings.find(s => s.nameIncludeTrigger(testingTeamName));
    }

    private nameIncludeTrigger(testingTeamName: string): boolean {
        return testingTeamName.toLowerCase().includes(this.teamNameTrigger.toLowerCase());
    }
}