"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatBigNumber, formatPrice } from "@/utils/formatters";

// Props for individual cryptocurrency row
interface CryptoRowProps {
  id: string; // Cryptocurrency ID
  symbol: string; // Symbol of the cryptocurrency (e.g., BTC, ETH)
  name: string; // Name of the cryptocurrency (e.g., Bitcoin)
  priceUsd: string; // Current price in USD
  prevPriceUsd: string; // Previous price in USD
  changePercent24Hr: string; // 24-hour percentage change
  volumeUsd24Hr: string; // 24-hour trading volume in USD
  marketCapUsd: string; // Market capitalization in USD
}

// Props for the price display component
interface PriceDisplayProps {
  price: string; // Price to display
  className?: string; // Additional CSS classes
}

// Props for the cryptocurrency icon component
interface CryptoIconProps {
  symbol: string; // Cryptocurrency symbol
  name: string; // Cryptocurrency name
  size?: "sm" | "md"; // Icon size
}

// Custom hook for managing the cryptocurrency icon URL
const useIconUrl = (symbol: string) => {
  const [iconUrl, setIconUrl] = useState<string>(
    `/icons/${symbol.toLowerCase()}.svg`
  );

  useEffect(() => {
    // Check if the icon exists
    const checkIcon = async () => {
      try {
        const response = await fetch(iconUrl);
        if (!response.ok) {
          setIconUrl("/CoinFlip.png"); // Fallback to default icon
        }
      } catch {
        setIconUrl("/CoinFlip.png");
      }
    };

    checkIcon();
  }, [symbol]);

  return { iconUrl, setIconUrl };
};

// Custom hook for determining price change direction
const usePriceChange = (currentPrice: string, previousPrice: string) => {
  const [priceClass, setPriceClass] = useState<string>("");

  useEffect(() => {
    const current = parseFloat(currentPrice);
    const previous = parseFloat(previousPrice);

    // Determine if the price has gone up or down
    if (current !== previous) {
      setPriceClass(current > previous ? "flash-green" : "flash-red");

      // Reset the class after 1 second
      const timeout = setTimeout(() => setPriceClass(""), 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentPrice, previousPrice]);

  return priceClass;
};

// Component for displaying the price with animation
const PriceDisplay = ({ price, className = "" }: PriceDisplayProps) => (
  <div className={`text-right text-gray-800 dark:text-gray-200 ${className}`}>
    {formatPrice(price)}
  </div>
);

// Component for rendering the cryptocurrency icon
const CryptoIcon = ({ symbol, name, size = "md" }: CryptoIconProps) => {
  const { iconUrl, setIconUrl } = useIconUrl(symbol);
  const sizeClasses = size === "sm" ? "w-5 h-5" : "w-8 h-8";

  return (
    <div className={`relative ${sizeClasses}`}>
      <Image
        src={iconUrl}
        alt={`${name} icon`}
        fill
        className="object-contain"
        onError={() => setIconUrl("/CoinFlip.png")} // Fallback to default icon
      />
    </div>
  );
};

// Component for rendering the details button
const DetailsButton = ({ id }: { id: string }) => (
  <Link
    href={`/rates/${id}`}
    className="bg-blue-500 bg-opacity-20 hover:bg-opacity-30 
      text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-all"
    onClick={(e) => e.stopPropagation()} // Prevent row click from navigating
  >
    Details
  </Link>
);

// Main component for rendering a cryptocurrency row
export default function CryptoRow({
  id,
  symbol,
  name,
  priceUsd,
  prevPriceUsd,
  changePercent24Hr,
  volumeUsd24Hr,
  marketCapUsd,
}: CryptoRowProps) {
  const priceClass = usePriceChange(priceUsd, prevPriceUsd);

  return (
    <Link
      href={`/rates/${id}`}
      className="grid grid-cols-7 items-center py-4 px-6 border-b
        border-gray-300 dark:border-gray-800 group hover:bg-gray-100 
        dark:hover:bg-gray-800 hover:rounded-lg transition-all cursor-pointer"
    >
      {/* Icon and Name Section */}
      <div className="flex items-center gap-2 md:col-span-2">
        <CryptoIcon
          symbol={symbol}
          name={name}
          size={window?.innerWidth < 768 ? "sm" : "md"} // Adjust size based on screen width
        />
        <div>
          <div className="md:font-bold text-gray-800 dark:text-gray-200 text-sm">
            {symbol}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{name}</div>
        </div>
      </div>

      {/* Price Section */}
      <PriceDisplay price={priceUsd} className={priceClass} />

      {/* Change Percent (24Hr) */}
      <div
        className={`font-semibold text-right ${
          parseFloat(changePercent24Hr) < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        {`${parseFloat(changePercent24Hr).toFixed(2)}%`}
      </div>

      {/* Volume Section */}
      <div className="col-span-2 md:col-span-1 text-right text-gray-800 dark:text-gray-200">
        {formatBigNumber(volumeUsd24Hr)}
      </div>

      {/* Market Cap Section */}
      <div className="text-right text-gray-800 dark:text-gray-200 invisible md:visible">
        {formatBigNumber(marketCapUsd)}
      </div>

      {/* Actions Section */}
      <div className="text-right">
        <DetailsButton id={id} />
      </div>
    </Link>
  );
}

// Component for rendering the table container with horizontal scrolling
export function CryptoTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px] md:min-w-full">{children}</div>
    </div>
  );
}
