import type { Probot } from "probot";

/**
 * Interface representing a behaviour that can be registered with a Probot instance.
 */
export interface Behaviour {
    /**
     * Registers the behaviour with the given Probot instance.
     * @param agent The Probot instance to register the behaviour with.
     */
    register(agent: Probot) : void;
}