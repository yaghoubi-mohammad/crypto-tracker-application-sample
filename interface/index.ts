export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  supply: string;
  maxSupply: string | null;
}

export interface History {
  priceUsd: string;
  time: number;
}
