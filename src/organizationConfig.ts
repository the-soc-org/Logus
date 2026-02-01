import type { LogusOrgConfigContext } from "./logusContexts";

/**
 * Represents the configuration for the Logus organization.
 */
export class OrganizationConfig {
  [key: string]: unknown;

  /**
   * The name of the configuration file.
   */
  private static readonly configFileName: string = "logus.yml";

  /**
   * The prefix for project titles.
   */
  readonly projectTitlePrefix: string = "monitor-";

  /**
   * The name of the field for the open pull request date.
   */
  readonly openPullRequestDateProjectFieldName?: string;

  /**
   * The name of the field for the last review submit date.
   */
  readonly lastReviewSubmitDateProjectFieldName?: string;

  /**
   * The name of the field for the first review submit date.
   */
  readonly firstReviewSubmitDateProjectFieldName?: string;

  /**
   * The name of the field for the last approved review submit date.
   */
  readonly lastApprovedReviewSubmitDateProjectFieldName?: string;

  /**
   * The name of the field for the review iteration number.
   */
  readonly reviewIterationNumberProjectFieldName?: string;

  /**
   * The number of the project template.
   */
  readonly projectTemplateNumber?: number;

  /**
   * Indicates whether the pull request author should be added as an assignee.
   */
  readonly addPullRequestAuthorAsAssignee: boolean = false;

  /**
   * Creates an instance of OrganizationConfig.
   * @param keywordConfig An optional configuration object to initialize the instance.
   */
  constructor(keywordConfig: OrganizationConfig | undefined = undefined) {
    if (keywordConfig)
      for (const key in keywordConfig) this[key] = keywordConfig[key];
  }

  /**
   * Loads the organization configuration from the repository.
   * @param context The context of the Logus organization configuration.
   * @returns A promise that resolves to an instance of OrganizationConfig.
   */
  public static async load(
    context: LogusOrgConfigContext,
  ): Promise<OrganizationConfig> {
    const defaultConfig = new OrganizationConfig();

    const configHolder = await context.octokit.config.get<OrganizationConfig>({
      owner: context.payload.organization.login,
      repo: ".github-private",
      path: `.github/${this.configFileName}`,
      defaults: defaultConfig,
    });

    return new OrganizationConfig(configHolder.config);
  }
}
