# Kendo Tournament app

This document provides instructions for setting up the app, our development workflow, and deployment guidelines.

## How to Start the App

TODO: Add instructions on how to start the app.

## Development Workflow

This project follows a Git Workflow. For reference, you can check [this link](https://www.atlassian.com/git/tutorials/comparing-workflows), but the main idea is outlined below.
### Branching Strategy

We use a branch-based development workflow. Please follow these guidelines when creating branches:

* `main`: The main branch represents the production-ready code.
* `development`: The development branch is where feature branches are merged before going to production.
* Feature branches: Create a feature branch for each new feature or bug fix. Name it descriptively, such as `feature/add-authentication` or `bugfix/fix-broken-link`.

### Commit Guidelines

Follow these commit message guidelines:
* Use imperative verbs (e.g., "Add feature," "Fix bug," "Update documentation").
* Keep commits focused on a single task.

### Pull Request (PR) Process

1. Create a new branch for your feature or bug fix.
2. Commit and push your changes to your branch.
2. Open a pull request from your branch to the `develop` branch.
3. Ensure that your PR has a clear title and description.
4. Request code review from team members.

### Git Etiquette

- Avoid force pushing to shared branches (`main`, `develop`) unless necessary.
- Be mindful of the commit history; keep it clean and easy to follow.
- Use meaningful branch and commit messages.
- Communicate with team members to coordinate changes.

## Deployment

TODO: Add deployment instructions here.
