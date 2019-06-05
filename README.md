# Datadog middleware builder in Typescript

Provides [Datadog](https://www.datadoghq.com/) Node.js integration with Typescript.

## Installation

```bash
$ npm i datadog-middleware-builder
```

## Usage

### Express.js integration

```typescript
import { DatadogMiddlewareBuilder, StatsdSingletonFactory } from 'datadog-middleware-builder';

const getStatsdClient = (): any => {
  StatsdSingletonFactory.setupFactory(
    Config.DATADOG_AGENT_HOST,
    Config.DATADOG_AGENT_PORT,
    Config.DATADOG_CACHE_DNS,
    Config.DATADOG_GLOBAL_TAGS);
  return StatsdSingletonFactory.getStatsdClient();
};

...

app.use(DatadogMiddlewareBuilder.build(getStatsdClient(), Config.DATADOG_SERVICE_NAME));
```

You can check [Datadog's documentation](https://docs.datadoghq.com/integrations/express/) to see what are the exposed metrics.
