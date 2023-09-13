# Welcome Aboard, Contributor!

Hello! We are thrilled to see you here and greatly appreciate your interest in contributing to the NavigoLearn API. Here, we've set up a few guidelines to make the contribution process smooth sailing.

## Code of Conduct

First off, we ask all contributors to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please ensure you read and understand it before participating in our community.

## Prepare for Your Journey

If you're new to our codebase, we've got you covered. Refer to the setup guide provided in the [README.md](README.md) file. This will help you set up your local development environment and get you started on your journey with us.

## Set Sail for Contribution

1. **Fork the Repository** - Start by creating a fork of our repository to your account, then clone it to your local machine for direct access.

2. **Gear Up Your Development Environment** - Make a new branch for your amazing feature or perhaps that clever bug fix (try to name the branch something descriptive!).

3. **Chart Your Changes** - Now, you're all set to modify the necessary files to implement your magic.

4. **Test the Waters** - Make sure to test your changes. If you can, add tests that cover your changes.

5. **Submit a Pull Request** - You can now push your changes to your fork and submit a pull request to the `master` branch in our GitHub repository.

Kindly ensure your PR has a detailed summary of changes. Discuss the problem you're tackling, identify the solution you've come up with, and share a concise and illustrative rationale for your changes.

## Style Guidelines & Naming Conventions

Consistency is key, and a clean, uniform codebase is a joy to work with. For our TypeScript project, we use ESLint to enforce code standards and catch potential issues.

Api endpoints are named using kebab-case. For example, `GET /api/users/profile-picture` is a valid endpoint.

For functions, variables and SQL tables, we use camelCase. For example, `const user = await db.getWhere('users', 'id', userId);` is valid.

### ESLint

Before you submit your pull request, ensure your changes pass ESLint without any errors. If any ESLint warnings remain, they should be few and justifiable with clear explanation. Make sure to include any explanation or justification for unresolved ESLint warnings in your pull request comments.

We recommend running `npm run lint`(/src) and `npm run lint:tests`(/spec) locally before pushing your changes. This will invoke ESLint and report any issues.

Thank you for helping us maintain a consistent and clean codebase!

## Release Shore Ahead

We typically cut loose new releases every few weeks. Rest assured, once your changes have merged, they'll find their rightful place in our next release.

Thank you for setting sail with us! Your contribution helps make NavigoLearn API the treasure it is.