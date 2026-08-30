# The Hermes Cookbook

A field guide to building Telegram bots with
[Hermes](https://github.com/sidwiskers/hermes), the zero-dependency Bot API
framework for Go.

Read it at https://hermes.lastlife.cyou — or just open `index.html`;
the whole book is plain HTML, so it works from a folder too.

## What's inside

Thirteen short chapters, each one a working piece of a real bot:

1. Getting started — a bot that answers `/start` in a few minutes
2. Polling and webhooks — and when each one is right
3. The context — the one object every handler receives
4. Keyboards and buttons — including the 64-byte callback limit
5. Typed callbacks — stop parsing callback data by hand
6. Filters, groups, middleware — routing beyond exact commands
7. Sessions — remembering things between updates
8. State machines — conversations that stay readable as they grow
9. Files and media — streaming uploads, albums, the file-id habit
10. Ephemeral messages — answers only one user can see
11. Production hardening — rate limits, deduplication, observability
12. Testing with Hermes Lab — full bot tests without touching Telegram
13. Running a fleet — many bots, one process, one lifecycle

## Corrections

If something's wrong or a chapter left you stuck, open an issue or a pull
request. Fixes land as fast as they're merged.

MIT, same as Hermes.
