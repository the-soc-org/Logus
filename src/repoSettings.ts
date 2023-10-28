import { ScheduleContext } from "./czujnikowniaContexts";

export class RepoSettings {
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
    isEnabled: boolean = false;
    message: string = '🤖';
    inactivityDaysToSend: number = 5;

    constructor(reminderSettings: ReminderSettings | null = null) {
        if(reminderSettings) {
            this.isEnabled = reminderSettings.isEnabled;
            this.message = reminderSettings.message;
            this.inactivityDaysToSend = reminderSettings.inactivityDaysToSend;
        }
    }
}
