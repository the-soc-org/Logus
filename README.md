# Logus

[![Build and Test](https://github.com/IS-UMK/Logus/actions/workflows/ci-push.yml/badge.svg?branch=master)](https://github.com/IS-UMK/Logus/actions/workflows/ci-push.yml)

## The Log of Us
*A structured record of collaborative pull request activity*

Logus records pull request activity as dedicated **Project items** in **GitHub Projects**, creating
a structured log of collaborative activity.

By combining standard pull request metadata with additional, non-standard **Project fields** that
store review timestamps and iteration counts, each pull request becomes a persistent, queryable
Project item that captures its collaboration history within a GitHub Project.

### How It Works

- Each pull request is added to a selected GitHub Project as a Project item.
- GitHub automatically makes standard pull request metadata available as Project fields.
- Logus updates additional, non-standard Project fields that capture review dynamics.
- A single Project item is updated incrementally as collaboration unfolds.

All data is stored directly in GitHub Projects and can be explored using native views, filters,
and downloaded in JSON format.

### Quick Start

- Install the [GitHub App](https://github.com/apps/logus) within the organization
- Configure the application settings (see [Configuration](#configuration))
- Copy a ready-to-use Project template from:  
  https://github.com/orgs/IS-UMK/projects/45

---

## What Logus Records

For each pull request added to a Project, Logus creates or updates a single Project item
that reflects the pull request’s progress through review.

Each Project item may include both **standard pull request metadata** (automatically provided by
GitHub) and **Logus-managed fields** for review-specific data:

- **Standard fields:** Title, Assignees, Reviewers, Repository, Status, Labels, Projects, Milestone  
- **Logus fields:** Posted Date, First Review Date, Last Review Date, Last Approved Review Date, Review Iteration  

Logus does not modify standard metadata. It is responsible for:

- Adding pull requests to selected GitHub Projects, which automatically sets the standard **Projects** field
- Updating configurable, non-standard fields that capture review dynamics  
- Optionally assigning the pull request author as an **Assignee** to indicate authorship

Projects prepared for use with Logus must define the non-standard Project fields managed by the
application.

## Project Template

Logus assumes that target GitHub Projects follow a predefined **structural template**.

In particular:
- The Project must contain fields whose names match those configured in `logus.yml` (e.g. First
  Review Date, Review Iteration).
- Field types must be compatible with the stored values
  (e.g. *Date* fields for dates, *Number* fields for review iterations).
- Each pull request is represented by a single Project item, which is incrementally updated as new
  events occur.

A consistent Project template ensures reliable data synchronization.

## Installation and Running

- Install the [Node](https://nodejs.org/download/release/v20.19.2/) environment
- Run the following commands inside the source code directory:
  - `npm install` – install all required dependencies
  - `npm run build` – transpile TypeScript code to JavaScript
  - `npm start` – start the server handling the GitHub App
- [Register the GitHub App](https://probot.github.io/docs/development/#configuring-a-github-app)
- Install the application within the target organization
- Restart the service using `npm start`

## Status and Workflows

Logus does not enforce a specific review process.

Instead, it works together with **GitHub Projects workflows** to manage the **Status** field of each
Project item. These workflows automatically update the Status in response to pull request events.

Typical workflow actions include:
- Setting an initial **Status** when a pull request is opened
- Updating **Status** when the first review is submitted
- Moving the item to an approved or completed **Status** after an approving review

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

## Configuration Parameters

Logus operates only on GitHub Projects explicitly selected by configuration.
Project selection is based on matching Project titles against a configured prefix.

### `projectTitlePrefix`

Prefix of GitHub Project titles that Logus should target.

Only Projects whose titles start with this prefix will be scanned and updated.

---

### `openPullRequestDateProjectFieldName`

Name of the Project field where the pull request posted date will be stored.

Optional parameter.

---

### `firstReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the first submitted pull request review will be stored.

Optional parameter.

---

### `lastReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the most recent pull request review submission will be stored.

Optional parameter.

---

### `lastApprovedReviewSubmitDateProjectFieldName`

Name of the Project field where the date of the most recent **approved** pull request review will be stored.

Optional parameter.

---

### `reviewIterationNumberProjectFieldName`

Name of the Project field where the number of completed pull request review iterations will be stored.

Optional parameter.

---

### `addPullRequestAuthorAsAssignee`

Determines whether the pull request author should be automatically added as an Assignee to the
corresponding Project item.

Default value: `false`.

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our development process and how to propose changes.
