import { z } from 'zod';

import { SessionTokenSchema, CartIdSchema } from '../shared-schemas.js';

/**
 * Schema for get_cart_details tool
 * Retrieves comprehensive cart information including travelers, flights, and contacts
 */
export const GetCartDetailsSchema = z.object({
  cartId: CartIdSchema
    .describe('Cart ID to retrieve details for. This is the 16-character alphanumeric ID returned when you created the cart using create_cart tool.'),

  'session-token': SessionTokenSchema,
}).describe('CART DETAILS RETRIEVAL: Fetch complete cart information including travelers, flight offers, pricing, and contact details. Use this after creating a cart to view its current state, or before proceeding to booking to verify all information is correct. The response includes comprehensive flight details with dictionaries for airlines, aircraft, locations, and currencies.');
