import { z } from 'zod';

import { TravelerContactsSchema, SessionTokenSchema, CartIdSchema } from '../shared-schemas.js';

/**
 * Schema for update_cart_contact tool
 * Updates existing contact information in a cart
 */
export const UpdateCartContactSchema = z.object({
  cartId: CartIdSchema
    .describe('Cart ID containing the contact to update. This is the 16-character alphanumeric ID returned when you created the cart using create_cart tool.'),

  'session-token': SessionTokenSchema,

  requestBody: TravelerContactsSchema
    .describe('Updated contact information. Provide the fields you want to update - you do not need to include all fields, only those that need to be changed. To update a specific contact, include its contactId in the phone or email object. To replace all contacts, provide complete new contact information.'),
}).describe('UPDATE CART CONTACT: Modify existing contact information in a cart. Use this to correct errors, update phone numbers or emails, or change emergency contact details. You can update specific contact fields by providing only the fields that need to change (PATCH semantics). PREREQUISITES: Requires valid cartId from create_cart and session-token from initialize_booking_session. BEST PRACTICE: First use get_cart_contacts to retrieve current contact IDs, then update specific contacts by including the contactId. WORKFLOW: Use when contact information needs correction after being added, or when customer provides updated contact details. RESPONSE: Returns the updated contact information with all current details.');
