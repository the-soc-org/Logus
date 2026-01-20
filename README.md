# Czujnikownia

[![Build and Test](https://github.com/IS-UMK/Czujnikownia/actions/workflows/ci-push.yml/badge.svg?branch=master)](https://github.com/IS-UMK/Czujnikownia/actions/workflows/ci-push.yml)
[![Documentation](https://img.shields.io/badge/docs-online-blue.svg)](https://is-umk.github.io/Czujnikownia/)
[![Semantic Release](https://img.shields.io/badge/semantic--release-enabled-brightgreen.svg?logo=semantic-release)](https://github.com/IS-UMK/Czujnikownia/actions/workflows/release.yml)

A GitHub application based on the [Probot](https://github.com/probot/probot) library for automating the collection of information in projects related to pull request events. Designed for installation within an organization.

## Usage

### Creating and Running a new instance

- install the [Node](https://nodejs.org/download/release/v20.19.2/) environment
- run the following commands inside the source code directory:
  - `npm install` - [install all necessary packages](https://docs.npmjs.com/cli/v8/commands/npm-install#description)
  - `npm run build` - transpile TypeScript code to JavaScript
  - `npm start` - start the server handling the GitHub application
- [register the GitHub application](https://probot.github.io/docs/development/#configuring-a-github-app)
- install within the organization
- restart using the command `npm start`

### Using a running instance

- Install the [GitHub application](https://github.com/apps/czujnikownia) within the organization
- [Configure](#Configuration) the settings

## Configuration

The application's organization-level configuration can be done by adding a `.github/czujnikownia.yml` file to the `.github-private` or `.github` repository within the organization.

Storing the configuration file in the `.github-private` repository requires granting the application access to this repository in the organization's settings – https://github.com/organizations/YOUR-ORGANIZATION/settings/installations

Sample configuration `czujnikownia.yml`:

```yml
projectTitlePrefix: "monitor-"
openPullRequestDateProjectFieldName: "Open Date"
firstReviewSubmitDateProjectFieldName: "First Review Date"
lastReviewSubmitDateProjectFieldName: "Last Review Date"
lastApprovedReviewSubmitDateProjectFieldName: "Last Approve Review Date"
reviewIterationNumberProjectFieldName: "Review Iteration"
addPullRequestAuthorAsAssignee: false
```

- `projectTitlePrefix` - the prefix of the project title where the information will be entered.
- `openPullRequestDateProjectFieldName` - the name of the field column where the creation date of a _pull request_ by a user who is a member of a team with a name containing the keyword will be entered. The repository in which the request was created must be linked to the team. Optional parameter.
- `lastReviewSubmitDateProjectFieldName` - the name of the field column where the date of the last _pull request_ review submission will be entered. Optional parameter.
- `firstReviewSubmitDateProjectFieldName` - the name of the field column where the date of the first _pull request_ review submission will be entered. Optional parameter.
- `lastApprovedReviewSubmitDateProjectFieldName` - the name of the field column where the date of the last positive _pull request_ review submission will be entered. Optional parameter.
- `reviewIterationNumberProjectFieldName` - the name of the field column where the number of currently completed pull _request reviews_ will be entered. Optional parameter.
- `addPullRequestAuthorAsAssignee` - a parameter that determines whether the author of the pull request should be automatically assigned as an _Assignee_. Default is `false`.

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our development process and how to propose changes.
