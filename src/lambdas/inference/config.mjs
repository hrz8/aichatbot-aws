import { load as loadYaml } from 'js-yaml';
import { z } from 'zod';
import * as dotenv from 'dotenv';

if (process.env.RUN_IN_LAMBDA !== 'true') {
  dotenv.config({ quiet: true });
}

const configSchema = z.object({
  EMBEDDING_MODEL: z.string(),
});

function loadConfig() {
  if (process.env.RUN_IN_LAMBDA === 'true') {
    const yaml = process.env.CONFIG_YAML;
    if (!yaml) {
      throw new Error('CONFIG_YAML must be set in Lambda');
    }

    let parsedYaml;
    try {
      parsedYaml = loadYaml(yaml);
    } catch (err) {
      throw new Error('Failed to parse CONFIG_YAML: ' + err.message);
    }

    return configSchema.parse(parsedYaml);
  }

  return configSchema.parse(process.env);
}

const config = Object.freeze(loadConfig());

export const {
  EMBEDDING_MODEL,
} = config;

export default config;
