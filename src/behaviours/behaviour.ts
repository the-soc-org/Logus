import type { Probot } from "probot";

export interface Behaviour {
    register(agent: Probot) : void;
}