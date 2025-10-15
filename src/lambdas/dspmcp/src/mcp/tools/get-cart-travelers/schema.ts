import { z } from 'zod';

import { SessionTokenSchema, CartIdSchema } from '../shared-schemas.js';

/**
 * Schema for get_cart_travelers tool
 * Retrieves all travelers from a cart
 */
export const GetCartTravelersSchema = z.object({
  cartId: CartIdSchema
    .describe('Cart ID to retrieve travelers from. This is the 16-character alphanumeric ID returned when you created the cart using create_cart tool.'),

  'session-token': SessionTokenSchema,
}).describe('GET CART TRAVELERS: Retrieve all travelers from a cart. Returns comprehensive traveler information including traveler IDs, passenger types, names, dates of birth, gender, nationality, passport details, frequent flyer cards, and infant-adult associations. Use this to view all travelers in the cart, get traveler IDs for updates, or verify traveler information before payment. PREREQUISITES: Requires valid cartId from create_cart and session-token from initialize_booking_session. WORKFLOW: Use after creating cart to see initial travelers, before update_cart_traveler to get traveler IDs, or before payment to verify all traveler data. RESPONSE: Returns array of travelers with complete information including IDs needed for updates.');
