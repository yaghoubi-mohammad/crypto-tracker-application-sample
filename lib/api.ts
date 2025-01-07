// Base URL for the API
const BASE_URL = "https://api.coincap.io/v2";

// Type definition for an individual asset
export type Asset = {
  id: string; // Unique identifier for the asset
  rank: string; // Ranking of the asset by market cap
  symbol: string; // Short symbol (e.g., BTC for Bitcoin)
  name: string; // Full name of the asset
  priceUsd: string; // Current price in USD
  changePercent24Hr: string; // 24-hour price change percentage
  marketCapUsd: string; // Market capitalization in USD
  volumeUsd24Hr: string; // 24-hour trading volume in USD
};

// Response type for fetching multiple assets
export type AssetsResponse = {
  data: Asset[]; // List of assets
  timestamp: number; // Timestamp of the response
};

// Type definition for details of a single asset
export type AssetDetails = {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  supply: string; // Total supply of the asset
  maxSupply: string; // Maximum supply (if applicable)
};

// Type definition for the price history of an asset
export type AssetHistory = {
  priceUsd: string; // Price at a specific time
  time: number; // Timestamp of the price
}[];

// Type definition for enriched crypto data (with additional properties)
export type CryptoData = {
  id: string;
  rank: string;
  name: string;
  symbol: string;
  priceUsd: string;
  prevPriceUsd: string; // Previous price for tracking changes
  marketCapUsd: string;
  volumeUsd24Hr: string;
  changePercent24Hr: "up" | "down" | "none"; // Direction of price change
};

// Fetch the list of assets from the API
export const getAssets = async (): Promise<AssetsResponse> => {
  const res = await fetch(`${BASE_URL}/assets`);
  if (!res.ok) {
    throw new Error("Failed to fetch assets"); // Handle HTTP errors
  }
  return res.json(); // Return parsed JSON data
};

// Fetch details of a specific asset by ID
export const getAsset = async (id: string): Promise<{ data: AssetDetails }> => {
  const res = await fetch(`${BASE_URL}/assets/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch asset with ID ${id}`); // Handle errors for specific asset
  }
  return res.json(); // Return parsed JSON data
};

// Fetch price history of an asset with a specified interval
export async function getAssetHistory(assetId: string, interval: string) {
  const response = await fetch(
    `${BASE_URL}/assets/${assetId}/history?interval=${interval}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`); // Handle errors
  }
  return response.json(); // Return parsed JSON data
}
