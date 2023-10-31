import { ScheduleContext } from "./czujnikowniaContexts";

export class RepoSettings {
    [key: string]: any;

    private static readonly settingsFileName: string = 'czujnikownia-repo.yml';

    readonly reviewReminder: ReminderSettings = new ReminderSettings;
    readonly replayToReviewReminder: ReminderSettings = new ReminderSettings;

    constructor(repoSettings: RepoSettings | null = null) {
        if(repoSettings) {
            this.reviewReminder = new ReminderSettings(repoSettings.reviewReminder);
            this.replayToReviewReminder = new ReminderSettings(repoSettings.replayToReviewReminder);
        }
    }

    public static async load(context: ScheduleContext) {
        const configHolder = await context.octokit.config.get<RepoSettings>({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            path: `.github/${this.settingsFileName}`,
            defaults: new RepoSettings
        });

        return new RepoSettings(configHolder.config);
    }
}
export class ReminderSettings {
    [key: string]: any;

    isEnabled: boolean = false;
    message: string = "🤖";
    inactivityHoursToSend: number = 5 * 24;

    constructor(reminderSettings: ReminderSettings | null = null) {
        if(reminderSettings)
            for(const key in reminderSettings)
                this[key] = reminderSettings[key];
    }
}