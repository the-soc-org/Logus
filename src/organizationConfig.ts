import type { LogusOrgConfigContext } from "./logusContexts";

/**
 * Represents the configuration for the Logus organization.
 *
 * This class defines default configuration values.
 * When loading from a repository:
 * - If no custom configuration is found, all default values are used.
 * - If custom configuration exists, its values override the defaults.
 * - Any fields not specified in the custom configuration fall back to their default values.
 */
export class OrganizationConfig {
  [key: string]: unknown;

  /**
   * The name of the configuration file.
   */
  private static readonly configFileName: string = "logus.yml";

  /**
   * The prefix for project titles.
   * @default "monitor-"
   */
  readonly projectTitlePrefix: string = "monitor-";

  /**
   * The name of the field for the open pull request date.
   * @default "Posted Date"
   */
  readonly openPullRequestDateProjectFieldName?: string = "Posted Date";

  /**
   * The name of the field for the last review submit date.
   * @default "Last Review Date"
   */
  readonly lastReviewSubmitDateProjectFieldName?: string = "Last Review Date";

  /**
   * The name of the field for the first review submit date.
   * @default "First Review Date"
   */
  readonly firstReviewSubmitDateProjectFieldName?: string = "First Review Date";

  /**
   * The name of the field for the last approved review submit date.
   * @default "Last Approved Review Date"
   */
  readonly lastApprovedReviewSubmitDateProjectFieldName?: string =
    "Last Approved Review Date";

  /**
   * The name of the field for the review iteration number.
   * @default "Review Iteration"
   */
  readonly reviewIterationNumberProjectFieldName?: string = "Review Iteration";

  /**
   * The number of the project template.
   */
  readonly projectTemplateNumber?: number;

  /**
   * Indicates whether the pull request author should be added as an assignee.
   * @default true
   */
  readonly addPullRequestAuthorAsAssignee: boolean = true;

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
   *
   * Attempts to load configuration from `.github-private/.github/logus.yml`.
   * If the file is not found, falls back to `.github/.github/logus.yml`.
   * If no configuration file exists, returns the default configuration values defined in this class.
   *
   * When a custom configuration is found, values from the custom configuration override the default values. Any configuration fields not present in the custom configuration retain their default values.
   *
   * @param context The context of the Logus organization configuration.
   * @returns A promise that resolves to an instance of OrganizationConfig with custom settings from the repository merged with default values.
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
