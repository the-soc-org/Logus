import { Probot } from "probot";

export default interface Behaviour {
    register(agent: Probot) : void;
}