import nock from "nock";
// Requiring our app implementation
import myProbotApp from "../src";
import { Probot, ProbotOctokit } from "probot";

// Requiring our fixtures
import payloadTeamCreated from "./fixtures/payloads/team.created.json";
import payloadTeamDeleted from "./fixtures/payloads/team.deleted.json";
import payloadPullRequestOpened from "./fixtures/payloads/pull_request.opened.json"
import payloadPRRequestChanges from "./fixtures/payloads/pr_review.submitted.changes_requested.json"
import payloadPRApproved from "./fixtures/payloads/pr_review.submitted.approved.json"

import responseProjectsInOrg from "./fixtures/api_responses/graphql_queries/projectsInOrg.json"
import responseProjectId from "./fixtures/api_responses/graphql_queries/projectId.json";
import responseUserTeamsInOrg from "./fixtures/api_responses/graphql_queries/userTeamsInOrg.json"

import responseProjectDelete from "./fixtures/api_responses/graphql_mutations/closeProject.json"
import responseAddItemToProj from "./fixtures/api_responses/graphql_mutations/addItemToProj.json"
import responseUpdateDateField from "./fixtures/api_responses/graphql_mutations/updateItemDateField.json"

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

function TestProjectFieldValueUpdaterInitialize(mock: nock.Scope, 
  payload: {sender: {login: string}, organization: {login: string}}, 
  configRelPath = "fixtures/configs/sensor-room.yml",
  keywordSettingsNumber: number = 2): nock.Scope 
{
  mock = mock
    .post("/graphql", (body) => {
      expect(body.variables.userLogin).toEqual(payload.sender.login)
      expect(body.variables.organizationLogin).toEqual(payload.organization.login)
      return true;
    })
    .reply(200, responseUserTeamsInOrg)

    .post("/graphql", (body) => {
      expect(body.variables.organizationLogin).toEqual(payload.organization.login)
      return true;
    })
    .reply(200, responseProjectsInOrg)

    .get(`/repos/${payload.organization.login}/.github-private/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
    .reply(200, fs.readFileSync(path.join(__dirname, configRelPath), "utf-8"));

    for(let i = 0; i < keywordSettingsNumber-1; i++) {
      mock = mock.post("/graphql").reply(200, {data: {user: {organization: {teams: {edges: []}}}}});
    }
      

  return mock;
}


describe("Czujnikownia nock app tests", () => {
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

    test("creating project with settings from .github-private", async () => {
      const mock = nock("https://api.github.com")
        .get(`/repos/${payloadTeamCreated.organization.login}/.github-private/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
        .reply(200, fs.readFileSync(path.join(__dirname, "fixtures/configs/sensor-room.yml"), "utf-8"))
        .post("/graphql", (body) => {
          expect(body.variables.organizationLogin).toEqual(payloadTeamCreated.organization.login);
          expect(body.variables.projectNumber).toEqual(6);
          return true;
        })
        .reply(200, responseProjectId)
        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual(responseProjectId.data.organization.projectV2.id);
          expect(body.variables.ownerId).toEqual(payloadTeamCreated.organization.node_id);
          expect(body.variables.title).toEqual("monitor-test-team-2023");
          return true;
        })
        .reply(200);

      await probot.receive({ name: "team.created", payload: payloadTeamCreated });
    
      expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("creating project with settings from .github-private, but template project doesn't exists", async () => {
      const mock = nock("https://api.github.com")
        .get(`/repos/${payloadTeamCreated.organization.login}/.github-private/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
        .reply(200, fs.readFileSync(path.join(__dirname, "fixtures/configs/sensor-room.yml"), "utf-8"))
        .post("/graphql", (body) => {
          expect(body.variables.organizationLogin).toEqual(payloadTeamCreated.organization.login);
          expect(body.variables.projectNumber).toEqual(6);
          return true;
        })
        .reply(404);
        
      await probot.receive({ name: "team.created", payload: payloadTeamCreated });
    
      expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("creating projects with default settings", async () => {
      const mock = nock("https://api.github.com")
        .get(`/repos/${payloadTeamCreated.organization.login}/.github-private/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
        .reply(404)
        .get(`/repos/${payloadTeamCreated.organization.login}/.github/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
        .reply(404)
        .post("/graphql", (body) => {
          expect(body.variables.ownerId).toEqual(payloadTeamCreated.organization.node_id)
          expect(body.variables.title).toEqual("Sensor-test-team-2023")
          return true;
        })
        .reply(200)

      await probot.receive({ name: "team.created", payload: payloadTeamCreated });
      
      expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("closing project on team delete", async () => {
      const mock = nock("https://api.github.com")
        .get(`/repos/${payloadTeamDeleted.organization.login}/.github-private/contents/${encodeURIComponent(".github/sensor-room.yml")}`)
        .reply(200, fs.readFileSync(path.join(__dirname, "fixtures/configs/sensor-room.yml"), "utf-8"))
        
        .post("/graphql", (body) => {
          expect(body.variables.organizationLogin).toEqual(payloadTeamDeleted.organization.login)
          return true;
        })
        .reply(200, responseProjectsInOrg)
        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APTCq")
          return true;
        })
        .reply(200, responseProjectDelete)

        await probot.receive({ name: "team.deleted", payload: payloadTeamDeleted });
        expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("incrementing 'review iteration' project field value", async () => {
      const mock = TestProjectFieldValueUpdaterInitialize(
        nock("https://api.github.com"), payloadPRRequestChanges, "fixtures/configs/only-field-increment.yml", 1)

        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APwEY")
          expect(body.variables.contentId).toEqual("PR_kwDOJWgzKM5SsFz2")
          return true;
        })
        .reply(200, responseAddItemToProj)

        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APwEY")
          expect(body.variables.itemId).toEqual("PVTI_lADOB8o1Ys4APwEYzgG_Ll0")
          expect(body.variables.number).toEqual(1)
          expect(body.variables.fieldId).toEqual("PVTF_lADOB8o1Ys4APwEYzgLGEPg")
          return true;
        })
        .reply(200, responseUpdateDateField)

      await probot.receive({ name: "pull_request_review.submitted", payload: payloadPRRequestChanges });
      expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("saving open pull request date in project", async () => {
      const mock = TestProjectFieldValueUpdaterInitialize(
        nock("https://api.github.com"), payloadPullRequestOpened)

        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APwEY")
          expect(body.variables.contentId).toEqual("PR_kwDOJWgzKM5RgLBD")
          return true;
        })
        .reply(200, responseAddItemToProj)

        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APwEY")
          expect(body.variables.itemId).toEqual("PVTI_lADOB8o1Ys4APwEYzgG_Ll0")
          expect(body.variables.date).toEqual("2023-05-27T15:49:07Z")
          expect(body.variables.fieldId).toEqual("PVTF_lADOB8o1Ys4APwEYzgKDkus")
          return true;
        })
        .reply(200, responseUpdateDateField)

      await probot.receive({ name: "pull_request.opened", payload: payloadPullRequestOpened });
      expect(mock.pendingMocks()).toStrictEqual([]);
    });

    test("updating 'review date' and 'approved review date' project fields", async () => {
      const mock = TestProjectFieldValueUpdaterInitialize(
        nock("https://api.github.com"), payloadPRApproved, "fixtures/configs/without-field-increment.yml", 1)

        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APwEY")
          expect(body.variables.contentId).toEqual("PR_kwDOJWgzKM5Rgfxk")
          return true;
        })
        .reply(200, responseAddItemToProj)
        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APwEY")
          expect(body.variables.itemId).toEqual("PVTI_lADOB8o1Ys4APwEYzgG_Ll0")
          expect(body.variables.date).toEqual("2023-06-10T22:16:47Z")
          expect(body.variables.fieldId).toEqual("PVTF_lADOB8o1Ys4APwEYzgKDkuw")
          return true;
        })
        .reply(200, responseUpdateDateField)

        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APwEY")
          expect(body.variables.contentId).toEqual("PR_kwDOJWgzKM5Rgfxk")
          return true;
        })
        .reply(200, responseAddItemToProj)
        .post("/graphql", (body) => {
          expect(body.variables.projectId).toEqual("PVT_kwDOB8o1Ys4APwEY")
          expect(body.variables.itemId).toEqual("PVTI_lADOB8o1Ys4APwEYzgG_Ll0")
          expect(body.variables.date).toEqual("2023-06-10T22:16:47Z")
          expect(body.variables.fieldId).toEqual("PVTF_lADOB8o1Ys4APwEYzgLoLxD")
          return true;
        })
        .reply(200, responseUpdateDateField)
        
      await probot.receive({ name: "pull_request_review.submitted", payload: payloadPRApproved });
      expect(mock.pendingMocks()).toStrictEqual([]);
    });

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
