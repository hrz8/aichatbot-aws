import type { GetCartTravelersResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import {
  formatTravelersList,
  formatWarnings,
  formatHeader,
  formatErrors,
} from '../shared-serializers.js';

/**
 * Serialize get cart travelers response into human-readable format
 */
export function serializeGetCartTravelersResponse(
  response: AxiosResponse<GetCartTravelersResponse>,
): string {
  const { data } = response;
  const timestamp = new Date();

  let output = formatHeader('CART TRAVELERS');

  // Handle errors
  if (data.errors && data.errors.length > 0) {
    return output + formatErrors(data.errors, 'get_cart_travelers', timestamp);
  }

  // Display travelers
  output += formatTravelersList(data.data.travelers);

  // Warnings
  output += formatWarnings(data.warnings);

  // Next steps
  output += '\n📋 NEXT STEPS:\n';
  output += '  1. Review all traveler information for accuracy\n';
  output += '  2. Update traveler details if needed (use update_cart_traveler with traveler ID)\n';
  output += '  3. Add passport information if missing (use update_cart_traveler)\n';
  output += '  4. Add frequent flyer numbers (use update_cart_traveler)\n';
  output += '  5. Add or verify contact information (add_cart_contact / get_cart_contacts)\n';
  output += '  6. Review complete cart (use get_cart_details)\n';
  output += '  7. Proceed to payment when all information is complete\n';

  return output;
}
