# Logus

[![Build and Test](https://github.com/IS-UMK/Logus/actions/workflows/ci-push.yml/badge.svg?branch=master)](https://github.com/IS-UMK/Logus/actions/workflows/ci-push.yml)

## The Log of Us
*A structured record of collaborative pull request activity*

Logus records pull request activity as dedicated **Project items** in **GitHub Projects**, creating
a structured log of collaborative activity.

By combining standard **Project fields** (Title, Assignees, Reviewers, Repository, Status, Labels)
with configurable, non-standard **Project fields managed by Logus** that store pull request opening
timestamp (Posted Date), review timestamps (First Review Date, Last Review Date, Last Approved
Review Date) and iteration counts (Review Iteration), each pull request becomes a persistent,
queryable Project item that captures its collaboration history within a GitHub Project.

![](./img/monitor_example.png)

### How It Works

1. **Pull request is opened**  
   When an author creates a pull request in the source repository, GitHub triggers its native
   mechanisms. If automatic reviewer assignment is enabled (see [Reviewers
   Field](#reviewers-field)), reviewers are assigned at this stage. Reviewers can also be assigned
   manually at any time.

2. **Author assignment (Logus)**  
   If `addPullRequestAuthorAsAssignee: true` is set in `logus.yml`, Logus assigns the pull request
   author as an **Assignee**. The Assignee field may still be modified manually later.

3. **Project linking (Logus)**  
   Logus sets the pull request’s **Projects** field to the configured GitHub Project. As a result,
   GitHub adds the pull request to that Project as a **Project item**.

4. **Standard field synchronization (GitHub)**  
   Once the pull request appears in the Project, GitHub automatically fills the existing standard
   Project fields with the corresponding values, including: **Title, Assignees, Reviewers,
   Repository, Labels**, and **Status**.

5. **Status management via workflows (GitHub)**  
   If GitHub Projects workflows are configured (see [Status Field](#status-field)), they
   automatically update the **Status** field in response to pull request events (e.g. `Todo` when
   opened, `In Progress` after the first review, `Reviewed` after approval). The Status field can
   also be set manually.

6. **Review dynamics tracking (Logus)**  
   As collaboration continues, Logus incrementally updates configurable, non-standard Project fields such as:  
   - Posted Date  
   - First Review Date  
   - Last Review Date  
   - Last Approved Review Date  
   - Review Iteration  

Over time, a single Project item becomes a structured, queryable record of the pull request’s
collaboration process.

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
- Copy the ready-to-use [Project Template](https://github.com/orgs/IS-UMK/projects/45) with
  preconfigured workflows

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

The application works with default configuration values out of the box. Custom organization-level
configuration can be provided by adding a `.github/logus.yml` file to the organization's
`.github-private` or `.github` repository. Make sure that the GitHub App has access to this
repository in the organization's settings.

**When no configuration file is present**, Logus uses the default values.

**When a custom configuration file exists**, values defined in the file override the corresponding
defaults, while any fields not specified in the custom configuration retain their default values.

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

### Disabling Features

To disable tracking for a specific Project field, set its corresponding configuration parameter to
one of the following values in your `logus.yml` file:

```yaml
# Option 1: null keyword
reviewIterationNumberProjectFieldName: null

# Option 2: tilde (~)
reviewIterationNumberProjectFieldName: ~

# Option 3: empty value
reviewIterationNumberProjectFieldName:
```

When a field is disabled, Logus will not create or update that field in Project items.

### Configuration Parameters

Logus operates only on GitHub Projects explicitly selected by configuration.
Project selection is based on matching Project titles against a configured prefix.

#### `projectTitlePrefix`

Prefix of GitHub Project titles that Logus should target.

Only Projects whose titles start with this prefix will be scanned and updated.

**Default value:** `"monitor-"`

---

#### `openPullRequestDateProjectFieldName`

Name of the Project field where the pull request posted date will be stored.

**Default value:** `"Posted Date"`

---

#### `firstReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the first submitted pull request review will be stored.

**Default value:** `"First Review Date"`

---

#### `lastReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the most recent pull request review submission will be stored.

**Default value:** `"Last Review Date"`

---

#### `lastApprovedReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the most recent approved pull request review will be stored.

**Default value:** `"Last Approved Review Date"`

---

#### `reviewIterationNumberProjectFieldName`

Name of the Project field where the number of completed pull request review iterations will be stored.

**Default value:** `"Review Iteration"`

---

#### `addPullRequestAuthorAsAssignee`

Determines whether the pull request author should be automatically added as an Assignee to the
corresponding Project item.

Use `true` or `false`.

**Default value:** `true`

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our development process and how to propose changes.
