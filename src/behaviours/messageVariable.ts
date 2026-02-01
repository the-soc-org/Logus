/**
 * Class representing a message variable that can be replaced with a value from a given context.
 * @template ConextType The type of the context from which the value is selected.
 */
export default class MessageVariable<ConextType> {
  /**
   * The key to be replaced in the message. It can be a string or a regular expression.
   */
  readonly key: string | RegExp;

  /**
   * A function that selects the value from the given context.
   */
  private readonly valueSelector: (valueSource: ConextType) => string;

  /**
   * Creates an instance of MessageVariable.
   * @param key The key to be replaced in the message.
   * @param valueSelector A function that selects the value from the given context.
   */
  constructor(
    key: string | RegExp,
    valueSelector: (valueSource: ConextType) => string,
  ) {
    this.key = key;
    this.valueSelector = valueSelector;
  }

  /**
   * Replaces the key in the message with the value selected from the context.
   * @param message The message in which the key will be replaced.
   * @param context The context from which the value is selected.
   * @returns The message with the key replaced by the selected value.
   */
  public replaceInMessage(message: string, context: ConextType): string {
    return message.replace(this.key, this.valueSelector(context));
  }
}
