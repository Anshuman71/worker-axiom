# worker-axiom

Axiom wrapper for Cloudflare workers. This package provides a simple way to ingest data to Axiom from Cloudflare workers. You can then use the ingested data to view logs, create dashboards, and monitors.

## Prerequisites

- Axiom account
- Axiom API token

## Set up

Add the `AXIOM_API_TOKEN` environment variable to your Cloudflare worker.

## Usage

### Logging

> **Note:** You must call `sendLogs()` to send the logs to Axiom.

```js
import { createAxiomClient, getRequestMetadata } from 'worker-axiom';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    const createLogger = createAxiomClient({ orgId: '<my-org-id>', datasetName: '<axiom-data-set-name>', apiToken: env.AXIOM_API_TOKEN });
    const mainLogger = createLogger(getRequestMetadata(request));

    mainLogger.log('Main worker function', {
      origin,
      referer,
      requestedFrom,
      requestOrigin,
      apiEndpoint,
      method,
    });

    // must call sendLogs() to send the logs to Axiom
    mainLogger.sendLogs();
    // ... rest of the code
```

### Update logger data

```js
import { createAxiomClient, getRequestMetadata } from 'worker-axiom';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    const createLogger = createAxiomClient({ orgId: '<my-org-id>', datasetName: '<axiom-data-set-name>', apiToken: env.AXIOM_API_TOKEN });
    const mainLogger = createLogger(getRequestMetadata(request));

    mainLogger.log('Main worker function', {
      origin,
      referer,
      requestedFrom,
      requestOrigin,
      apiEndpoint,
      method,
    });

    const projectSettings = await getProjectSettingsFromDatabase(request);

    // project settings will be added to all the logs
    mainLogger.updateLoggerData({ ...projectSettings });

    // must call sendLogs() to send the logs to Axiom
    mainLogger.sendLogs();
    // ... rest of the code
```

### Disable logging to console

```js

import { createAxiomClient, getRequestMetadata } from 'worker-axiom';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    const createLogger = createAxiomClient({ orgId: '<my-org-id>', alsoLogToConsole: false,
    datasetName: '<axiom-data-set-name>', apiToken: env.AXIOM_API_TOKEN });
    const mainLogger = createLogger(getRequestMetadata(request));
  // rest of the code
```

## Sponsers

- [docsly.dev](https://www.docsly.dev) - Get actionable feedback and insights from your documentation.

## License

MIT
