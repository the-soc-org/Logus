import { Probot } from "probot";
import Behaviour from "./behaviour";

export default class LogDebugOnAny implements Behaviour {
    register(agent: Probot): void {
        agent.onAny(async (context) => {
            agent.log.debug({ id: context.id, event: context.name });
        });
    }
}