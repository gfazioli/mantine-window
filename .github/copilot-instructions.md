# Copilot Instructions for Mantine JsonTree Component

## Project Overview

This repository contains a Mantine-based JSON tree viewer component (`@gfazioli/mantine-json-tree`). It's an interactive JSON tree viewer built with Mantine's Tree component, featuring collapsible nodes, syntax highlighting with type-specific colors, copy-to-clipboard functionality, item count badges, configurable expansion depth, and smooth animations.

## Project Purpose

The component is designed for:
- Debugging API responses
- Exploring complex data structures
- Developer tools integration
- JSON data visualization in React applications

## Technology Stack

- **Framework**: React 19.2.0
- **UI Library**: Mantine 8.3.8
- **Language**: TypeScript 5.9.3
- **Build Tool**: Rollup
- **Package Manager**: Yarn 4.11.0
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint with Mantine config
- **Code Formatting**: Prettier with sort-imports plugin
- **CSS**: PostCSS with Mantine preset
- **Documentation**: Storybook and custom docs site

## Repository Structure

- `package/`: Main package source code
  - `src/`: Component source files
    - `JsonTree.tsx`: Main component
    - `JsonTree.module.css`: Component styles
    - `JsonTree.test.tsx`: Component tests
    - `lib/`: Utility functions and helpers
- `docs/`: Documentation site
- `scripts/`: Build and release scripts
- `.storybook/`: Storybook configuration
- `@types/`: TypeScript type definitions

## Build and Development Process

### Installation
```bash
yarn install
```

### Development
```bash
npm run dev          # Start dev server (docs site)
npm run storybook    # Start Storybook on port 8271
```

### Building
```bash
npm run build        # Build the package
npm run docs:build   # Build documentation site
```

### Testing
```bash
npm test             # Run all tests (syncpack, prettier, typecheck, lint, jest)
npm run jest         # Run Jest tests only
npm run typecheck    # TypeScript type checking
```

### Linting and Formatting
```bash
npm run lint                # Run both ESLint and Stylelint
npm run eslint              # Run ESLint
npm run stylelint           # Run Stylelint for CSS
npm run prettier:check      # Check code formatting
npm run prettier:write      # Format code
npm run syncpack            # Check dependency version mismatches
```

## Coding Standards and Technical Principles

### General Guidelines
1. **Minimal Changes**: Make the smallest possible changes to achieve the goal
2. **Type Safety**: All code must be fully typed with TypeScript
3. **Code Quality**: Follow the existing ESLint and Prettier configurations
4. **Testing**: Write tests for new features and bug fixes
5. **Documentation**: Update Storybook stories for component changes

### TypeScript
- Target: ES2015
- Module: ESNext
- JSX: React
- Use strict type checking
- Avoid `any` types

### React
- Use functional components with hooks
- Follow React 19 best practices
- Use Mantine components and hooks where applicable
- Component props should be well-typed interfaces

### CSS
- Use CSS Modules (`.module.css` files)
- Follow PostCSS preset for Mantine
- Use Mantine's styling tokens and utilities
- Ensure styles pass Stylelint checks

### Testing
- Use Jest with React Testing Library
- Write unit tests for components
- Test accessibility with jest-axe
- Follow existing test patterns in `*.test.tsx` files

### Git Workflow
- Branch naming: Use descriptive names (feature/*, fix/*, etc.)
- Commits: Write clear, concise commit messages
- PRs: Ensure all CI checks pass before merging

## Key Files and Their Purpose

- `package/src/JsonTree.tsx`: Main component implementation
- `package/src/lib/`: Helper functions and utilities
- `package/package.json`: Package metadata and dependencies
- `rollup.config.mjs`: Build configuration
- `tsconfig.json`: TypeScript configuration
- `eslint.config.mjs`: ESLint configuration
- `.prettierrc.mjs`: Prettier configuration
- `.stylelintrc.json`: Stylelint configuration

## Dependencies

### Core Dependencies
- `@mantine/core`: UI component library
- `@mantine/hooks`: React hooks library
- `react` and `react-dom`: React framework

### Build and Dev Dependencies
- `rollup`: Module bundler
- `typescript`: Type checking
- `eslint`: Code linting
- `prettier`: Code formatting
- `jest`: Testing framework
- `storybook`: Component documentation

## Important Constraints

1. **Mantine Version**: Keep in sync with Mantine 8.3.8 (or compatible versions)
2. **React Version**: Using React 19 - be aware of any API changes
3. **Node Version**: Use Node.js 20.9.0 (specified in workflows)
4. **Package Manager**: Must use Yarn 4.11.0
5. **Browser Support**: Target modern browsers supporting ES2015
6. **Breaking Changes**: Avoid breaking the public API without major version bump

## Release Process

- `npm run release:patch`: Patch version bump
- `npm run release:minor`: Minor version bump
- `npm run release:major`: Major version bump

All release commands automatically deploy documentation.

## Common Tasks

### Adding a New Feature
1. Create feature branch
2. Implement feature with TypeScript
3. Add/update tests
4. Update Storybook stories
5. Run `npm test` to ensure all checks pass
6. Update documentation if needed
7. Submit PR

### Fixing a Bug
1. Create fix branch
2. Add failing test that reproduces the bug
3. Fix the bug
4. Ensure test passes
5. Run `npm test`
6. Submit PR

### Updating Dependencies
1. Use `syncpack` to check version mismatches
2. Update `package.json` carefully
3. Run `yarn install`
4. Run full test suite
5. Check for breaking changes

## CI/CD

The repository uses GitHub Actions for CI:
- Runs on all pull requests
- Executes: dependency installation, build, docs build, and tests
- All checks must pass before merging

## Documentation

- Demo and documentation: https://gfazioli.github.io/mantine-json-tree/
- NPM package: https://www.npmjs.com/package/@gfazioli/mantine-json-tree
- Issues: https://github.com/gfazioli/mantine-json-tree/issues

## Support and Community

- Report bugs via GitHub issues
- Follow the code of conduct (CODE_OF_CONDUCT.md)
- Read contribution guidelines (CONTRIBUTING.md)
