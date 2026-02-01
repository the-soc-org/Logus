# Contributing to Logus

Thank you for your interest in contributing to the Logus project! This guide will help you understand the collaboration process and standards that apply to the project.

### Why is it worth reading this guide?

Following these guidelines will help us all collaborate more efficiently. Thanks to the automation of many processes (testing, formatting, code analysis, documentation, releases), we can focus on developing functionality instead of project administration.

# Getting Started

## Environment Setup

1. **Fork or branch**: Work on an assigned branch or create a fork of the repository
2. **Install dependencies**: `npm install`
3. **Build the project**: `npm run build`

## How to Propose Changes

1. Make changes to the code
2. Test functionality locally
3. Make sure all tests pass
4. Format code according to standards
5. Create a pull request to the indicated branch

# Testing

Code and program functionality is tested using **Jest**. To run tests:

```bash
npm test
```

All new functionality should be covered by tests. Tests are required for all contributions.

# Code Formatting

The project uses **Prettier** for automatic code formatting. Available commands:

- `npm run format` - formats all files in the project
- `npm run format:check` - checks if code is formatted
- `npm run format:file filename.ts` - formats a specific file

Formatting is automatically checked in GitHub Actions.

# Code Analysis

The project uses the following tools for code quality analysis:

- **ESLint** - static analysis and coding standards checking
- **CodeQL** - code security analysis

Both tools are automatically run in GitHub Actions on every pull request and push. Locally you can run:

```bash
npm run lint        # code checking
npm run lint:fix    # automatic fixes where possible
```

# Code Documentation

## TSDoc Comments

Please use comments compliant with the **TSDoc** format (similar to JSDoc) to automatically generate documentation:

````typescript
/**
 * Description of function or class
 * @param paramName - parameter description
 * @returns description of returned value
 * @example
 * ```typescript
 * usage example
 * ```
 */
````

**Additional information**: [TSDoc Comments](https://tsdoc.org/)

Documentation is automatically generated using **TypeDoc** in GitHub Actions - you don't need to create it manually.

# Version Management and Releases

The project uses **Semantic Release** for automatic version management and release publishing.

⚠️ **Important**:

- DO NOT run `npm run release` yourself
- Semantic Release is automatically run by GitHub Actions

# Commit Message Conventions

The project uses **Conventional Commits** to standardize commit messages. Format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Useful types:

- `feat`: new functionality
- `fix`: bug fix
- `chore`: administrative tasks, configuration changes
- `docs`: documentation changes
- `style`: formatting, whitespace (doesn't affect code)
- `refactor`: code refactoring
- `test`: adding or modifying tests
- `ci`: CI/CD changes
- `perf`: performance improvements

### Examples:

```
feat(auth): add user authentication
fix(api): resolve null pointer exception
chore: update dependencies
docs: update contributing guidelines
```

**Additional information**: [Conventional Commits](https://www.conventionalcommits.org/)

# Automation

The following processes are fully automated by GitHub Actions:

- ✅ Running tests
- ✅ Checking code formatting
- ✅ ESLint analysis
- ✅ CodeQL analysis
- ✅ TypeDoc documentation generation
- ✅ Semantic Release (versioning and publishing)

Thanks to this, you can focus on writing code, not on administrative processes.

# Questions and Help

If you have questions about the contribution process, open an issue or contact the project maintainer.
