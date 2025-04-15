
import React from "react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from "chart.js";
import { Line } from "react-chartjs-2";
import { cn } from "@/lib/utils";
import { chartColors, metricUnits } from "@/utils/mockData";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EnvironmentalChartProps {
  data: {
    timestamps: string[];
    metrics: Record<string, number[]>;
  };
  title?: string;
  activeMetrics: ('temperature' | 'humidity' | 'airQuality')[];
  className?: string;
}

const EnvironmentalChart = ({ 
  data, 
  title = "Environmental Metrics", 
  activeMetrics, 
  className 
}: EnvironmentalChartProps) => {
  
  // Format timestamps for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const chartData = {
    labels: data.timestamps.map(formatTimestamp),
    datasets: activeMetrics.map(metric => ({
      label: metric.charAt(0).toUpperCase() + metric.slice(1),
      data: data.metrics[metric],
      borderColor: chartColors[metric as keyof typeof chartColors],
      backgroundColor: `${chartColors[metric as keyof typeof chartColors]}33`,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.3,
      fill: false,
      yAxisID: metric === 'airQuality' ? 'y1' : 'y'
    }))
  };
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: `Temperature (${metricUnits.temperature}) / Humidity (${metricUnits.humidity})`,
          font: {
            size: 12
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: `Air Quality (${metricUnits.airQuality})`,
          font: {
            size: 12
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const metricType = activeMetrics.find(m => 
              m.charAt(0).toUpperCase() + m.slice(1) === label
            );
            const unit = metricType ? metricUnits[metricType] : '';
            return `${label}: ${value}${unit}`;
          }
        }
      }
    },
  };
  
  return (
    <div className={cn("chart-container", className)}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EnvironmentalChart;
