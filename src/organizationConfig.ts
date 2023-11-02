import { CzujnikowniaContext } from "./czujnikowniaContexts";

export class OrganizationConfig {
    [key: string]: any;
    
    private static readonly configFileName: string = 'czujnikownia-org.yml';

    readonly keywordConfigs: KeywordConfiguration[] = [];

    constructor(organizationConfig: OrganizationConfig | null = null) {
        if(organizationConfig)
            for(const ks of organizationConfig.keywordConfigs)
                this.keywordConfigs.push(new KeywordConfiguration(ks));
    }

    public static async load(context: CzujnikowniaContext) : Promise<OrganizationConfig>
    {
        const defaultConfig = new OrganizationConfig;
        defaultConfig.keywordConfigs.push(new KeywordConfiguration)

        const configHolder = await context.octokit.config.get<OrganizationConfig>({
            owner: context.payload.organization.login,
            repo: ".github-private",
            path: `.github/${this.configFileName}`,
            defaults: defaultConfig
        });

        return new OrganizationConfig(configHolder.config);
    }
};

export class KeywordConfiguration
{
    [key: string]: any;

    readonly teamNameTrigger: string = "-";
    readonly projectTitlePrefix: string = "monitor-";
    readonly openPullRequestDateProjectFieldName?: string;
    readonly lastReviewSubmitDateProjectFieldName?: string;
    readonly lastApprovedReviewSubmitDateProjectFieldName?: string;
    readonly reviewIterationNumberProjectFieldName?: string;
    readonly projectTemplateNumber?: Number;

    public getProjectTitle(teamName: string): string {
        return this.projectTitlePrefix + teamName;
    }

    constructor(keywordConfig: KeywordConfiguration | null = null) {
        if(keywordConfig)
            for(const key in keywordConfig)
                this[key] = keywordConfig[key];
    }

    public static async loadFirst(context: CzujnikowniaContext, testingTeamName: string): Promise<KeywordConfiguration | undefined>
    {
        const config: OrganizationConfig = await OrganizationConfig.load(context);
        return config.keywordConfigs.find(s => s.nameIncludeTrigger(testingTeamName));
    }

    private nameIncludeTrigger(testingTeamName: string): boolean {
        return testingTeamName.toLowerCase().includes(this.teamNameTrigger.toLowerCase());
    }
}