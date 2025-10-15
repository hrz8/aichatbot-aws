import { z } from 'zod';

import {
  UpdateCartTravelerRequestSchema,
  CartTravelerIdSchema,
  SessionTokenSchema,
  CartIdSchema,
} from '../shared-schemas.js';

/**
 * Schema for update_cart_traveler tool
 * Updates one or more attributes of a traveler in a cart (PATCH semantics)
 */
export const UpdateCartTravelerSchema = z.object({
  cartId: CartIdSchema
    .describe('Cart ID containing the traveler to update. This is the 16-character alphanumeric ID returned when you created the cart.'),

  travelerId: CartTravelerIdSchema
    .describe('Traveler ID to update. Get this from get_cart_travelers or get_cart_details. Format: alphanumeric with hyphens (e.g., "PAX-1", "SKH-2-EXT").'),

  'session-token': SessionTokenSchema,

  requestBody: UpdateCartTravelerRequestSchema
    .describe('Traveler information to update. All fields are optional (PATCH semantics) - only include the fields you want to change. You can update: name (firstName, middleName, lastName, title), dateOfBirth, gender, nationalityCode, passport details (documentNumber, expiryDate, issuanceCountryCode, documentType), or frequentFlyerCard (companyCode, cardNumber). Unchanged fields will retain their current values.'),
}).describe('UPDATE TRAVELER IN CART: Modify one or more attributes of a traveler in the cart. This uses PATCH semantics, meaning you only need to provide the fields you want to update - all other fields will remain unchanged. Common use cases: add passport information, update name spelling, add frequent flyer number, change date of birth, add nationality. PREREQUISITES: Requires valid cartId from create_cart, travelerId from get_cart_travelers, and session-token from initialize_booking_session. WORKFLOW: First use get_cart_travelers to find the travelerId, then update specific fields. IMPORTANT: For infants, you may need to provide accompanyingTravelerId. For adults traveling with infants, the system will validate associations. RESPONSE: Returns the updated traveler object with all current information.');
