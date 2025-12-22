import type { Probot } from "probot";
import type { Behaviour } from "./behaviour";

/**
 * Class that logs debug information for any event received by the Probot instance.
 */
export default class LogDebugOnAny implements Behaviour {
    /**
     * Registers the behaviour with the given Probot instance.
     * @param agent The Probot instance to register the behaviour with.
     */
    register(agent: Probot): void {
        agent.onAny(async (context) => {
            agent.log.debug({ id: context.id, event: context.name });
        });
    }
}