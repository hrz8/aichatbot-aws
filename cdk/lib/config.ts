import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

export type Config = z.infer<typeof configSchema>;

const configSchema = z.object({
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCOUNT_ID: z.string().default('000000000000'),
});

export const {
  AWS_REGION,
  AWS_ACCOUNT_ID,
} = Object.freeze(configSchema.parse(process.env));
