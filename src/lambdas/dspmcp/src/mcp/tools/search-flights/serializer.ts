import type { FlightSearchResponse } from './types.js';
import type { AxiosResponse } from 'axios';

import { formatDuration, formatPrice, formatDate, formatTime } from '../../../helpers/formatter.js';

export function serializeFlightSearchResponse(
  response: AxiosResponse<FlightSearchResponse>,
): string {
  const { data: responseData } = response;
  const { data, dictionaries } = responseData;
  const { airBoundGroups } = data;

  let output = 'FLIGHT SEARCH RESULTS\n';
  output += '='.repeat(80) + '\n\n';

  if (!airBoundGroups || airBoundGroups.length === 0) {
    return output + 'No flights found matching your criteria.\n';
  }

  airBoundGroups.forEach((group, groupIdx) => {
    const { boundDetails, airBounds } = group;
    const { origin, destination, duration, segments, isFastestBound } = boundDetails;

    const originLoc = dictionaries.location[origin.airportCode];
    const destLoc = dictionaries.location[destination.airportCode];

    if (!originLoc || !destLoc) {
      output += `Warning: Location information not available for group ${groupIdx + 1}\n\n`;
      return;
    }

    if (!segments || segments.length === 0) {
      output += `Warning: No segment information for group ${groupIdx + 1}\n\n`;
      return;
    }

    const firstSegment = segments[0]!;
    const flightDetails = dictionaries.flight[firstSegment.flightId];

    if (!flightDetails) {
      output += `Warning: Flight details not available for group ${groupIdx + 1}\n\n`;
      return;
    }

    const allPrices = airBounds.map((ab) => ab.prices.totalPrice.total);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const currency = airBounds[0]?.prices.totalPrice.original.currencyCode || 'MYR';

    // Extract flight number for the header
    const mainFlightNumber = flightDetails.flightDesignator.marketing.flightNumber;
    const mainAirlineCode = flightDetails.flightDesignator.marketing.airlineCode;

    output += `OPTION ${groupIdx + 1}${isFastestBound ? ' (FASTEST)' : ''}\n`;
    output += `Flight: ${mainAirlineCode}${mainFlightNumber}\n`;
    output += `Route: ${originLoc.cityName} (${origin.airportCode}) -> ${destLoc.cityName} (${destination.airportCode})\n`;
    output += `Departure: ${formatDate(flightDetails.departure.dateTime)} at ${formatTime(
      flightDetails.departure.dateTime,
    )}\n`;
    output += `Duration: ${formatDuration(duration)}\n`;
    output += `Price Range: ${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}\n`;

    output += '\nFlight Details:\n';
    segments.forEach((seg, segIdx) => {
      const flight = dictionaries.flight[seg.flightId];
      if (flight) {
        const airline = dictionaries.airline[flight.flightDesignator.marketing.airlineCode];
        const flightNum = flight.flightDesignator.marketing.flightNumber;
        const operatingAirline =
          dictionaries.airline[flight.flightDesignator.operating.airlineCode];

        output += `  ${segIdx + 1}. ${airline} ${flightNum}`;

        // Show if operated by different airline (code share)
        if (
          flight.flightDesignator.marketing.airlineCode
          !== flight.flightDesignator.operating.airlineCode
        ) {
          output += ` (operated by ${operatingAirline})`;
        }

        output += `\n     Aircraft: ${flight.aircraftName}\n`;
        output += `     ${flight.departure.locationCode}`;
        if (flight.departure.terminal) {
          output += ` T${flight.departure.terminal}`;
        }
        output += ` ${formatTime(flight.departure.dateTime)}`;
        output += ` -> ${flight.arrival.locationCode}`;
        if (flight.arrival.terminal) {
          output += ` T${flight.arrival.terminal}`;
        }
        output += ` ${formatTime(flight.arrival.dateTime)}`;
        if (seg.arrivalDaysDifference) {
          output += ` +${seg.arrivalDaysDifference}d`;
        }
        output += `\n`;
      }
    });

    const econFares = airBounds.filter((ab) => {
      const ff = dictionaries.fareFamilyWithServices[ab.fareFamilyCode];
      return ff?.cabin === 'eco';
    });
    const busFares = airBounds.filter((ab) => {
      const ff = dictionaries.fareFamilyWithServices[ab.fareFamilyCode];
      return ff?.cabin === 'business';
    });

    if (econFares.length > 0) {
      output += '\nEconomy Class Options:\n';
      econFares.forEach((fare) => {
        const isRecommended = fare.extraProperties?.isRecommended;
        const isCheapest = fare.isCheapestOffer;
        const price = formatPrice(fare.prices.totalPrice.total, currency);
        const fareFamily = fare.fareFamilyCode;
        const availability = fare.availabilityDetails?.[0];

        if (!availability) {
          return;
        }

        output += `  ${isRecommended ? '[RECOMMENDED] ' : isCheapest ? '[CHEAPEST] ' : ''}${fareFamily}: ${price}`;
        output += ` | Class: ${availability.bookingClass}`;
        if (availability.seatLeft) {
          output += ` | ${availability.seatLeft} seats left`;
        }
        output += `\n     AirBoundID: ${fare.airBoundId}\n`;
      });
    }

    if (busFares.length > 0) {
      output += '\nBusiness Class Options:\n';
      busFares.forEach((fare) => {
        const isRecommended = fare.extraProperties?.isRecommended;
        const price = formatPrice(fare.prices.totalPrice.total, currency);
        const fareFamily = fare.fareFamilyCode;
        const availability = fare.availabilityDetails?.[0];

        if (!availability) {
          return;
        }

        output += `  ${isRecommended ? '[RECOMMENDED] ' : ''}${fareFamily}: ${price}`;
        output += ` | Class: ${availability.bookingClass}`;
        if (availability.seatLeft) {
          output += ` | ${availability.seatLeft} seats left`;
        }
        output += `\n     AirBoundID: ${fare.airBoundId}\n`;
      });
    }

    output += '\n' + '-'.repeat(80) + '\n\n';
  });

  output += 'To select a flight, use the create_cart tool with the desired AirBoundID(s)\n';

  return output;
}
