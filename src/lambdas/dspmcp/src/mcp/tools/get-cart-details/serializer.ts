import type { CartDetailsResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import {
  formatTravelersList,
  formatWarnings,
  formatAirOffer,
  formatContact,
  formatHeader,
  formatErrors,
} from '../shared-serializers.js';

/**
 * Serialize cart details response into human-readable format
 */
export function serializeGetCartDetailsResponse(
  response: AxiosResponse<CartDetailsResponse>,
): string {
  const { data } = response;
  const timestamp = new Date();

  let output = formatHeader('CART DETAILS');

  // Handle errors
  if (data.errors && data.errors.length > 0) {
    return output + formatErrors(data.errors, 'get_cart_details', timestamp);
  }

  // Cart ID
  output += `🛒 Cart ID: ${data.data.id}\n\n`;

  // Travelers
  if (data.data.travelers && data.data.travelers.length > 0) {
    output += '👥 TRAVELERS\n';
    output += '='.repeat(80) + '\n';
    output += formatTravelersList(data.data.travelers);
  }

  // Air Offers
  if (data.data.airOffers && data.data.airOffers.length > 0) {
    output += '\n✈️  FLIGHT OFFERS\n';
    output += '='.repeat(80) + '\n\n';
    data.data.airOffers.forEach((offer, index) => {
      if (data.data.airOffers && data.data.airOffers.length > 1) {
        output += `--- Offer ${index + 1} ---\n\n`;
      }
      output += formatAirOffer(offer, data.dictionaries);
    });
  }

  // Contacts
  if (data.data.contacts) {
    output += '\n📞 CONTACT INFORMATION\n';
    output += '='.repeat(80) + '\n\n';
    output += formatContact(data.data.contacts);
  }

  // Warnings
  output += formatWarnings(data.warnings);

  // Next steps
  output += '\n📋 NEXT STEPS:\n';
  output += '  1. Review all traveler information\n';
  output += '  2. Add or update traveler details if needed (update_cart_traveler)\n';
  output += '  3. Add or update contact information (add_cart_contact / update_cart_contact)\n';
  output += '  4. Select ancillary services (baggage, meals, seats)\n';
  output += '  5. Proceed to payment\n';

  return output;
}
