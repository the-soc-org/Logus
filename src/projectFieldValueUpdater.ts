import { KeywordSettings, AppGlobalSettings, loadAppGlobalSettings } from "./settings";
import { ProjectInOrgQueryResultElement, listOpenedProjectsInOrg, listUserTeamsInOrgRelatedToRepo } from "./czujnikowniaGraphQueries";
import { updateItemDateField, addItemToProjIfNotExist, updateItemNumberField} from "./czujnikowniaGraphMutations";
import { PRCzujnikowniaContext } from "./czujnikowniaContexts";

export interface ProjectFieldValueUpdater {
  updateDate(fieldNameSelector: (s: KeywordSettings) => string | undefined, newFieldValue: string): Promise<void>;
  increment(fieldNameSelector: (s: KeywordSettings) => string | undefined): Promise<void>;
}

export class ProjectFieldValueUpdaterFactory {

  public static async createLimited(context: PRCzujnikowniaContext, log: any = null): Promise<ProjectFieldValueUpdater> {
    const userTeams: Promise<string[]> = listUserTeamsInOrgRelatedToRepo(context);
    const projects: Promise<ProjectInOrgQueryResultElement[]> = listOpenedProjectsInOrg(context);
    const globalSettings: Promise<AppGlobalSettings> = loadAppGlobalSettings(context);

    return new BasicProjectFieldValueUpdater(context, await userTeams, await projects, (await globalSettings).keywordSettings, log);
  }

  public static async create(context: PRCzujnikowniaContext, log: any = null): Promise<ProjectFieldValueUpdater> {
    const globalSettings: AppGlobalSettings = await loadAppGlobalSettings(context);
    const componentUpdaters: BasicProjectFieldValueUpdater[] = [];

    for(const settings of globalSettings.keywordSettings) {
      const userTeams = await listUserTeamsInOrgRelatedToRepo(context, settings.teamNameTrigger);

      for(const team of userTeams) {
        const projects = await listOpenedProjectsInOrg(context, settings.getProjectTitle(team));
        componentUpdaters.push(new BasicProjectFieldValueUpdater(context, [team], projects, [settings], log));
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

  public async updateDate(fieldNameSelector: (s: KeywordSettings) => string | undefined, newFieldValue: string) {
    const promises: Promise<void>[] = [];
    for(const updater of this.fieldUpdaters)
      promises.push(updater.updateDate(fieldNameSelector, newFieldValue));

      await Promise.all(promises);
  }

  public async increment(fieldNameSelector: (s: KeywordSettings) => string | undefined) {
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
  private readonly keywordSettings: KeywordSettings[];
  private readonly log: any | null;

  public constructor(context: PRCzujnikowniaContext,
    userTeams: string[], projects: ProjectInOrgQueryResultElement[], keywordSettings: KeywordSettings[], log: any) {
    this.context = context;
    this.userTeams = userTeams;
    this.projects = projects;
    this.keywordSettings = keywordSettings;
    this.log = log;
  }

  public async updateDate(fieldNameSelector: (s: KeywordSettings) => string | undefined, newFieldValue: string) {
    await this.updateField(fieldNameSelector, async (proj, item, fieldId) => {
      await updateItemDateField(this.context, proj.id, item.itemId, fieldId, newFieldValue as string, this.log);
      this.log?.info(`Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`);
    });
  }

  public async increment(fieldNameSelector: (s: KeywordSettings) => string | undefined) {
    await this.updateField(fieldNameSelector, async (proj, item, fieldId) => {
      const newFieldValue: number = (item.fieldValue as number) + 1;
      await updateItemNumberField(this.context, proj.id, item.itemId, fieldId, newFieldValue, this.log);
      this.log?.info(`Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`);
    });
  }

  private async updateField(
    fieldNameSelector: (s: KeywordSettings) => string | undefined,
    action: (proj: ProjectInOrgQueryResultElement, item: {itemId: string, fieldValue: any}, fieldId: string) => Promise<void>) 
  {
    for (const teamName of this.userTeams) {
      const settings: KeywordSettings | undefined = this.keywordSettings
        .find(s => teamName.toLowerCase().includes(s.teamNameTrigger.toLowerCase()) && fieldNameSelector(s) !== undefined);
      if (settings === undefined)
        continue;
      const fieldName: string = fieldNameSelector(settings)!;

      const proj: ProjectInOrgQueryResultElement | undefined = this.projects
        .find(p => this.caseInsensiviteEqual(p.title, settings.getProjectTitle(teamName)));
      if (proj === undefined)
        continue;

      const fieldId: string | undefined = proj.fields.find(f => this.caseInsensiviteEqual(f.name, fieldName))?.id;
      if (fieldId === undefined)
        continue;

      const item = await addItemToProjIfNotExist(this.context, proj.id, this.context.payload.pull_request.node_id, fieldName, this.log);
      await action(proj, item, fieldId);
    }
  }

  private caseInsensiviteEqual(firstString: string, secondString: string): boolean {
    return firstString?.localeCompare(secondString, undefined, { sensitivity: 'accent' }) === 0;
  }
}