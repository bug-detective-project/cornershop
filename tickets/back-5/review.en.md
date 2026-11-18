# Code review: CS-205, a request id in the answers and in the log

A log is only useful if you can find one story in it. A request id is the cheapest way to make that possible. Here is the reference approach, so you can compare it with yours.

## What this ticket was about

- Each line was correct and the log as a whole was unusable: nothing connected the lines of one request, or a line to the person who made the request.
- The id has to exist in two places at once, where the caller can see it (the answer) and where the team can search it (the log). One without the other does not help.
- Accepting the caller's id lets a request be followed across systems, from the page to the API and beyond.

## Why the reference is built this way

- The id is decided once, in the first middleware, and everything later reads it. No route had to change.
- The header is set before the answer is built, so no path through the app can forget it.
- The caller's header is checked against a strict pattern before it is used. It is input: without the check, anyone could write arbitrary text, or new lines, into the log.
- The log stays one JSON object per line, so it can be searched by field with ordinary tools.

## Compare with what you built

- Did you set the header in each route, or only in the success path? Check a 404, a 400 and a refused host.
- Did you use a counter (1, 2, 3…) as the id? It restarts with the server and repeats; two requests from different days get the same id.
- Did you accept any `X-Request-Id` the caller sends? Try one with spaces, or one that is two thousand characters long.
- Did you generate the id in the `finish` handler? Then the answer was already sent without it.

## Watch for next time

- When you add a log line, ask how someone will find it later and what they will need next to it.
- Treat headers as input, like a body: validate them before using them.
- Decide a value once and pass it along. Two places that each compute "the id" will one day disagree.
