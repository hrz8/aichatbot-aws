import type { McpCustomToolDefinition } from '../types.js';

import { CalculateLoyaltyPointsSchema } from './schema.js';
import { handleLoyaltyCalculation } from './handler.js';

export const calculateLoyaltyPointsTool: McpCustomToolDefinition = {
  type: 'custom',
  enabled: false, // just a dummy tool for reference - not enabled by default
  name: 'calculate_loyalty_points',
  description: 'Calculate Enrich loyalty points earned for a flight booking. Provides detailed breakdown of base points, tier bonuses, fare class multipliers, and route bonuses. Use after creating a cart to show customers their rewards. NOTE: This is a custom (non-OpenAPI) tool that performs local calculations without external API calls. Currently DISABLED by default - set enabled: true when ready for production use.',
  inputSchema: CalculateLoyaltyPointsSchema,
  handler: handleLoyaltyCalculation,
};
