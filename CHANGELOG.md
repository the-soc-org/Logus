## [1.1.0] - 2025-05-27

### Added

- Added Jest tests for the refactored version of the application
- Added GitHub Action to build and test the application
- Added badge for test workflow to the `README.md`
- Added additional project filtering to prevent duplicates due to Polish characters
- Added TypeDoc support for documentation generation
- Added GitHub Action to generate documentation using TypeDoc
- Added `@zamiell/typedoc-plugin-not-exported` plugin to TypeDoc
- Added badge for documentation status to the `README.md`
- Added `dependabot.yml` configuration for dependency management
- Added GitHub Action for CodeQL code analysis
- Added Prettier and ESLint for code quality enforcement
- Added GitHub Action to run Prettier and ESLint

### Changed

- Updated parts of the codebase by adding JSDoc-style comments for improved documentation clarity
- Updated parts of the codebase to comply with Prettier formatting standards
- Updated parts of the codebase to fix some issues reported by ESLint
- Updated test cases to match current application behavior

### Fixed

- Fixed assignment of the "First review date" field
- Fixed incorrect behavior of the `addPullRequestAuthorAsAssignee` setting
