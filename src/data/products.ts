export interface PricingTier {
  id: string;
  label: string;
  price: string;
  duration: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  type: 'free' | 'paid';
  price?: string;
  priceRange?: string;
  pricingTiers?: PricingTier[];
  description: string;
  thumbnail: string;
  features: string[];
  specs: {
    markets: string;
    timeframes: string;
    alerts: string;
  };
}

export const products: Product[] = [
  {
    id: '1',
    name: '4 Moving Average',
    slug: '4-moving-average',
    type: 'free',
    description: 'Four customizable moving averages for trend analysis and confirmation',
    thumbnail: 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/4ma-3-e1653501302698.png',
    features: [
      '4 customizable moving averages',
      'Multiple MA types (SMA, EMA, WMA)',
      'Color-coded trend identification',
      'Real-time chart overlay',
      'Zero lag indicator',
      'Works on all timeframes'
    ],
    specs: {
      markets: 'All Markets (Stocks, Futures, Forex, Crypto)',
      timeframes: 'All Timeframes',
      alerts: 'MA Crossover Alerts'
    }
  },
  {
    id: '2',
    name: 'Average Range Indicator',
    slug: 'average-range-indicator',
    type: 'free',
    description: 'Measure price volatility and average candle range for better position sizing',
    thumbnail: 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/TVSMOTOR_2022-04-15_14-37-38-e1653501128906.png',
    features: [
      'Calculate average candle range',
      'Volatility measurement',
      'Position sizing helper',
      'Multi-timeframe support',
      'Custom period settings',
      'Percentage & points display'
    ],
    specs: {
      markets: 'All Markets',
      timeframes: 'All Timeframes',
      alerts: 'Volatility Expansion Alerts'
    }
  },
  {
    id: '3',
    name: 'GAP Candle Indicator',
    slug: 'gap-candle-indicator',
    type: 'free',
    description: 'Automatically detect and mark price gaps for trading opportunities',
    thumbnail: 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/BANKNIFTY1_2022-04-15_15-47-34-e1653500707156.png',
    features: [
      'Auto gap detection',
      'Gap fill tracking',
      'Visual gap zones',
      'Bullish & bearish gaps',
      'Historical gap analysis',
      'Alert on gap formation'
    ],
    specs: {
      markets: 'Stocks, Index Futures',
      timeframes: 'Daily, Weekly',
      alerts: 'Gap Formation & Fill Alerts'
    }
  },
  {
    id: '4',
    name: 'Market Profile Indicator',
    slug: 'market-profile-indicator',
    type: 'paid',
    priceRange: '₹699 – ₹39,999',
    price: '₹699',
    pricingTiers: [
      { id: '30d', label: '30 Days Subscription', price: '₹699', duration: '30 days' },
      { id: '1y', label: '1 Year Subscription', price: '₹2,199', duration: '1 year' },
      { id: '3y', label: '3 Year Subscription', price: '₹4,999', duration: '3 years' },
      { id: '5y', label: '5 Year Subscription', price: '₹9,999', duration: '5 years' },
      { id: 'lifetime', label: 'Lifetime Subscription', price: '₹39,999', duration: 'Lifetime' }
    ],
    description: 'Professional Market Profile with TPO, volume profile and value areas',
    thumbnail: 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/BANKNIFTY1_2022-04-15_11-13-00-2-e1653502124325.png',
    features: [
      'TPO & Volume Profile',
      'Value Area (VA) calculation',
      'Point of Control (POC)',
      'Initial Balance detection',
      'Session analysis tools',
      'Multiple profile types'
    ],
    specs: {
      markets: 'All Markets',
      timeframes: 'Intraday & Daily',
      alerts: 'VA Break & POC Touch Alerts'
    }
  },
  {
    id: '5',
    name: 'Virgin & Narrow CPR with D/W/M CPR',
    slug: 'virgin-cpr-dwm',
    type: 'paid',
    priceRange: '₹699 – ₹49,999',
    price: '₹699',
    pricingTiers: [
      { id: '30d', label: '30 Days Subscription', price: '₹699', duration: '30 days' },
      { id: '1y', label: '1 Year Subscription', price: '₹2,999', duration: '1 year' },
      { id: '3y', label: '3 Year Subscription', price: '₹9,999', duration: '3 years' },
      { id: '5y', label: '5 Year Subscription', price: '₹19,999', duration: '5 years' },
      { id: 'lifetime', label: 'Lifetime Subscription', price: '₹49,999', duration: 'Lifetime' }
    ],
    description: 'Central Pivot Range with virgin & narrow CPR detection across timeframes',
    thumbnail: 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/Screenshot-202-3-e1657633940625.png',
    features: [
      'Virgin CPR identification',
      'Narrow CPR detection',
      'Daily/Weekly/Monthly CPR',
      'Support & resistance levels',
      'Trending day signals',
      'Reversal zone alerts'
    ],
    specs: {
      markets: 'All Markets',
      timeframes: 'All Timeframes',
      alerts: 'CPR Break & Virgin CPR Alerts'
    }
  },
  {
    id: '6',
    name: 'Virgin CPR',
    slug: 'virgin-cpr',
    type: 'paid',
    priceRange: '₹499 – ₹44,999',
    price: '₹499',
    pricingTiers: [
      { id: '30d', label: '30 Days Subscription', price: '₹499', duration: '30 days' },
      { id: '1y', label: '1 Year Subscription', price: '₹2,499', duration: '1 year' },
      { id: '3y', label: '3 Year Subscription', price: '₹8,999', duration: '3 years' },
      { id: '5y', label: '5 Year Subscription', price: '₹17,999', duration: '5 years' },
      { id: 'lifetime', label: 'Lifetime Subscription', price: '₹44,999', duration: 'Lifetime' }
    ],
    description: 'Identify untested Central Pivot Range zones for high-probability trades',
    thumbnail: 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/07/Screenshot-201-e1657647302449.png',
    features: [
      'Virgin CPR detection',
      'Auto support/resistance',
      'Breakout signals',
      'Multi-day analysis',
      'Backtesting capability',
      'Clear visual markers'
    ],
    specs: {
      markets: 'All Markets',
      timeframes: 'Daily & Intraday',
      alerts: 'Virgin CPR Test Alerts'
    }
  },
  {
    id: '7',
    name: 'VSA with Smart Volume',
    slug: 'vsa-smart-volume',
    type: 'paid',
    priceRange: '₹699 – ₹59,999',
    price: '₹699',
    pricingTiers: [
      { id: '30d', label: '30 Days Subscription', price: '₹699', duration: '30 days' },
      { id: '1y', label: '1 Year Subscription', price: '₹3,999', duration: '1 year' },
      { id: '3y', label: '3 Year Subscription', price: '₹14,999', duration: '3 years' },
      { id: '5y', label: '5 Year Subscription', price: '₹29,999', duration: '5 years' },
      { id: 'lifetime', label: 'Lifetime Subscription', price: '₹59,999', duration: 'Lifetime' }
    ],
    description: 'Volume Spread Analysis with smart money detection and volume anomalies',
    thumbnail: 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/BANKNIFTY1_2022-04-15_10-34-13-3-e1653501385447.png',
    features: [
      'Smart money tracking',
      'Volume spread analysis',
      'Effort vs result detection',
      'Accumulation/distribution zones',
      'No demand & supply bars',
      'Institutional activity alerts'
    ],
    specs: {
      markets: 'All Markets',
      timeframes: 'All Timeframes',
      alerts: 'Smart Money & Volume Anomaly Alerts'
    }
  },
  {
    id: '8',
    name: 'Auto Demand & Supply Strategy Indicator',
    slug: 'demand-supply-zone',
    type: 'paid',
    priceRange: '₹699 – ₹59,999',
    price: '₹699',
    pricingTiers: [
      { id: '30d', label: '30 Days Subscription', price: '₹699', duration: '30 days' },
      { id: '1y', label: '1 Year Subscription', price: '₹3,999', duration: '1 year' },
      { id: '3y', label: '3 Year Subscription', price: '₹14,999', duration: '3 years' },
      { id: '5y', label: '5 Year Subscription', price: '₹29,999', duration: '5 years' },
      { id: 'lifetime', label: 'Lifetime Subscription', price: '₹59,999', duration: 'Lifetime' }
    ],
    description: 'Automated supply and demand zone detection with Smart Money Concepts',
    thumbnail: 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/ACC_2022-04-11_15-14-25_df3ea-1-e1653499999813.png',
    features: [
      'Auto S/D zone detection',
      'Smart Money Concepts (SMC)',
      'Order block identification',
      'Fair value gaps',
      'Imbalance detection',
      'Entry/exit signals'
    ],
    specs: {
      markets: 'All Markets',
      timeframes: 'All Timeframes',
      alerts: 'Zone Touch & Break Alerts'
    }
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getFreeProducts = (): Product[] => {
  return products.filter(p => p.type === 'free');
};

export const getPaidProducts = (): Product[] => {
  return products.filter(p => p.type === 'paid');
};
