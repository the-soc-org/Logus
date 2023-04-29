//import { loadFirstKeywordSettings, KeywordSettings } from "../src/settings";

import nock from "nock";
// Requiring our app implementation
import myProbotApp from "../src";
import { Probot, ProbotOctokit } from "probot";
// Requiring our fixtures
import teamCreatedPayload from "./fixtures/team.created.json";

import fs from "fs";
import path from "path";
import pino from "pino";
import Stream from "stream";

let testOutput: any[] = []
const fullOutput: any[] = []

const streamLogsToOutput = new Stream.Writable({ objectMode: true });
streamLogsToOutput._write = (object, _, done) => {
  const json = JSON.parse(object);
  testOutput.push(json);
  fullOutput.push(json);
  done();
};

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8"
);

describe("Czujnikownia app tests", () => {
  let probot: any;

  beforeEach(() => {
    testOutput = []
    nock.disableNetConnect();
    probot = new Probot({
      appId: 123,
      privateKey,
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
      log: pino(streamLogsToOutput)
    });
    // Load our app into probot
    probot.load(myProbotApp);
  });

    test("test creating projects with settings from .github-private", async () => {
      const mock = nock("https://api.github.com")
        .get(`/repos/${teamCreatedPayload.organization.login}/.github-private/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
        .reply(200, fs.readFileSync(path.join(__dirname, "fixtures/sensor-room.yml"), "utf-8"))
        .post("/graphql", (body) => {
          expect(body.variables.ownerId).toEqual(teamCreatedPayload.organization.node_id)
          expect(body.variables.title).toEqual("monitor-test-team-2023")
          return true;
        })
        .reply(200)

      await probot.receive({ name: "team.created", payload: teamCreatedPayload });
      
      expect(testOutput).toContainEqual(expect.objectContaining({msg: `Team ${teamCreatedPayload.team.name} has been created.`}));
      expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("test creating projects with default settings", async () => {
      const mock = nock("https://api.github.com")
        .get(`/repos/${teamCreatedPayload.organization.login}/.github-private/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
        .reply(404)
        .get(`/repos/${teamCreatedPayload.organization.login}/.github/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
        .reply(404)
        .post("/graphql", (body) => {
          expect(body.variables.ownerId).toEqual(teamCreatedPayload.organization.node_id)
          expect(body.variables.title).toEqual("sensor-test-team-2023")
          return true;
        })
        .reply(200)

      await probot.receive({ name: "team.created", payload: teamCreatedPayload });
      
      expect(testOutput).toContainEqual(expect.objectContaining({msg: "Team test-team-2023 has been created."}));
      expect(mock.pendingMocks()).toStrictEqual([]);
    })

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock
