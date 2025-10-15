import { z } from 'zod';

import { TravelerContactsSchema, SessionTokenSchema, CartIdSchema } from '../shared-schemas.js';

/**
 * Schema for add_cart_contact tool
 * Adds contact information to a cart
 */
export const AddCartContactSchema = z.object({
  cartId: CartIdSchema
    .describe('Cart ID to add contact information to. This is the 16-character alphanumeric ID returned when you created the cart using create_cart tool.'),

  'session-token': SessionTokenSchema,

  requestBody: TravelerContactsSchema
    .describe('Contact information to add to the cart. You can provide main contact (email and/or phone), alternate contact (email only), and emergency contact (phone with country code). Optionally associate the contact with a specific traveler using travelerId.'),
}).describe('ADD CONTACT TO CART: Add contact information (email, phone, emergency contact) to a cart. This is required before proceeding to payment. You must provide at least one contact method (main contact email or phone). The contact information can be associated with a specific traveler or apply to the entire cart. PREREQUISITES: Requires a valid cartId from create_cart and session-token from initialize_booking_session. WORKFLOW: Use this after creating a cart and adding travelers. You can add multiple contacts by calling this tool multiple times.');
