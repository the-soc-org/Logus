import nock from "nock";
// Requiring our app implementation
import myProbotApp from "../src";
import { Probot, ProbotOctokit } from "probot";

// Requiring our fixtures
import payloadPullRequestOpened from "./fixtures/payloads/pull_request.opened.json";
import payloadPRCommented from "./fixtures/payloads/pr_review.submitted.commented.json";
import payloadPRRequestChanges from "./fixtures/payloads/pr_review.submitted.changes_requested.json";
import payloadPRApproved from "./fixtures/payloads/pr_review.submitted.approved.json";

import responseProjectInOrg from "./fixtures/api_responses/graphql_queries/projectInOrg.json";
import responseProjectsInOrg from "./fixtures/api_responses/graphql_queries/projectsInOrg.json";
import responseProjectsInOrgIncorrect from "./fixtures/api_responses/graphql_queries/projectsInOrgIncorrect.json";
import responseUserTeamsInOrg from "./fixtures/api_responses/graphql_queries/userTeamsInOrg.json";

import responseAssignUserToPullRequest from "./fixtures/api_responses/graphql_mutations/assignUserToPullRequest.json";
import responseAddProjectItem from "./fixtures/api_responses/graphql_mutations/addProjectItem.json";
import responseAddProjectItemWithDate from "./fixtures/api_responses/graphql_mutations/addProjectItemWithDate.json";
import responseAddProjectItemWithValue from "./fixtures/api_responses/graphql_mutations/addProjectItemWithValue.json";
import responseUpdateItemField from "./fixtures/api_responses/graphql_mutations/updateItemField.json";

import fs from "fs";
import path from "path";
import pino from "pino";
import Stream from "stream";

let testOutput: unknown[] = [];
const fullOutput: unknown[] = [];

const streamLogsToOutput = new Stream.Writable({ objectMode: true });
streamLogsToOutput._write = (object, _, done) => {
  const json = JSON.parse(object);
  testOutput.push(json);
  fullOutput.push(json);
  done();
};

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8",
);

/**
 * Initializes the mock for ProjectFieldValueUpdater tests.
 * @param mock - The nock scope.
 * @param payload - The payload containing repository and organization information.
 * @param configRelPath - The relative path to the configuration file.
 * @returns The initialized nock scope.
 */
function TestProjectFieldValueUpdaterInitialize(
  mock: nock.Scope,
  payload: { repository: { name: string }; organization: { login: string } },
  configRelPath = "fixtures/configs/czujnikownia.yml",
): nock.Scope {
  mock = mock
    .get(
      `/repos/${payload.organization.login}/.github-private/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
    )
    .reply(200, fs.readFileSync(path.join(__dirname, configRelPath), "utf-8"))

    .post("/graphql", (body) => {
      expect(body.variables.organizationLogin).toEqual(
        payload.organization.login,
      );
      expect(body.variables.repoQuery).toEqual(payload.repository.name);
      expect(body.variables.teamQuery).toEqual("");
      return true;
    })
    .reply(200, responseUserTeamsInOrg)

    .post("/graphql", (body) => {
      expect(body.variables.organizationLogin).toEqual(
        payload.organization.login,
      );
      expect(body.variables.projectQuery).toEqual("is:open monitor-Project 1");
      return true;
    })
    .reply(200, responseProjectsInOrg);

  return mock;
}

describe("Czujnikownia nock app tests", () => {
  let probot: any;

  beforeEach(() => {
    testOutput = [];
    nock.disableNetConnect();
    probot = new Probot({
      appId: 123,
      privateKey,
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
      log: pino(streamLogsToOutput),
    });
    nock("https://api.github.com")
      .get(new RegExp("app/installations.*"))
      .reply(200)
      .post(new RegExp("app/installations.*"))
      .reply(200);
    // Load our app into probot
    probot.load(myProbotApp);
  });

  test("1. Testing loading application's organization-level configuration from .github-private folder", async () => {
    const mock = nock("https://api.github.com")
      .get(
        `/repos/${payloadPRApproved.organization.login}/.github-private/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
      )
      .reply(
        200,
        fs.readFileSync(
          path.join(__dirname, "fixtures/configs/only-config-loading.yml"),
          "utf-8",
        ),
      )

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPRApproved.organization.login,
        );
        expect(body.variables.repoQuery).toEqual(
          payloadPRApproved.repository.name,
        );
        expect(body.variables.teamQuery).toEqual("");
        return true;
      })
      .reply(200, responseUserTeamsInOrg)

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPRApproved.organization.login,
        );
        expect(body.variables.projectQuery).toEqual("is:open prefix-Project 1");
        return true;
      })
      .reply(200, responseProjectInOrg);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("2. Testing loading application's organization-level configuration from .github folder", async () => {
    const mock = nock("https://api.github.com")
      .get(
        `/repos/${payloadPRApproved.organization.login}/.github-private/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
      )
      .reply(404)

      .get(
        `/repos/${payloadPRApproved.organization.login}/.github/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
      )
      .reply(
        200,
        fs.readFileSync(
          path.join(__dirname, "fixtures/configs/only-config-loading.yml"),
          "utf-8",
        ),
      )

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPRApproved.organization.login,
        );
        expect(body.variables.repoQuery).toEqual(
          payloadPRApproved.repository.name,
        );
        expect(body.variables.teamQuery).toEqual("");
        return true;
      })
      .reply(200, responseUserTeamsInOrg)

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPRApproved.organization.login,
        );
        expect(body.variables.projectQuery).toEqual("is:open prefix-Project 1");
        return true;
      })
      .reply(200, responseProjectInOrg);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("3. Testing loading application's default configuration", async () => {
    const mock = nock("https://api.github.com")
      .get(
        `/repos/${payloadPRApproved.organization.login}/.github-private/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
      )
      .reply(404)

      .get(
        `/repos/${payloadPRApproved.organization.login}/.github/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
      )
      .reply(404)

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPRApproved.organization.login,
        );
        expect(body.variables.repoQuery).toEqual(
          payloadPRApproved.repository.name,
        );
        expect(body.variables.teamQuery).toEqual("");
        return true;
      })
      .reply(200, responseUserTeamsInOrg)

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPRApproved.organization.login,
        );
        expect(body.variables.projectQuery).toEqual(
          "is:open monitor-Project 1",
        );
        return true;
      })
      .reply(200, responseProjectsInOrg);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("4. Testing adding assignee and updating 'openPullRequestDateProjectFieldName' on event 'pull request opened'", async () => {
    const mock = nock("https://api.github.com")
      .post(new RegExp("app/installations.*"))
      .reply(200)

      .get(
        `/repos/${payloadPullRequestOpened.organization.login}/.github-private/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
      )
      .times(2)
      .reply(
        200,
        fs.readFileSync(
          path.join(__dirname, "fixtures/configs/czujnikownia.yml"),
          "utf-8",
        ),
      )

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPullRequestOpened.organization.login,
        );
        expect(body.variables.repoQuery).toEqual(
          payloadPullRequestOpened.repository.name,
        );
        expect(body.variables.teamQuery).toEqual("");
        return true;
      })
      .times(2)
      .reply(200, responseUserTeamsInOrg)

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPullRequestOpened.organization.login,
        );
        expect(body.variables.projectQuery).toEqual(
          "is:open monitor-Project 1",
        );
        return true;
      })
      .reply(200, responseProjectsInOrg)

      .post("/graphql", (body) => {
        expect(body.variables.pullRequestId).toEqual(
          payloadPullRequestOpened.pull_request.node_id,
        );
        expect(body.variables.assignee).toEqual(
          payloadPullRequestOpened.sender.node_id,
        );
        return true;
      })
      .reply(200, responseAssignUserToPullRequest)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Open Date");
        return true;
      })
      .reply(200, responseAddProjectItem)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2VmM");
        expect(body.variables.date).toEqual("2024-11-24T22:01:22Z");
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request.opened",
      payload: payloadPullRequestOpened,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("5. Testing that assignee is not added on event 'pull request opened' as configured", async () => {
    const mock = nock("https://api.github.com")
      .post(new RegExp("app/installations.*"))
      .reply(200)

      .get(
        `/repos/${payloadPullRequestOpened.organization.login}/.github-private/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
      )
      .times(2)
      .reply(
        200,
        fs.readFileSync(
          path.join(__dirname, "fixtures/configs/without-adding-assignee.yml"),
          "utf-8",
        ),
      )

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPullRequestOpened.organization.login,
        );
        expect(body.variables.repoQuery).toEqual(
          payloadPullRequestOpened.repository.name,
        );
        expect(body.variables.teamQuery).toEqual("");
        return true;
      })
      .reply(200, responseUserTeamsInOrg)

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPullRequestOpened.organization.login,
        );
        expect(body.variables.projectQuery).toEqual(
          "is:open monitor-Project 1",
        );
        return true;
      })
      .reply(200, responseProjectsInOrg)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Open Date");
        return true;
      })
      .reply(200, responseAddProjectItem)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2VmM");
        expect(body.variables.date).toEqual("2024-11-24T22:01:22Z");
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request.opened",
      payload: payloadPullRequestOpened,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("6. Testing adding date 'lastReviewSubmitDateProjectFieldName' on event 'pull request review submitted'", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRRequestChanges,
      "fixtures/configs/only-last-review.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Last Review Date");
        return true;
      })
      .reply(200, responseAddProjectItem)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2WEo");
        expect(body.variables.date).toEqual("2024-11-27T17:38:30Z");
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRRequestChanges,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("7. Testing updating date 'lastReviewSubmitDateProjectFieldName' on event 'pull request review submitted'", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRApproved,
      "fixtures/configs/only-last-review.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Last Review Date");
        return true;
      })
      .reply(200, responseAddProjectItemWithDate)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2WEo");
        expect(body.variables.date).toEqual("2024-11-27T19:03:19Z");
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("8. Testing adding number 'reviewIterationNumberProjectFieldName' on event 'pull request review submitted'", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRRequestChanges,
      "fixtures/configs/only-field-increment.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Review Iteration");
        return true;
      })
      .reply(200, responseAddProjectItem)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2VyY");
        expect(body.variables.number).toEqual(1);
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRRequestChanges,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("9. Testing updating number 'reviewIterationNumberProjectFieldName' on event 'pull request review submitted'", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRApproved,
      "fixtures/configs/only-field-increment.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Review Iteration");
        return true;
      })
      .reply(200, responseAddProjectItemWithValue)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2VyY");
        expect(body.variables.number).toEqual(2);
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("10. Testing adding date 'lastApprovedReviewSubmitDateProjectFieldName' on event 'pull request review submitted'", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRApproved,
      "fixtures/configs/only-last-approved-review.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Last Approve Review Date");
        return true;
      })
      .reply(200, responseAddProjectItem)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2WIE");
        expect(body.variables.date).toEqual("2024-11-27T19:03:19Z");
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("11. Testing updating date 'lastApprovedReviewSubmitDateProjectFieldName' on event 'pull request review submitted'", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRApproved,
      "fixtures/configs/only-last-approved-review.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Last Approve Review Date");
        return true;
      })
      .reply(200, responseAddProjectItemWithDate)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2WIE");
        expect(body.variables.date).toEqual("2024-11-27T19:03:19Z");
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("12. Testing that 'lastApprovedReviewSubmitDateProjectFieldName' is not updated if pull request review is not approved", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRRequestChanges,
      "fixtures/configs/only-last-approved-review.yml",
    );

    // Nothing here, because nothing should be updated in the 'lastApprovedReviewSubmitDateProjectFieldName' field  when the pull request is not approved.

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRRequestChanges,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("13. Testing adding date 'firstReviewSubmitDateProjectFieldName' on event 'pull request review submitted'", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRRequestChanges,
      "fixtures/configs/only-first-review.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("First Review Date");
        return true;
      })
      .reply(200, responseAddProjectItem)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2VuM");
        expect(body.variables.date).toEqual("2024-11-27T17:38:30Z");
        return true;
      })
      .reply(200, responseUpdateItemField);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRRequestChanges,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("14. Testing that 'firstReviewSubmitDateProjectFieldName' is not updated if it has already been set", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRApproved,
      "fixtures/configs/only-first-review.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("First Review Date");
        return true;
      })
      .reply(200, responseAddProjectItemWithDate);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("15. Testing adding and updating multiple fields on event 'pull request review submitted'", async () => {
    const mock = TestProjectFieldValueUpdaterInitialize(
      nock("https://api.github.com"),
      payloadPRApproved,
      "fixtures/configs/czujnikownia.yml",
    )
      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Last Review Date");
        return true;
      })
      .reply(200, responseAddProjectItemWithDate)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2WEo");
        expect(body.variables.date).toEqual("2024-11-27T19:03:19Z");
        return true;
      })
      .reply(200, responseUpdateItemField)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Last Approve Review Date");
        return true;
      })
      .reply(200, responseAddProjectItem)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2WIE");
        expect(body.variables.date).toEqual("2024-11-27T19:03:19Z");
        return true;
      })
      .reply(200, responseUpdateItemField)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("Review Iteration");
        return true;
      })
      .reply(200, responseAddProjectItemWithValue)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.itemId).toEqual("PVTI_lADOCzSoN84AtAzgzgVMgOQ");
        expect(body.variables.fieldId).toEqual("PVTF_lADOCzSoN84AtAzgzgj2VyY");
        expect(body.variables.number).toEqual(2);
        return true;
      })
      .reply(200, responseUpdateItemField)

      .post("/graphql", (body) => {
        expect(body.variables.projectId).toEqual("PVT_kwDOCzSoN84AtAzg");
        expect(body.variables.contentId).toEqual("PR_kwDONUNffM6C84g3");
        expect(body.variables.fieldName).toEqual("First Review Date");
        return true;
      })
      .reply(200, responseAddProjectItemWithDate);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRApproved,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("16. Testing that no action is taken when field name in project is incorrect", async () => {
    const mock = nock("https://api.github.com")
      .get(
        `/repos/${payloadPRCommented.organization.login}/.github-private/contents/${encodeURIComponent(".github/czujnikownia.yml")}`,
      )
      .reply(
        200,
        fs.readFileSync(
          path.join(__dirname, "fixtures/configs/only-last-review.yml"),
          "utf-8",
        ),
      )

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPRCommented.organization.login,
        );
        expect(body.variables.repoQuery).toEqual(
          payloadPRCommented.repository.name,
        );
        expect(body.variables.teamQuery).toEqual("");
        return true;
      })
      .reply(200, responseUserTeamsInOrg)

      .post("/graphql", (body) => {
        expect(body.variables.organizationLogin).toEqual(
          payloadPRCommented.organization.login,
        );
        expect(body.variables.projectQuery).toEqual(
          "is:open monitor-Zajęcia 2025",
        );
        return true;
      })
      .reply(200, responseProjectsInOrgIncorrect);

    await probot.receive({
      name: "pull_request_review.submitted",
      payload: payloadPRCommented,
    });
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
