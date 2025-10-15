import type { AxiosResponse } from 'axios';

export function serializeInitializeBookingResponse(response: AxiosResponse): string {
  const sessionToken = response.headers['session-token'];

  let output = 'BOOKING SESSION INITIALIZED\n';
  output += '='.repeat(80) + '\n\n';

  if (sessionToken) {
    output += `Session Token: '${sessionToken}'\n`;
    output += '(Token has been captured and will be used automatically for subsequent requests)\n\n';
  }

  output += 'Status: Ready\n';
  output += 'Next step: Use search_flights tool to find available flights\n';

  return output;
}
