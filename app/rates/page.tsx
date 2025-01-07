"use client";

import { useEffect, useState } from "react";
import { getAssets, CryptoData } from "@/lib/api";
import RealTimePriceUpdater from "@/lib/RealTimePriceUpdater";
import CryptoRow from "@/components/CryptoRow";
import LoadingSpinner from "./loading";

interface TableHeaderProps {
  label: string;
  className?: string;
}

// Component for rendering a single table header
const TableHeader = ({ label, className = "" }: TableHeaderProps) => (
  <div className={`font-semibold ${className}`}>{label}</div>
);

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// Component for the search bar input
const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="mb-6">
    <input
      type="text"
      placeholder="Search cryptocurrencies..."
      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

interface TableHeadersProps {
  headers: {
    label: string;
    className?: string;
  }[];
}

// Component for rendering the table headers
const TableHeaders = ({ headers }: TableHeadersProps) => (
  <div className="grid grid-cols-7 bg-lightBg text-gray-600 dark:bg-gray-800 dark:text-gray-300 text-sm py-2 px-6 rounded-t-lg shadow min-w-[700px]">
    {headers.map((header, index) => (
      <TableHeader
        key={index}
        label={header.label}
        className={header.className}
      />
    ))}
  </div>
);

// Configuration for table headers
const HEADERS = [
  { label: "Name", className: "md:col-span-2" },
  { label: "Price", className: "text-right" },
  { label: "24h Change", className: "text-right" },
  { label: "24h Volume", className: "col-span-2 md:col-span-1 text-right" },
  { label: "Market Cap", className: "text-right invisible md:visible" },
  { label: "Actions", className: "text-right" },
];

// Custom hook for fetching and managing cryptocurrency data
const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]); // State to store fetched data
  const [error, setError] = useState<string | null>(null); // State to store error messages
  const [isLoading, setIsLoading] = useState(true); // State to manage loading spinner

  // Fetch cryptocurrency data from the API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAssets();
      // Format the fetched data
      const formattedData = data.data.map((crypto: any) => ({
        ...crypto,
        prevPriceUsd: crypto.priceUsd,
        priceChange: "none",
      }));
      setCryptoData(formattedData);
    } catch (err) {
      // Handle errors during data fetching
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data."
      );
    } finally {
      setIsLoading(false); // Stop the loading spinner
    }
  };

  // Handle real-time price updates
  const handlePriceUpdate = (prices: Record<string, string>) => {
    setCryptoData((prevData) =>
      prevData.map((crypto) => {
        const currentPrice = prices[crypto.id] || crypto.priceUsd;
        const priceChange =
          parseFloat(currentPrice) > parseFloat(crypto.prevPriceUsd)
            ? "up"
            : parseFloat(currentPrice) < parseFloat(crypto.prevPriceUsd)
            ? "down"
            : "none";

        return {
          ...crypto,
          priceUsd: currentPrice,
          prevPriceUsd: crypto.priceUsd,
          priceChange,
        };
      })
    );
  };

  return { cryptoData, error, isLoading, fetchData, handlePriceUpdate };
};

// Main component for the Rates Page
export default function RatesPage() {
  const { cryptoData, error, isLoading, fetchData, handlePriceUpdate } =
    useCryptoData(); // Fetching data using custom hook
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for the search input

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter cryptocurrency data based on the search term
  const filteredCryptoData = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render error message if there's an error
  if (error) {
    return (
      <main className="p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Crypto Rates</h1>
        <div className="text-red-500 bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          Error: {error}
        </div>
      </main>
    );
  }

  // Show loading spinner if data is still being fetched
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="flex flex-col p-6 min-h-screen max-w-7xl mx-auto gap-4">
      <h1 className="text-3xl font-bold my-10">
        Top Tokens by Market Capitalization
      </h1>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <div className="overflow-x-auto">
        {/* Table Headers */}
        <TableHeaders headers={HEADERS} />

        {/* Table Rows */}
        <div className="flex flex-col gap-2 min-w-[700px]">
          {filteredCryptoData.length > 0 ? (
            filteredCryptoData.map((crypto) => (
              <CryptoRow
                key={crypto.id}
                id={crypto.id}
                symbol={crypto.symbol}
                name={crypto.name}
                priceUsd={crypto.priceUsd}
                prevPriceUsd={crypto.prevPriceUsd}
                changePercent24Hr={crypto.changePercent24Hr}
                volumeUsd24Hr={crypto.volumeUsd24Hr}
                marketCapUsd={crypto.marketCapUsd}
              />
            ))
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No results found.
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Price Updater */}
      <RealTimePriceUpdater
        assetIds={cryptoData.map((crypto) => crypto.id)}
        onPriceUpdate={handlePriceUpdate}
      />
    </main>
  );
}
