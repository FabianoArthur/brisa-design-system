# Security policy

## Supported versions

Only the latest version on `main` receives fixes.

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Report them privately through
[GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
("Report a vulnerability" in this repository's **Security** tab).

You can expect an acknowledgement within a few days. Once a fix is available, the advisory will be published
with credit to the reporter, unless you prefer to stay anonymous.

## Scope

This is a client-side UI library with no runtime dependencies, no network calls and no data storage besides
the theme preference kept in `localStorage`. The repository history is scanned for secrets on every push
(gitleaks) and GitHub Actions are pinned to commit SHAs.
