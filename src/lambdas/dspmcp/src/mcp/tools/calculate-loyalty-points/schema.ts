import { z } from 'zod';

/**
 * [PLACEHOLDER ONLY]
 * Zod schema for loyalty points calculation input
 */
export const CalculateLoyaltyPointsSchema = z.object({
  cartId: z.string()
    .min(1)
    .describe('Cart ID from the create_cart operation'),
  fareClass: z.enum(['economy', 'premium_economy', 'business', 'first'])
    .describe('Cabin class of the booked flight'),
  totalPrice: z.number()
    .positive()
    .describe('Total booking price in base currency (MYR)'),
  route: z.object({
    origin: z.string()
      .length(3)
      .regex(/^[A-Z]{3}$/)
      .describe('IATA code of departure airport'),
    destination: z.string()
      .length(3)
      .regex(/^[A-Z]{3}$/)
      .describe('IATA code of arrival airport'),
  }).describe('Flight route information'),
  membershipTier: z.enum(['blue', 'silver', 'gold', 'platinum'])
    .optional()
    .default('blue')
    .describe('Enrich loyalty program membership tier'),
}).describe('Calculate Enrich loyalty points earned for a flight booking. This is a local calculation tool that does not make API calls.');
