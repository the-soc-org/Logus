import { KeywordSettings, AppGlobalSettings, loadAppGlobalSettings } from "./settings";
import { ProjectInOrgQueryResultElement, listProjectsInOrg, listUserTeamsInOrgRelatedToRepo } from "./czujnikowniaGraphQueries";
import { updateItemDateField, addItemToProjIfNotExist, updateItemNumberField} from "./czujnikowniaGraphMutations";

export class ProjectFieldValueUpdater {

  private readonly context: any;
  private readonly userTeams: string[];
  private readonly projects: ProjectInOrgQueryResultElement[];
  private readonly globalSettings: AppGlobalSettings;
  private readonly log: any | null;

  private constructor(context: any,
    userTeams: string[], projects: ProjectInOrgQueryResultElement[], globalSettings: AppGlobalSettings, log: any) {
    this.context = context;
    this.userTeams = userTeams;
    this.projects = projects;
    this.globalSettings = globalSettings;
    this.log = log;
  }

  public static async initialize(context: any, log: any = null): Promise<ProjectFieldValueUpdater> {
    const userTeams: Promise<string[]> = listUserTeamsInOrgRelatedToRepo(context)
    const projects: Promise<ProjectInOrgQueryResultElement[]> = listProjectsInOrg(context);
    const globalSettings: Promise<AppGlobalSettings> = loadAppGlobalSettings(context);

    return new ProjectFieldValueUpdater(context, await userTeams, await projects, await globalSettings, log);
  }

  public async updateDate(fieldNameSelector: (s: KeywordSettings) => string | undefined, newFieldValue: string) {
    await this.updateField(fieldNameSelector, async (proj, item, fieldId) => {
      await updateItemDateField(this.context, proj.id, item.itemId, fieldId, newFieldValue as string, this.log);
      this.log?.info(`Field ${fieldId} updated in ${proj.title} project to value ${newFieldValue}.`);
    });
  }

  public async increment(fieldNameSelector: (s: KeywordSettings) => string | undefined) {
    await this.updateField(fieldNameSelector, async (proj, item, fieldId) => {
      await updateItemNumberField(this.context, proj.id, item.itemId, fieldId, (item.fieldValue as number) + 1, this.log);
    });
  }

  private async updateField(
    fieldNameSelector: (s: KeywordSettings) => string | undefined,
    action: (proj: ProjectInOrgQueryResultElement, item: {itemId: string, fieldValue: any}, fieldId: string) => Promise<void>) 
  {
    for (const teamName of this.userTeams) {
      const settings: KeywordSettings | undefined = this.globalSettings.keywordSettings
        .find(s => teamName.includes(s.teamNameTrigger) && fieldNameSelector(s) !== undefined);
      if (settings === undefined)
        continue;
      const fieldName: string = fieldNameSelector(settings)!;

      const proj: ProjectInOrgQueryResultElement | undefined = this.projects.find(x => x.title === settings.getProjectTitle(teamName));
      if (proj === undefined)
        continue;

      const fieldId: string | undefined = proj.fields.find(f => f.name == fieldName)?.id;
      if (fieldId === undefined)
        continue;

      const item = await addItemToProjIfNotExist(this.context, proj.id, this.context.payload.pull_request.node_id, fieldName, this.log);
      await action(proj, item, fieldId);
    }
  }
}
