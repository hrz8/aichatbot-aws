import type { CreateCartResponse } from './types.js';
import type { AxiosResponse } from 'axios';

export function serializeCreateCartResponse(response: AxiosResponse<CreateCartResponse>): string {
  const { data } = response;

  let output = 'CART CREATION RESULT\n';
  output += '='.repeat(80) + '\n\n';

  if (data.errors && data.errors.length > 0) {
    output += 'ERRORS:\n';
    data.errors.forEach((error: any) => {
      output += `  - [${error.code}] ${error.message}\n`;
      if (error.details) {
        output += `    Details: ${JSON.stringify(error.details)}\n`;
      }
    });
    return output;
  }

  output += `Cart created successfully!\n\n`;
  output += `Cart ID: ${data.data.cartId}\n\n`;

  if (data.warnings && data.warnings.length > 0) {
    output += 'WARNINGS:\n';
    data.warnings.forEach((warning: CreateCartResponse['warnings'][number]) => {
      output += `  - [${warning.code}] ${warning.message}\n`;
    });
    output += '\n';
  }

  output += 'Next steps:\n';
  output += '  1. Add passenger details\n';
  output += '  2. Select ancillary services (baggage, meals, etc.)\n';
  output += '  3. Proceed to payment\n';

  return output;
}
