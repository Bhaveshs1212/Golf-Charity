import { POOL_PERCENTAGE, PRIZE_SPLITS } from "@/lib/constants";

type PrizeResult = {
  totalPool: number;
  tierPools: { five: number; four: number; three: number };
  prizePerWinner: { five: number; four: number; three: number };
};

export function calculatePrizePool({
  activeUsers,
  subscriptionFee,
  winners,
}: {
  activeUsers: number;
  subscriptionFee: number;
  winners: { five: number; four: number; three: number };
}): PrizeResult {
  const totalPool = activeUsers * subscriptionFee * POOL_PERCENTAGE;
  const tierPools = {
    five: totalPool * PRIZE_SPLITS.five,
    four: totalPool * PRIZE_SPLITS.four,
    three: totalPool * PRIZE_SPLITS.three,
  };
  const prizePerWinner = {
    five: winners.five > 0 ? tierPools.five / winners.five : 0,
    four: winners.four > 0 ? tierPools.four / winners.four : 0,
    three: winners.three > 0 ? tierPools.three / winners.three : 0,
  };

  return { totalPool, tierPools, prizePerWinner };
}
