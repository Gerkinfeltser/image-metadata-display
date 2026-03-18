---
plan name: fix-minimatch-cve
plan description: Fix CVE-2026-27903 via vsce v3
plan status: done
---

## Idea
Fix Dependabot security alert #8 (CVE-2026-27903) - High severity ReDoS vulnerability in minimatch@3.1.2 by updating @vscode/vsce from v2 to v3, which uses glob@11 that has no minimatch dependency.

## Implementation
- Update @vscode/vsce devDependency from v2.32.0 to v3.x (npm install -D @vscode/vsce@^3)
- Verify package.json shows @vscode/vsce updated to v3.x
- Run npm audit to confirm CVE-2026-27903 is resolved (no remaining high/critical vulnerabilities)
- Run npm run package to test extension packaging still works correctly with vsce v3
- Commit changes with descriptive message referencing Dependabot alert #8 and CVE fix

## Required Specs
<!-- SPECS_START -->
<!-- SPECS_END -->