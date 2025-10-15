import type { TravelerContactResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import {
  formatWarnings,
  formatContact,
  formatHeader,
  formatErrors,
} from '../shared-serializers.js';

/**
 * Serialize update cart contact response into human-readable format
 */
export function serializeUpdateCartContactResponse(
  response: AxiosResponse<TravelerContactResponse>,
): string {
  const { data } = response;
  const timestamp = new Date();

  let output = formatHeader('CONTACT UPDATED SUCCESSFULLY');

  // Handle errors
  if (data.errors && data.errors.length > 0) {
    return output + formatErrors(data.errors, 'update_cart_contact', timestamp);
  }

  output += '✅ Contact information has been updated!\n\n';

  // Display updated contact
  output += formatContact(data.data);

  // Warnings
  output += formatWarnings(data.warnings);

  // Next steps
  output += '\n📋 NEXT STEPS:\n';
  output += '  1. Verify the updated information is correct (use get_cart_contacts)\n';
  output += '  2. Make additional updates if needed (call this tool again)\n';
  output += '  3. Review complete cart details (use get_cart_details)\n';
  output += '  4. Proceed to payment when all information is correct\n';

  return output;
}
