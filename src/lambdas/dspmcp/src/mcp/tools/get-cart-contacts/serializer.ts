import type { TravelerContactResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import {
  formatWarnings,
  formatContact,
  formatHeader,
  formatErrors,
} from '../shared-serializers.js';

/**
 * Serialize get cart contacts response into human-readable format
 */
export function serializeGetCartContactsResponse(
  response: AxiosResponse<TravelerContactResponse>,
): string {
  const { data } = response;
  const timestamp = new Date();

  let output = formatHeader('CART CONTACT INFORMATION');

  // Handle errors
  if (data.errors && data.errors.length > 0) {
    return output + formatErrors(data.errors, 'get_cart_contacts', timestamp);
  }

  // Display contact information
  output += formatContact(data.data);

  // Warnings
  output += formatWarnings(data.warnings);

  // Next steps
  output += '\n📋 NEXT STEPS:\n';
  output += '  1. Verify contact information is correct\n';
  output += '  2. Update contacts if needed (use update_cart_contact)\n';
  output += '  3. Add additional contacts if required (use add_cart_contact)\n';
  output += '  4. Proceed to select services or payment\n';

  return output;
}
