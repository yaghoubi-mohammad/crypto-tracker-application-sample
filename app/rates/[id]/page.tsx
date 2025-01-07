"use client";

import { use, useEffect, useState, useRef } from "react";
import { getAsset, getAssetHistory } from "@/lib/api";
import dynamic from "next/dynamic";
import RealTimePriceUpdater from "@/lib/RealTimePriceUpdater";
import { Crypto, History } from "@/interface";
import {
  formatBigNumber,
  formatPrice,
  formatSupply,
  formatVolume,
} from "@/utils/formatters";
import LoadingSpinner from "../loading";

// Dynamically import the CryptoChart component, disabling server-side rendering
const CryptoChart = dynamic(() => import("@/components/CryptoChart"), {
  ssr: false,
});

interface CryptoInfoProps {
  label: string;
  value: string;
  className?: string;
}

// Component for rendering a single piece of cryptocurrency info
const CryptoInfoItem = ({ label, value, className = "" }: CryptoInfoProps) => (
  <p className="flex justify-between text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-800 rounded-lg p-4">
    <span className="font-semibold">{label}:</span>
    <span className={className}>{value}</span>
  </p>
);

// Component for rendering a time interval button
const TimeIntervalButton = ({
  frame,
  currentInterval,
  onClick,
}: {
  frame: string;
  currentInterval: string;
  onClick: (frame: string) => void;
}) => (
  <button
    onClick={() => onClick(frame)}
    className={`p-2 md:rounded-lg ${
      currentInterval === frame
        ? "bg-[#4bbfbf] text-white"
        : "md:bg-lightBg md:dark:bg-gray-800 text-lightText dark:text-gray-300"
    } hover:bg-[#4bbfbf]/50 transition-all`}
  >
    {frame.toUpperCase()}
  </button>
);

// Define the available time intervals for the price history chart
const TIME_INTERVALS = [
  "m1",
  "m5",
  "m15",
  "m30",
  "h1",
  "h2",
  "h6",
  "h12",
  "d1",
];

export default function CryptoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [crypto, setCrypto] = useState<Crypto | null>(null); // Current cryptocurrency data
  const [history, setHistory] = useState<History[] | null>(null); // Historical price data
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentPrice, setCurrentPrice] = useState<string | null>(null); // Real-time price
  const [priceClass, setPriceClass] = useState<string>(""); // CSS class for price updates
  const [interval, setInterval] = useState<string>("d1"); // Default time interval for history

  const prevPriceRef = useRef<string | null>(null); // Reference for the previous price
  const timeoutRef = useRef<NodeJS.Timeout>(); // Reference for timeout used in animations
  const resolvedParams = use(params); // Resolve dynamic parameters from Next.js

  // Fetch the latest cryptocurrency data
  const fetchCryptoData = async () => {
    try {
      const cryptoData = await getAsset(resolvedParams.id);
      setCrypto(cryptoData.data);
      setCurrentPrice(cryptoData.data.priceUsd);
      prevPriceRef.current = cryptoData.data.priceUsd;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    }
  };

  // Fetch historical data for the selected time interval
  const fetchHistoryData = async () => {
    try {
      const historyData = await getAssetHistory(resolvedParams.id, interval);
      const formattedHistory = historyData.data.map(
        (item: { priceUsd: string; time: number }) => ({
          date: new Date(item.time).toISOString(),
          priceUsd: item.priceUsd,
          time: item.time,
        })
      );
      setHistory(formattedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    }
  };

  // Fetch data when component is mounted or dependencies change
  useEffect(() => {
    fetchCryptoData();
    fetchHistoryData();

    // Clear any pending timeouts when the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resolvedParams.id, interval]);

  // Handle real-time price updates
  const handlePriceUpdate = (prices: Record<string, string>) => {
    const newPrice = prices[resolvedParams.id];
    if (!newPrice || !prevPriceRef.current) return;

    setCurrentPrice(newPrice);
    const currentPriceFloat = parseFloat(newPrice);
    const prevPriceFloat = parseFloat(prevPriceRef.current);

    if (currentPriceFloat !== prevPriceFloat) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Apply a flashing animation based on price movement direction
      setPriceClass(
        currentPriceFloat > prevPriceFloat ? "flash-green" : "flash-red"
      );

      // Remove the animation class after 1 second
      timeoutRef.current = setTimeout(() => {
        setPriceClass("");
      }, 1000);

      prevPriceRef.current = newPrice; // Update the previous price reference
    }
  };

  // Render error message if an error occurs
  if (error) {
    return (
      <main className="p-6 min-h-screen bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText">
        <h1 className="text-3xl font-bold mb-6">Crypto Details</h1>
        <div className="text-red-500 bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          Error: {error}
        </div>
      </main>
    );
  }

  // Render loading spinner if data is not yet available
  if (!crypto || !history) {
    return <LoadingSpinner />;
  }

  // Prepare cryptocurrency information for display
  const cryptoInfo = [
    {
      label: "Price",
      value: currentPrice
        ? formatPrice(currentPrice)
        : formatPrice(crypto.priceUsd),
      className: priceClass,
    },
    {
      label: "Change Percent (24Hr)",
      value: `${parseFloat(crypto.changePercent24Hr).toFixed(2)}%`,
      className:
        parseFloat(crypto.changePercent24Hr) < 0
          ? "text-red-500"
          : "text-green-500",
    },
    {
      label: "Market Cap",
      value: formatBigNumber(crypto.marketCapUsd),
    },
    {
      label: "Volume",
      value: formatVolume(crypto.volumeUsd24Hr),
    },
    {
      label: "Supply",
      value: formatSupply(crypto.supply),
    },
    {
      label: "Max Supply",
      value: formatSupply(crypto.maxSupply),
    },
  ];

  return (
    <main className="p-6 min-h-screen bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">
        {crypto.name} ({crypto.symbol})
      </h1>

      {/* Time Interval Buttons */}
      <h2 className="text-xl font-semibold mb-4">Price History</h2>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {TIME_INTERVALS.map((frame) => (
          <TimeIntervalButton
            key={frame}
            frame={frame}
            currentInterval={interval}
            onClick={setInterval}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="md:col-span-2 rounded-lg shadow-lg bg-lightBg dark:bg-darkBg">
          <CryptoChart history={history} interval={interval} />
        </div>

        {/* Info Section */}
        <div className="border border-gray-300 dark:border-gray-800 p-6 rounded-lg shadow-lg bg-lightBg dark:bg-darkBg">
          <h2 className="text-xl font-semibold mb-4">Info</h2>
          <div className="space-y-4">
            {cryptoInfo.map((info, index) => (
              <CryptoInfoItem
                key={index}
                label={info.label}
                value={info.value}
                className={info.className}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Price Updater */}
      <RealTimePriceUpdater
        assetIds={[resolvedParams.id]}
        onPriceUpdate={handlePriceUpdate}
      />
    </main>
  );
}
