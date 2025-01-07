"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@/context/ThemeContext"; // Import the theme context

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CryptoChartProps {
  history: {
    priceUsd: string;
    time: number;
  }[];
  interval: string;
}

export default function CryptoChart({ history, interval }: CryptoChartProps) {
  const { theme } = useTheme(); // Access theme from context

  // Prepare the data for the chart
  const data = {
    labels: history.map((item) =>
      ["m1", "m5", "m15", "m30", "h1", "h2", "h6", "h12"].includes(interval)
        ? new Date(item.time).toLocaleTimeString()
        : new Date(item.time).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Price (USD)",
        data: history.map((item) => parseFloat(item.priceUsd)),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === "dark" ? "#ffffff" : "#000000", // Dynamic color based on theme
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000", // Dynamic color based on theme
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)", // Dynamic grid color
        },
      },
      y: {
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000", // Dynamic color based on theme
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)", // Dynamic grid color
        },
      },
    },
  };

  return (
    <div
      className="relative w-full"
      style={{
        height: "400px",
        minHeight: "300px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
