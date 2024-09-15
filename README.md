# Czujnikownia
[![en](https://img.shields.io/badge/lang-en-blue.svg)](https://github.com/IS-UMK/Czujnikownia/blob/master/README.md)
[![pl](https://img.shields.io/badge/lang-pl-red.svg)](https://github.com/IS-UMK/Czujnikownia/blob/master/README.pl.md)

A GitHub application based on the [Probot](https://github.com/probot/probot) library for automating the collection of information in projects related to pull request events. Designed for installation within an organization.

## Usage

### Creating and Running a new instance
- install the [Node](https://nodejs.org/download/release/v18.19.0/) environment
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
The application's organization-level configuration can be done by adding a `.github/czujnikownia-org.yml` file to the `.github-private` or `.github` repository within the organization.

Storing the configuration file in the `.github-private` repository requires granting the application access to this repository in the organization's settings – https://github.com/organizations/TWOJA-ORGANIZACJA/settings/installations 

Sample configuration `czujnikownia-org.yml`:
```yml
keywordConfigs:
  - teamNameTrigger: "20"
    projectTitlePrefix: "monitor-"
    projectTemplateNumber: 6
    openPullRequestDateProjectFieldName: "Open Date"
    firstReviewSubmitDateProjectFieldName: "First Review Date"
    lastReviewSubmitDateProjectFieldName: "Last Review Date"
    lastApprovedReviewSubmitDateProjectFieldName: "Last Approve Review Date"
    reviewIterationNumberProjectFieldName : "Review Iteration"
  - teamNameTrigger: "24"
    projectTitlePrefix: "sensor-"
```

- `keywordConfigs` - a set of settings for specific keywords
- `teamNameTrigger` - keyword searched in the name of the created team, which triggers the creation of a new project in the organization
- `projectTitlePrefix` - the prefix of the created project title
- `projectTemplateNumber` - the number of an existing project in the organization that will be used as a template for the newly created project. If not set, the newly created project will be empty.
- `openPullRequestDateProjectFieldName` - the name of the field column where the creation date of a *pull request* by a user who is a member of a team containing the keyword in its name will be entered. The repository in which the *pull request* was created must be linked to the team. Optional parameter.
- `lastReviewSubmitDateProjectFieldName` - the name of the field column where the date of the last *pull request* review submission by a user who is a member of a team containing the keyword in its name will be entered. Optional parameter.
- `firstReviewSubmitDateProjectFieldName` - the name of the field column where the date of the first *pull request* review submission by a user who is a member of a team containing the keyword in its name will be entered. Optional parameter.
- `lastApprovedReviewSubmitDateProjectFieldName` - the name of the field column where the date of the last positive *pull request* review submission by a user who is a member of a team containing the keyword in its name will be entered. Optional parameter.
- `reviewIterationNumberProjectFieldName` - the name of the field column where the number of currently completed *pull request* reviews will be entered. Optional parameter.