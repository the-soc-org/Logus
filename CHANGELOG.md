## [1.1.2](https://github.com/IS-UMK/Czujnikownia/compare/v1.1.1...v1.1.2) (2025-12-22)


### Bug Fixes

* **ci:** include package-lock.json in release assets ([ff2272c](https://github.com/IS-UMK/Czujnikownia/commit/ff2272c59ecb4f42bf910835929a998bc537802c))
* **docs:** update badge links in README files to point to the correct CI workflows ([eed9c99](https://github.com/IS-UMK/Czujnikownia/commit/eed9c99867ef4d3244fb058014d0b0a40cc29c10))

## [1.1.1](https://github.com/SebastianSzt/Czujnikownia/compare/v1.1.0...v1.1.1) (2025-05-27)


### Bug Fixes

* **ci:** update node version in GitHub Action workflows ([b35c403](https://github.com/SebastianSzt/Czujnikownia/commit/b35c40395b9c52ede78d77795a8de4d0f599cd2d))

# [1.1.0] (2025-05-27)

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
- Added semantic-release with required plugins and configuration
- Added GitHub Actions workflow to trigger semantic-release on push to master
- Added badge for semantic-release

### Changed

- Updated parts of the codebase by adding JSDoc-style comments for improved documentation clarity
- Updated parts of the codebase to comply with Prettier formatting standards
- Updated parts of the codebase to fix some issues reported by ESLint
- Updated test cases to match current application behavior

### Fixed

- Fixed assignment of the "First review date" field
- Fixed incorrect behavior of the `addPullRequestAuthorAsAssignee` setting
