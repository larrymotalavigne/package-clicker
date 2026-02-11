import { DailyRewardConfig } from '../models/game.models';

export const DAILY_REWARDS: DailyRewardConfig[] = [
  { day: 1, name: 'Welcome Back', icon: '\uD83D\uDCE6', reward: { type: 'ep', value: 5 } },
  { day: 2, name: 'Loyal Courier', icon: '\u2B50', reward: { type: 'ep', value: 10 } },
  { day: 3, name: 'Package Rush', icon: '\uD83D\uDE9A', reward: { type: 'packages', value: 1000 } },
  { day: 4, name: 'Express Bonus', icon: '\u26A1', reward: { type: 'ep', value: 15 } },
  { day: 5, name: 'Golden Day', icon: '\uD83C\uDF1F', reward: { type: 'buff', value: 30000 } },
  { day: 6, name: 'Mega Delivery', icon: '\uD83C\uDF81', reward: { type: 'packages', value: 10000 } },
  { day: 7, name: 'Weekly Jackpot', icon: '\uD83D\uDC51', reward: { type: 'ep', value: 50 } },
];
