import { useEffect, useMemo } from "react";

interface RealTimePriceUpdaterProps {
  assetIds: string[];
  onPriceUpdate: (prices: Record<string, string>) => void;
}

export default function RealTimePriceUpdater({
  assetIds,
  onPriceUpdate,
}: RealTimePriceUpdaterProps) {
  const stableAssetIds = useMemo(() => assetIds.sort().join(","), [assetIds]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://ws.coincap.io/prices?assets=${stableAssetIds}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onPriceUpdate(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {};

    return () => {
      ws.close();
    };
  }, [stableAssetIds, onPriceUpdate]);

  return null;
}
