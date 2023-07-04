## Project Description

This project is a simple messaging api.

## Contribution Workflow

We adhere to the [Gitflow branching model](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). Our contribution workflow involves utilizing the develop branch as the central branch for active development. Therefore, we request that all Pull Requests be targeted towards the develop branch instead of the main branch. This approach ensures the stability of our main branch while allowing continuous development on the develop branch.

## Pull Request Etiquette

To ensure a smooth review process, please follow these guidelines:

- Fork and clone (https://help.github.com/articles/fork-a-repo) the repository into your own account. If you cloned the repository some time ago, it's recommended to fetch the latest changes from the upstream repository. You can do this by running the following commands or using the github UI: 
  - `git checkout develop` and `git pull upstream develop`
  - (https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

- In your forked repository, create a new branch: `git checkout -b <my-branch> develop`
- Make your changes/fixes.
- Commit your code with a descriptive commit message [using "Conventionalcommits"](https://www.conventionalcommits.org/en/v1.0.0/).
- Push your branch to GitHub: `git push origin <my-branch>`
- [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description matching the issue you intend to solve.

> ⚠️IMPORTANT **Note**
>
> ** To facilitate a smoother review process, we kindly ask you to use the following format for the Pull Request title:`[chore]`, `[feat]`, or `[fix]`, followed by a descriptive title. For instace, a feat-related change could have a title like `[feat] setup pasword reset`. This helps us categorize and understand the nature of the changes made in each PR..**


## Commits

 We highly encourage the use of conventional commits. Here are some examples:

  - **feat:** Use this when introducing a new feature.
  - **fix:**  Use this when resolving any issues in the codebase.
  - **chore:** Use this when adding new links/resources or making minor changes.
    (e.g, `[chore]: Add database credentials`)
  - Please ensure that your **commit messages are concise and clear**.
  - Write commit messages in the **present tense**, as they reflect the current state of the codebase after the changes have been applied.

For additional reference, check out [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)