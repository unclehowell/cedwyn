# Q&A daily refresh

This automation updates the dedicated `unclehowell/cedwyn-qa` repository. GitHub Actions performs the source scan and commits the released datasets to `main`; Cloudflare is used only as a small, authenticated OpenRouter inference gateway. There is no Cloudflare build or scheduled Cloudflare job.

## Closed source scope

The agent reads only:

- Read-only metadata files `README.md`, `sources.json`, and `sources-books.json` from `unclehowell/cedwyn-catalogue`.
- The canonical catalogue records from `https://cedwyn.bucklerfamily.estate/api/catalogue`.
- The public read-only `/api/mcp` endpoints in `sources.json`.

The catalogue repository metadata is used only to understand the catalogue's data contract and discover record IDs/classification; record text and substantive claims must come from the catalogue API or an allowlisted app MCP result.

It does not read Gmail, HubSpot, Hive, private drafts, other GitHub repositories, or the open web. The allowlist is deliberately limited to the public FOI, authorities, review, research, Dartboard, wiki, and docs apps. Each MCP endpoint is read-only; unsupported or unavailable endpoints are recorded as failures and ignored.

The model must only extract explicit questions and source-supported replies. It must not infer answers, treat an empty result as proof that no record exists, or publish a "not held" / "no reply" status without an express basis in the supplied records. All proposed entries need catalogue IDs or allowlisted source-app citations.

## What gets released

- `static/qa/kb.json`: searchable Q&A page data.
- `static/qa/api/qa.json`: same dataset for `/api/ask`, `/api/mcp`, and `/api/graphql`.
- `automation/state.json`: catalogue source-version cursor and last successful refresh.
- `automation/last-run.json`: source availability, model usage, and new/updated/skipped counts.

The job is incremental. It keeps stable Q&A IDs, merges duplicates, preserves existing substantive answers when a new source contains no answer, and writes no changes when it cannot validate the response. It fails closed on an oversized source batch, invalid model JSON, missing source citations, or broken dataset validation.

## One-time credential setup

A Cloudflare Worker named `qa-intelligence` has been deployed at:

`https://qa-intelligence.righteous.workers.dev/v1/refresh`

It accepts requests only with a short-lived GitHub Actions OIDC token for this repository's `main` branch and this exact workflow. It stores the OpenRouter key as a Worker secret; the key is never placed in GitHub, source code, or the browser.

The API key pasted into the chat has been exposed and was not stored. **Revoke/rotate it at OpenRouter**, then add the replacement as a Cloudflare Worker secret:

```sh
npx wrangler secret put OPENROUTER_API_KEY --name qa-intelligence
```

Or add a secret named `OPENROUTER_API_KEY` in Cloudflare Dashboard → Workers & Pages → `qa-intelligence` → Settings → Variables and Secrets. Until that secret is present, the daily job will fail closed before any Q&A change is made.

## Schedule and deployment

The GitHub workflow runs daily at 04:17 UTC and can also be run manually from the Actions tab. A successful run commits the validated JSON datasets to `main`; the repository's connected publication path can then serve the new data. No Cloudflare build command is invoked by this workflow.
