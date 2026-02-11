import { AutomationRule } from '../models/game.models';

export const AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'auto_click',
    name: 'Auto-Click',
    description: 'Automatically clicks once every 5 seconds',
    icon: '\uD83D\uDC46',
    epCost: 50,
  },
  {
    id: 'auto_buy',
    name: 'Auto-Buy Building',
    description: 'Buys cheapest affordable building every 30s',
    icon: '\uD83C\uDFD7',
    epCost: 100,
  },
  {
    id: 'auto_pop',
    name: 'Auto-Pop Wrinklers',
    description: 'Pops wrinklers when 10 are present',
    icon: '\uD83D\uDCA5',
    epCost: 75,
  },
  {
    id: 'auto_contract',
    name: 'Auto-Accept Contract',
    description: 'Accepts best available contract automatically',
    icon: '\uD83D\uDCDC',
    epCost: 150,
  },
  {
    id: 'auto_refresh',
    name: 'Auto-Refresh Contracts',
    description: 'Refreshes contract board when all expired',
    icon: '\uD83D\uDD04',
    epCost: 200,
  },
  {
    id: 'auto_sell_stock',
    name: 'Auto-Sell Stocks',
    description: 'Sells stocks when profit exceeds 50%',
    icon: '\uD83D\uDCC8',
    epCost: 250,
  },
  {
    id: 'auto_research',
    name: 'Auto-Start Research',
    description: 'Starts cheapest available research node',
    icon: '\uD83D\uDD2C',
    epCost: 300,
  },
  {
    id: 'auto_pledge',
    name: 'Auto-Pledge Delay',
    description: 'Pledges order when Great Delay reaches stage 2+',
    icon: '\uD83D\uDCDC',
    epCost: 400,
  },
];
