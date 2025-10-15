import { z } from 'zod';

import { SessionTokenSchema, CartIdSchema } from '../shared-schemas.js';

/**
 * Schema for get_cart_contacts tool
 * Retrieves contact information from a cart
 */
export const GetCartContactsSchema = z.object({
  cartId: CartIdSchema
    .describe('Cart ID to retrieve contact information from. This is the 16-character alphanumeric ID returned when you created the cart using create_cart tool.'),

  'session-token': SessionTokenSchema,
}).describe('GET CART CONTACTS: Retrieve all contact information stored in a cart. This includes main contact (email and phone), alternate contact (email), and emergency contact (phone). Use this tool to verify contact information before proceeding to payment or to check what contacts have been added to the cart. PREREQUISITES: Requires valid cartId from create_cart and session-token from initialize_booking_session. WORKFLOW: Use after adding contacts with add_cart_contact, or before payment to verify contact details. RESPONSE: Returns complete contact information including contact IDs, traveler associations, and all contact details.');
