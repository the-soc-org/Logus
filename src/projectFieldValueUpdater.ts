import { OrganizationConfig } from "./organizationConfig";
import { PRCzujnikowniaContext } from "./czujnikowniaContexts";
import { addProjectItem, listOpenedProjectsInOrg, listTeamNodesRelatedToRepo,
   ProjectInOrgQueryResultElement, updateItemDate, updateItemNumber } from "./graphql";

export interface ProjectFieldValueUpdater {
  updateDate(fieldNameSelector: (s: OrganizationConfig) => string | undefined, newFieldValue: string,
    condition?: (currentFieldVal: string) => boolean): Promise<void>;
  increment(fieldNameSelector: (s: OrganizationConfig) => string | undefined,
    condition?: (currentFieldVal: string) => boolean): Promise<void>;
}

export class ProjectFieldValueUpdaterFactory {
  public static async create(context: PRCzujnikowniaContext, log: any = null): Promise<ProjectFieldValueUpdater> {
    const componentUpdaters: BasicProjectFieldValueUpdater[] = [];

    const config: OrganizationConfig = await OrganizationConfig.load(context);
    const teams = await listTeamNodesRelatedToRepo(context, config.projectTitlePrefix);

    const uniqueTitles = new Set<string>();
    for(const team of teams)
      for(const proj of team.projectsV2.nodes.filter(n => n.title.startsWith(config.projectTitlePrefix)))
        uniqueTitles.add(proj.title);

    for(const projTitle of uniqueTitles) {
      const projects = await listOpenedProjectsInOrg(context, projTitle);
      componentUpdaters.push(new BasicProjectFieldValueUpdater(context, projects, config, log));
    }

    return new ProjectFieldUpdaterGroup(componentUpdaters);
  }
}

class ProjectFieldUpdaterGroup implements ProjectFieldValueUpdater {
  fieldUpdaters: BasicProjectFieldValueUpdater[];

  public constructor(fieldUpdaters: BasicProjectFieldValueUpdater[]) {
    this.fieldUpdaters = fieldUpdaters;
  }

  public async updateDate(fieldNameSelector: (s: OrganizationConfig) => string | undefined, newFieldValue: string,
    condition: (currentFieldVal: string) => boolean = (_c) => true) {
    const promises: Promise<void>[] = [];
    for(const updater of this.fieldUpdaters)
      promises.push(updater.updateDate(fieldNameSelector, newFieldValue, condition));

      await Promise.all(promises);
  }

  public async increment(fieldNameSelector: (s: OrganizationConfig) => string | undefined) {
    const promises: Promise<void>[] = [];
    for(const updater of this.fieldUpdaters)
      promises.push(updater.increment(fieldNameSelector));

      await Promise.all(promises);
  }
}

class BasicProjectFieldValueUpdater implements ProjectFieldValueUpdater {

  private readonly context: PRCzujnikowniaContext;
  private readonly projects: ProjectInOrgQueryResultElement[];
  private readonly orgConfig: OrganizationConfig;
  private readonly log: any | null;

  public constructor(context: PRCzujnikowniaContext,
    projects: ProjectInOrgQueryResultElement[], orgConfig: OrganizationConfig, log: any) {

    this.context = context;
    this.projects = projects;
    this.orgConfig = orgConfig;
    this.log = log;
  }

  public async updateDate(fieldNameSelector: (s: OrganizationConfig) => string | undefined, newFieldValue: string,
    condition: (currentFieldVal: string) => boolean = (_c) => true) {
      
    await this.updateField(fieldNameSelector, async (proj, item, fieldId) => {
      if(condition(item.fieldValue)) {
        await updateItemDate(this.context, proj.id, item.itemId, fieldId, newFieldValue as string, this.log);
        this.log?.info(`Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`);
      }
    });
  }

  public async increment(fieldNameSelector: (s: OrganizationConfig) => string | undefined) {
    await this.updateField(fieldNameSelector, async (proj, item, fieldId) => {
      const newFieldValue: number = (item.fieldValue as number) + 1;
      await updateItemNumber(this.context, proj.id, item.itemId, fieldId, newFieldValue, this.log);
      this.log?.info(`Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`);
    });
  }

  private async updateField(
    fieldNameSelector: (s: OrganizationConfig) => string | undefined,
    action: (proj: ProjectInOrgQueryResultElement, item: {itemId: string, fieldValue: any}, fieldId: string) => Promise<void>) {

    for (const proj of this.projects) {
      const fieldName: string = fieldNameSelector(this.orgConfig)!;

      const fieldId: string | undefined = proj.fields.find(f => this.caseInsensiviteEqual(f.name, fieldName))?.id;
      if (fieldId === undefined)
        continue;

      const item = await addProjectItem(this.context, proj.id, this.context.payload.pull_request.node_id, fieldName, this.log);
      await action(proj, item, fieldId);
    }
  }

  private caseInsensiviteEqual(firstString: string | undefined, secondString: string): boolean {
    return firstString?.localeCompare(secondString, undefined, { sensitivity: 'accent' }) === 0;
  }
}