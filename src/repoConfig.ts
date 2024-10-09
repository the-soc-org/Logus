import { ScheduleContext } from "./czujnikowniaContexts";

export class RepoConfig {
    [key: string]: unknown;

    private static readonly configFileName: string = 'czujnikownia-repo.yml';

    readonly reviewReminder: ReminderConfig = new ReminderConfig;
    readonly replayToReviewReminder: ReminderConfig = new ReminderConfig;
    readonly sendRemindersOnlyIfRepoIsRelatableToTeamWithKeyword: boolean = true;

    readonly minUTCHourOfDayToSendReminder: number = 9;
    readonly maxUTCHourOfDayToSendReminder: number = 20;

    constructor(repoConfig: RepoConfig | undefined = undefined) {
        if(repoConfig) {
            this.reviewReminder = new ReminderConfig(repoConfig.reviewReminder);
            this.replayToReviewReminder = new ReminderConfig(repoConfig.replayToReviewReminder);
            this.minUTCHourOfDayToSendReminder = repoConfig.minUTCHourOfDayToSendReminder;
            this.maxUTCHourOfDayToSendReminder = repoConfig.maxUTCHourOfDayToSendReminder;
            this.sendRemindersOnlyIfRepoIsRelatableToTeamWithKeyword = repoConfig.sendRemindersOnlyIfRepoIsRelatableToTeamWithKeyword;
        }
    }

    public static async load(context: ScheduleContext) {
        const configHolder = await context.octokit.config.get<RepoConfig>({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            path: `.github/${this.configFileName}`,
            defaults: new RepoConfig
        });

        return new RepoConfig(configHolder.config);
    }
}
export class ReminderConfig {
    [key: string]: unknown;

    isEnabled: boolean = false;
    message: string = "Proszę skonfigurować treść przypomnienia w pliku .github/czujnikownia-repo.yml.";
    minimalInactivityHoursToSend: number = 5 * 24;

    constructor(reminderConfig: ReminderConfig | undefined = undefined) {
        if(reminderConfig)
            for(const key in reminderConfig)
                this[key] = reminderConfig[key];
    }
}