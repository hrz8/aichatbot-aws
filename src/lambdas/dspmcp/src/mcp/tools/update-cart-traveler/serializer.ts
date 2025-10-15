import type { UpdateCartTravelerResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import {
  formatWarnings,
  formatTraveler,
  formatHeader,
  formatErrors,
} from '../shared-serializers.js';

/**
 * Serialize update cart traveler response into human-readable format
 */
export function serializeUpdateCartTravelerResponse(
  response: AxiosResponse<UpdateCartTravelerResponse>,
): string {
  const { data } = response;
  const timestamp = new Date();

  let output = formatHeader('TRAVELER UPDATED SUCCESSFULLY');

  // Handle errors
  if (data.errors && data.errors.length > 0) {
    return output + formatErrors(data.errors, 'update_cart_traveler', timestamp);
  }

  output += '✅ Traveler information has been updated!\n\n';

  // Display updated traveler
  output += formatTraveler(data.data);

  // Warnings
  output += formatWarnings(data.warnings);

  // Next steps
  output += '\n📋 NEXT STEPS:\n';
  output += '  1. Verify the updated information is correct (use get_cart_travelers)\n';
  output += '  2. Update additional travelers if needed (call this tool again)\n';
  output += '  3. Add or update contact information (add_cart_contact / update_cart_contact)\n';
  output += '  4. Review complete cart (use get_cart_details)\n';
  output += '  5. Proceed to payment when all information is correct\n';

  return output;
}
