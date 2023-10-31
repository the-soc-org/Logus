export default class MessageVariable<ConextType> {
    readonly key: string | RegExp;

    private readonly valueSelector: (valueSource: ConextType) => string;

    constructor(key: string | RegExp, valueSelector: (valueSource: ConextType) => string) {
        this.key = key;
        this.valueSelector = valueSelector;
    }

    public replaceInMessage(message: string, context: ConextType): string {
        return message.replace(this.key, this.valueSelector(context));
    }
}
