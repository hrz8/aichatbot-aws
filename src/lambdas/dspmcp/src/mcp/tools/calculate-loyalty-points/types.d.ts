/**
 * Type definitions for calculate-loyalty-points tool
 */

export interface LoyaltyCalculationInput {
  cartId: string;
  fareClass: 'economy' | 'premium_economy' | 'business' | 'first';
  totalPrice: number;
  route: {
    origin: string;
    destination: string;
  };
  membershipTier: 'blue' | 'silver' | 'gold' | 'platinum';
}

export interface LoyaltyCalculationResult {
  basePoints: number;
  bonusPoints: number;
  tierMultiplier: number;
  totalPoints: number;
  breakdown: {
    fareClassBonus: number;
    tierBonus: number;
    routeBonus: number;
  };
}
