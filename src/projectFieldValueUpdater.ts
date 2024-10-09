import { KeywordConfiguration, OrganizationConfig } from "./organizationConfig";
import { CzujnikowniaLog, PRCzujnikowniaContext } from "./czujnikowniaContexts";
import { addProjectItem, listOpenedProjectsInOrg, listUserTeamsInOrgRelatedToRepo,
   ProjectInOrgQueryResultElement, updateItemDate, updateItemNumber } from "./graphql";

export interface ProjectFieldValueUpdater {
  updateDate(fieldNameSelector: (s: KeywordConfiguration) => string | undefined, newFieldValue: string,
    condition?: (currentFieldVal: string) => boolean): Promise<void>;
  increment(fieldNameSelector: (s: KeywordConfiguration) => string | undefined,
    condition?: (currentFieldVal: string) => boolean): Promise<void>;
}

export class ProjectFieldValueUpdaterFactory {

  public static async createBasicUpdater(context: PRCzujnikowniaContext, log: CzujnikowniaLog | undefined = undefined): Promise<ProjectFieldValueUpdater> {
    const userTeams: Promise<string[]> = listUserTeamsInOrgRelatedToRepo(context);
    const projects: Promise<ProjectInOrgQueryResultElement[]> = listOpenedProjectsInOrg(context);
    const organizationConfig: Promise<OrganizationConfig> = OrganizationConfig.load(context);

    return new BasicProjectFieldValueUpdater(context, await userTeams, await projects, (await organizationConfig).keywordConfigs, log);
  }

  public static async create(context: PRCzujnikowniaContext, log: CzujnikowniaLog | undefined = undefined): Promise<ProjectFieldValueUpdater> {
    const globalConfig: OrganizationConfig = await OrganizationConfig.load(context);
    const componentUpdaters: BasicProjectFieldValueUpdater[] = [];

    for(const config of globalConfig.keywordConfigs) {
      const userTeams = await listUserTeamsInOrgRelatedToRepo(context, config.teamNameTrigger);

      for(const team of userTeams) {
        const projects = await listOpenedProjectsInOrg(context, config.getProjectTitle(team));
        componentUpdaters.push(new BasicProjectFieldValueUpdater(context, [team], projects, [config], log));
      }
    }
    return new ProjectFieldUpdaterGroup(componentUpdaters);
  }
}

class ProjectFieldUpdaterGroup implements ProjectFieldValueUpdater {
  fieldUpdaters: BasicProjectFieldValueUpdater[];

  public constructor(fieldUpdaters: BasicProjectFieldValueUpdater[]) {
    this.fieldUpdaters = fieldUpdaters;
  }

  public async updateDate(fieldNameSelector: (s: KeywordConfiguration) => string | undefined, newFieldValue: string,
    condition: (currentFieldVal: string) => boolean = (_c) => true) {
    const promises: Promise<void>[] = [];
    for(const updater of this.fieldUpdaters)
      promises.push(updater.updateDate(fieldNameSelector, newFieldValue, condition));

      await Promise.all(promises);
  }

  public async increment(fieldNameSelector: (s: KeywordConfiguration) => string | undefined) {
    const promises: Promise<void>[] = [];
    for(const updater of this.fieldUpdaters)
      promises.push(updater.increment(fieldNameSelector));

      await Promise.all(promises);
  }
}

class BasicProjectFieldValueUpdater implements ProjectFieldValueUpdater {

  private readonly context: PRCzujnikowniaContext;
  private readonly userTeams: string[];
  private readonly projects: ProjectInOrgQueryResultElement[];
  private readonly keywordConfigs: KeywordConfiguration[];
  private readonly log: CzujnikowniaLog | undefined;

  public constructor(context: PRCzujnikowniaContext,
    userTeams: string[], projects: ProjectInOrgQueryResultElement[], keywordConfigs: KeywordConfiguration[], log: CzujnikowniaLog | undefined) {
    this.context = context;
    this.userTeams = userTeams;
    this.projects = projects;
    this.keywordConfigs = keywordConfigs;
    this.log = log;
  }

  public async updateDate(fieldNameSelector: (s: KeywordConfiguration) => string | undefined, newFieldValue: string,
    condition: (currentFieldVal: string) => boolean = (_c) => true) {
    await this.updateField(fieldNameSelector, async (proj, item, fieldId) => {
      if(condition(item.fieldValue.toString())) {
        await updateItemDate(this.context, proj.id, item.itemId, fieldId, newFieldValue as string, this.log);
        this.log?.info(`Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`);
      }
    });
  }

  public async increment(fieldNameSelector: (s: KeywordConfiguration) => string | undefined) {
    await this.updateField(fieldNameSelector, async (proj, item, fieldId) => {
      const newFieldValue: number = (item.fieldValue as number) + 1;
      await updateItemNumber(this.context, proj.id, item.itemId, fieldId, newFieldValue, this.log);
      this.log?.info(`Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`);
    });
  }

  private async updateField(
    fieldNameSelector: (s: KeywordConfiguration) => string | undefined,
    action: (proj: ProjectInOrgQueryResultElement, item: {itemId: string, fieldValue: number | string | Date}, fieldId: string) => Promise<void>) 
  {
    for (const teamName of this.userTeams) {
      const config: KeywordConfiguration | undefined = this.keywordConfigs
        .find(s => teamName.toLowerCase().includes(s.teamNameTrigger.toLowerCase()) && fieldNameSelector(s) !== undefined);
      if (config === undefined)
        continue;
      const fieldName: string = fieldNameSelector(config)!;

      const proj: ProjectInOrgQueryResultElement | undefined = this.projects
        .find(p => this.caseInsensiviteEqual(p.title, config.getProjectTitle(teamName)));
      if (proj === undefined)
        continue;

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