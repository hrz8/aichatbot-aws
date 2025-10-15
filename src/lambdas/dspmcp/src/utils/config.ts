import { load as loadYaml } from 'js-yaml';
import * as dotenv from 'dotenv';
import { z } from 'zod';

if (process.env.RUN_IN_LAMBDA !== 'true') {
  dotenv.config({ quiet: true });
}

export const MCP_SERVER_NAME = 'dsp-mcp';
export const MCP_SERVER_VERSION = '0.1.0';

const envSchema = z.object({
  MCP_ALLOWED_HOSTS: z
    .string()
    .transform((val) => val.split(',').map((host) => host.trim()))
    .pipe(z.array(z.string().min(1)))
    .default('localhost,localhost:3067'),
  DSP_BOOKING_BASE_URL: z.string(),
  DSP_BOOKING_API_VERSION: z.string().default('1.0'),
  DSP_APIM_SUBSCRIPTION_KEY: z.string(),
  DSP_OAUTH_CLIENT_ID: z.string(),
  DSP_OAUTH_CLIENT_SECRET: z.string(),
  DSP_OAUTH_TOKEN_URL: z.string(),
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
      throw new Error('Failed to parse CONFIG_YAML: ' + (err as Error)?.message);
    }

    return envSchema.parse(parsedYaml);
  }

  return envSchema.parse(process.env);
}

const config = Object.freeze(loadConfig());

export const {
  MCP_ALLOWED_HOSTS,
  DSP_BOOKING_BASE_URL,
  DSP_BOOKING_API_VERSION,
  DSP_APIM_SUBSCRIPTION_KEY,
  DSP_OAUTH_CLIENT_ID,
  DSP_OAUTH_CLIENT_SECRET,
  DSP_OAUTH_TOKEN_URL,
} = config;
