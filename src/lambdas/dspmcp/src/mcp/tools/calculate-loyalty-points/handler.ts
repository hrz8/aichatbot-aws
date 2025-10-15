import type { LoyaltyCalculationResult, LoyaltyCalculationInput } from './types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { CalculateLoyaltyPointsSchema } from './schema.js';

/**
 * [PLACEHOLDER ONLY]
 * Calculate Enrich loyalty points for a booking
 * This is a custom tool handler that performs local calculations
 * without making external API calls
 */
export async function handleLoyaltyCalculation(
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  // Validate input using Zod schema
  const validated = CalculateLoyaltyPointsSchema.parse(args) as LoyaltyCalculationInput;

  // Calculate base points (5% of total price)
  const basePoints = Math.floor(validated.totalPrice * 0.05);

  // Fare class multiplier
  const fareClassMultipliers = {
    economy: 1.0,
    premium_economy: 1.5,
    business: 2.0,
    first: 3.0,
  };
  const fareClassBonus = Math.floor(
    basePoints * (fareClassMultipliers[validated.fareClass] - 1),
  );

  // Membership tier bonus
  const tierBonuses = {
    blue: 0, // 0% bonus
    silver: 0.25, // 25% bonus
    gold: 0.5, // 50% bonus
    platinum: 1.0, // 100% bonus
  };
  const tierBonus = Math.floor(basePoints * tierBonuses[validated.membershipTier]);

  // Route bonus for international flights
  const isInternational = validated.route.origin !== validated.route.destination;
  const routeBonus = isInternational ? Math.floor(basePoints * 0.1) : 0;

  // Calculate total
  const bonusPoints = fareClassBonus + tierBonus + routeBonus;
  const totalPoints = basePoints + bonusPoints;

  const result: LoyaltyCalculationResult = {
    basePoints,
    bonusPoints,
    tierMultiplier: fareClassMultipliers[validated.fareClass],
    totalPoints,
    breakdown: {
      fareClassBonus,
      tierBonus,
      routeBonus,
    },
  };

  // Format output
  let output = 'ENRICH LOYALTY POINTS CALCULATION\n';
  output += '='.repeat(80) + '\n\n';
  output += `Cart ID: ${validated.cartId}\n`;
  output += `Route: ${validated.route.origin} → ${validated.route.destination}\n`;
  output += `Fare Class: ${validated.fareClass.replace('_', ' ').toUpperCase()}\n`;
  output += `Membership Tier: ${validated.membershipTier.toUpperCase()}\n`;
  output += `Booking Price: MYR ${validated.totalPrice.toFixed(2)}\n\n`;

  output += 'POINTS BREAKDOWN:\n';
  output += '-'.repeat(80) + '\n';
  output += `Base Points (5% of price):           ${result.basePoints.toLocaleString()} pts\n`;

  if (result.breakdown.fareClassBonus > 0) {
    output += `Fare Class Bonus (${fareClassMultipliers[validated.fareClass]}x):         +${result.breakdown.fareClassBonus.toLocaleString()} pts\n`;
  }

  if (result.breakdown.tierBonus > 0) {
    const tierPercent = Math.floor(tierBonuses[validated.membershipTier] * 100);
    output += `${validated.membershipTier.toUpperCase()} Tier Bonus (${tierPercent}%):           +${result.breakdown.tierBonus.toLocaleString()} pts\n`;
  }

  if (result.breakdown.routeBonus > 0) {
    output += `International Route Bonus (10%):    +${result.breakdown.routeBonus.toLocaleString()} pts\n`;
  }

  output += '-'.repeat(80) + '\n';
  output += `TOTAL POINTS EARNED:                 ${result.totalPoints.toLocaleString()} pts\n\n`;

  output += `These points will be credited to your Enrich account within 7 days of flight completion.\n`;

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}
