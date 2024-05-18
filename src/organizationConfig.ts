import { CzujnikowniaOrgConfigContext } from "./czujnikowniaContexts";

export class OrganizationConfig {
    [key: string]: any;
    
    private static readonly configFileName: string = 'czujnikownia.yml';

    readonly projectTitlePrefix: string = "monitor-";
    readonly openPullRequestDateProjectFieldName?: string;
    readonly lastReviewSubmitDateProjectFieldName?: string;
    readonly firstReviewSubmitDateProjectFieldName?: string;
    readonly lastApprovedReviewSubmitDateProjectFieldName?: string;
    readonly reviewIterationNumberProjectFieldName?: string;
    readonly projectTemplateNumber?: Number;
    readonly addPullRequestAuthorAsAssignee: boolean = false;

    constructor(keywordConfig: OrganizationConfig | null = null) {
        if(keywordConfig)
            for(const key in keywordConfig)
                this[key] = keywordConfig[key];
    }

    public static async load(context: CzujnikowniaOrgConfigContext) : Promise<OrganizationConfig>
    {
        const defaultConfig = new OrganizationConfig;

        const configHolder = await context.octokit.config.get<OrganizationConfig>({
            owner: context.payload.organization.login,
            repo: ".github-private",
            path: `.github/${this.configFileName}`,
            defaults: defaultConfig
        });

        return new OrganizationConfig(configHolder.config);
    }
};