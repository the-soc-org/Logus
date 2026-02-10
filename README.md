# Logus

[![Build and Test](https://github.com/IS-UMK/Logus/actions/workflows/ci-push.yml/badge.svg?branch=master)](https://github.com/IS-UMK/Logus/actions/workflows/ci-push.yml)

## The Log of Us
*A structured record of collaborative pull request activity*

Logus records pull request activity as dedicated **Project items** in **GitHub Projects**, creating
a structured log of collaborative activity.

By combining standard **Project fields** (Title, Assignees, Reviewers, Repository, Status, Labels)
with configurable, non-standard **Project fields managed by Logus** that store open pull request
timestamp (Posted Date), review timestamps (First Review Date, Last Review Date, Last Approved
Review Date) and iteration counts (Review Iteration), each pull request becomes a persistent,
queryable Project item that captures its collaboration history within a GitHub Project.

![](./img/monitor_example.png)

### How It Works

- Logus sets the pull request’s **Projects** field, which causes GitHub to add the pull request to
  the selected Project as a Project item.
- GitHub automatically updates values in Project columns with standard fields.
- Logus updates values in Project columns with non-standard fields that capture review dynamics.
- A single Project item is updated incrementally as collaboration unfolds.
- Optionally, Logus assigns the pull request author as an **Assignee** to indicate authorship.

Logus assumes that target GitHub Projects follow a predefined **structural template**:
- The Project may contain standard and non-standard fields
- Non-standard fields must match those configured in `logus.yml` (e.g. First Review Date, Review
  Iteration).
- Field types must be compatible with the stored values
  (e.g. *Date* fields for dates, *Number* fields for review iterations).

All data is stored directly in GitHub Projects and can be explored using native views, filters,
and downloaded in JSON format.

### Quick Start

- Install the [GitHub App](https://github.com/apps/logus) within the organization
- Configure the application settings (see [Configuration](#configuration))
- Copy a ready-to-use [Project Template](https://github.com/orgs/IS-UMK/projects/45)

---

## Additional Options for Automatic Standard Field Updates

### Reviewers Field

The **Reviewers** column can be filled automatically using GitHub’s built-in reviewer assignment
mechanism. This requires additional configuration:

- Add a `CODEOWNERS` file to the repository (typically in the `.github/` or `.docs/` directory).
- Define code owners using the standard CODEOWNERS syntax, for example:
  `* @my-organization/my-team`
- Ensure that team knows the repository and has at least **Write** permissions.
- Enable automatic reviewer assignment in the team settings:
  **Settings → Code Review → Enable Auto Assignment**.

Automatic reviewer selection works for organizations using **Team** or **Enterprise**
licenses. These licenses are paid, but teachers can apply for an educational discount and obtain
them free of charge.

### Status Field

Logus does not enforce a specific review process. Instead, the **Status** field of each Project item
is managed by GitHub Projects workflows, which automatically update the Status in response to pull
request events.

Typical workflow actions include (see [Project Template Workflows](https://github.com/orgs/IS-UMK/projects/45/workflows)):
- Setting an initial **Status** when a pull request is opened (e.g. Todo)
- Updating **Status** when the first review is submitted (e.g. In Progress)
- Moving the item to an approved or completed **Status** after an approving review (e.g. Reviewed)

---

## Self-hosting

- Install the [Node](https://nodejs.org/download/release/v20.19.2/) environment
- Run the following commands inside the source code directory:
  - `npm install` – install all required dependencies
  - `npm run build` – transpile TypeScript code to JavaScript
  - `npm start` – start the server handling the GitHub App
- [Register the GitHub App](https://probot.github.io/docs/development/#configuring-a-github-app)
- Install the application within the target organization
- Restart the service using `npm start`

---

## Configuration

The application's organization-level configuration can be done by adding a `.github/logus.yml` file
to the organization's `.github-private` repository. Make sure that the GitHub App has access to this
repository in the organization's settings.

### Sample `logus.yml`

```yaml
projectTitlePrefix: "monitor-"
openPullRequestDateProjectFieldName: "Posted Date"
firstReviewSubmitDateProjectFieldName: "First Review Date"
lastReviewSubmitDateProjectFieldName: "Last Review Date"
lastApprovedReviewSubmitDateProjectFieldName: "Last Approved Review Date"
reviewIterationNumberProjectFieldName: "Review Iteration"
addPullRequestAuthorAsAssignee: true
```

### Configuration Parameters

Logus operates only on GitHub Projects explicitly selected by configuration.
Project selection is based on matching Project titles against a configured prefix.

#### `projectTitlePrefix`

Prefix of GitHub Project titles that Logus should target.

Only Projects whose titles start with this prefix will be scanned and updated.

---

#### `openPullRequestDateProjectFieldName`

Name of the Project field where the pull request posted date will be stored.

Optional parameter.

---

#### `firstReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the first submitted pull request review will be stored.

Optional parameter.

---

#### `lastReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the most recent pull request review submission will be stored.

Optional parameter.

---

#### `lastApprovedReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the most recent **approved** pull request review will be stored.

Optional parameter.

---

#### `reviewIterationNumberProjectFieldName`

Name of the Project field where the number of completed pull request review iterations will be stored.

Optional parameter.

---

#### `addPullRequestAuthorAsAssignee`

Determines whether the pull request author should be automatically added as an Assignee to the
corresponding Project item.

Default value: `false`.

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our development process and how to propose changes.
