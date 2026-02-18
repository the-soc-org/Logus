import { OrganizationConfig } from "./organizationConfig";
import type { LogusLog, PRLogusContext } from "./logusContexts";
import {
  addProjectItem,
  listOpenedProjectsInOrg,
  listTeamNodesRelatedToRepo,
  ProjectInOrgQueryResultElement,
  updateItemDate,
  updateItemNumber,
} from "./graphql";

/**
 * Interface for updating project field values.
 */
export interface ProjectFieldValueUpdater {
  /**
   * Updates the date field in the project.
   * @param fieldNameSelector - Function to select the field name from the organization config.
   * @param newFieldValue - The new value to set for the field.
   * @param condition - Optional condition to check before updating the field.
   */
  updateDate(
    fieldNameSelector: (s: OrganizationConfig) => string | undefined,
    newFieldValue: string,
    condition?: (currentFieldVal: string) => boolean,
  ): Promise<void>;

  /**
   * Increments the number field in the project.
   * @param fieldNameSelector - Function to select the field name from the organization config.
   * @param condition - Optional condition to check before incrementing the field.
   */
  increment(
    fieldNameSelector: (s: OrganizationConfig) => string | undefined,
    condition?: (currentFieldVal: string) => boolean,
  ): Promise<void>;
}

/**
 * Factory class for creating ProjectFieldValueUpdater instances.
 *
 * @remarks
 * The {@link ProjectFieldValueUpdaterFactory.create} method builds a
 * {@link ProjectFieldUpdaterGroup} that aggregates one or more
 * {@link BasicProjectFieldValueUpdater} instances.
 */
export class ProjectFieldValueUpdaterFactory {
  /**
   * Creates a ProjectFieldValueUpdater instance.
   * @param context - The context of the pull request.
   * @param log - Optional logger instance.
   * @returns A {@link ProjectFieldUpdaterGroup} that wraps
   * one or more {@link BasicProjectFieldValueUpdater} instances.
   */
  public static async create(
    context: PRLogusContext,
    log: LogusLog | undefined = undefined,
  ): Promise<ProjectFieldValueUpdater> {
    const componentUpdaters: BasicProjectFieldValueUpdater[] = [];

    const config: OrganizationConfig = await OrganizationConfig.load(context);
    const teams = await listTeamNodesRelatedToRepo(
      context,
      config.projectTitlePrefix,
    );

    const uniqueTitles = new Set<string>();
    for (const team of teams)
      for (const proj of team.projectsV2.nodes.filter((n) =>
        n.title.startsWith(config.projectTitlePrefix),
      ))
        uniqueTitles.add(proj.title);

    for (const projTitle of uniqueTitles) {
      const projects = await listOpenedProjectsInOrg(context, projTitle);
      // Filters projects to avoid duplicates in case of Polish characters.
      const filteredProjects = projects.filter(
        (project) => project.title === projTitle,
      );
      if (filteredProjects.length > 0) {
        componentUpdaters.push(
          new BasicProjectFieldValueUpdater(
            context,
            filteredProjects,
            config,
            log,
          ),
        );
      }
    }

    return new ProjectFieldUpdaterGroup(componentUpdaters);
  }
}

/**
 * Class for updating multiple project fields.
 *
 * @remarks
 * Created by {@link ProjectFieldValueUpdaterFactory.create} to aggregate
 * multiple {@link BasicProjectFieldValueUpdater} instances.
 */
export class ProjectFieldUpdaterGroup implements ProjectFieldValueUpdater {
  fieldUpdaters: BasicProjectFieldValueUpdater[];

  /**
   * Constructor for ProjectFieldUpdaterGroup.
   * @param fieldUpdaters - Array of BasicProjectFieldValueUpdater instances.
   */
  public constructor(fieldUpdaters: BasicProjectFieldValueUpdater[]) {
    this.fieldUpdaters = fieldUpdaters;
  }

  /**
   * Updates the date field in all projects.
   * @param fieldNameSelector - Function to select the field name from the organization config.
   * @param newFieldValue - The new value to set for the field.
   * @param condition - Optional condition to check before updating the field.
   */
  public async updateDate(
    fieldNameSelector: (s: OrganizationConfig) => string | undefined,
    newFieldValue: string,
    condition: (currentFieldVal: string) => boolean = (_c) => true,
  ) {
    const promises: Promise<void>[] = [];
    for (const updater of this.fieldUpdaters)
      promises.push(
        updater.updateDate(fieldNameSelector, newFieldValue, condition),
      );

    await Promise.all(promises);
  }

  /**
   * Increments the number field in all projects.
   * @param fieldNameSelector - Function to select the field name from the organization config.
   */
  public async increment(
    fieldNameSelector: (s: OrganizationConfig) => string | undefined,
  ) {
    const promises: Promise<void>[] = [];
    for (const updater of this.fieldUpdaters)
      promises.push(updater.increment(fieldNameSelector));

    await Promise.all(promises);
  }
}

/**
 * Class for updating a single project's field values.
 *
 * @remarks
 * Created by {@link ProjectFieldValueUpdaterFactory.create} for each
 * matching project configuration.
 */
export class BasicProjectFieldValueUpdater implements ProjectFieldValueUpdater {
  private readonly context: PRLogusContext;
  private readonly projects: ProjectInOrgQueryResultElement[];
  private readonly orgConfig: OrganizationConfig;
  private readonly log: LogusLog | undefined;

  /**
   * Constructor for BasicProjectFieldValueUpdater.
   * @param context - The context of the pull request.
   * @param projects - Array of projects to update.
   * @param orgConfig - The organization configuration.
   * @param log - Optional logger instance.
   */
  public constructor(
    context: PRLogusContext,
    projects: ProjectInOrgQueryResultElement[],
    orgConfig: OrganizationConfig,
    log: LogusLog | undefined,
  ) {
    this.context = context;
    this.projects = projects;
    this.orgConfig = orgConfig;
    this.log = log;
  }

  /**
   * Updates the date field in the project.
   * @param fieldNameSelector - Function to select the field name from the organization config.
   * @param newFieldValue - The new value to set for the field.
   * @param condition - Optional condition to check before updating the field.
   */
  public async updateDate(
    fieldNameSelector: (s: OrganizationConfig) => string | undefined,
    newFieldValue: string,
    condition: (currentFieldVal: string) => boolean = (_c) => true,
  ) {
    const fieldName = fieldNameSelector(this.orgConfig);
    if (fieldName === undefined || fieldName === null) return;

    await this.updateField(fieldName, async (proj, item, fieldId) => {
      if (condition(item.fieldValue.toString())) {
        await updateItemDate(
          this.context,
          proj.id,
          item.itemId,
          fieldId,
          newFieldValue as string,
          this.log,
        );
        this.log?.info(
          `Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`,
        );
      }
    });
  }

  /**
   * Increments the number field in the project.
   * @param fieldNameSelector - Function to select the field name from the organization config.
   */
  public async increment(
    fieldNameSelector: (s: OrganizationConfig) => string | undefined,
  ) {
    const fieldName = fieldNameSelector(this.orgConfig);
    if (fieldName === undefined || fieldName === null) return;

    await this.updateField(fieldName, async (proj, item, fieldId) => {
      const newFieldValue: number = (item.fieldValue as number) + 1;
      await updateItemNumber(
        this.context,
        proj.id,
        item.itemId,
        fieldId,
        newFieldValue,
        this.log,
      );
      this.log?.info(
        `Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`,
      );
    });
  }

  /**
   * Updates the specified field in the project.
   * @param fieldName - The name of the field to update.
   * @param action - Function to perform the update action.
   */
  private async updateField(
    fieldName: string,
    action: (
      proj: ProjectInOrgQueryResultElement,
      item: { itemId: string; fieldValue: number | string | Date },
      fieldId: string,
    ) => Promise<void>,
  ) {
    for (const proj of this.projects) {
      const fieldId: string | undefined = proj.fields.find((f) =>
        this.caseInsensiviteEqual(f.name, fieldName),
      )?.id;
      if (fieldId === undefined) continue;

      const item = await addProjectItem(
        this.context,
        proj.id,
        this.context.payload.pull_request.node_id,
        fieldName,
        this.log,
      );
      await action(proj, item, fieldId);
    }
  }

  /**
   * Compares two strings for equality, ignoring case and accents.
   * @param firstString - The first string to compare.
   * @param secondString - The second string to compare.
   * @returns True if the strings are equal, false otherwise.
   */
  private caseInsensiviteEqual(
    firstString: string | undefined,
    secondString: string,
  ): boolean {
    return (
      firstString?.localeCompare(secondString, undefined, {
        sensitivity: "accent",
      }) === 0
    );
  }
}
