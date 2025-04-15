
import { cn } from "@/lib/utils";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  ArrowUp, 
  ArrowDown, 
  Minus 
} from "lucide-react";
import { metricUnits } from "@/utils/mockData";

interface MetricCardProps {
  title: string;
  value: number;
  previousValue: number;
  type: 'temperature' | 'humidity' | 'airQuality';
  className?: string;
}

const MetricCard = ({ title, value, previousValue, type, className }: MetricCardProps) => {
  // Calculate the percentage change
  const percentChange = previousValue 
    ? ((value - previousValue) / previousValue) * 100 
    : 0;
  
  // Determine if the trend is up, down, or stable
  const trend = Math.abs(percentChange) < 0.5 
    ? 'stable' 
    : percentChange > 0 
      ? 'up' 
      : 'down';
  
  // Determine if the trend is good or bad based on metric type
  const isBadTrend = 
    (type === 'temperature' && trend === 'up') ||
    (type === 'humidity' && trend === 'down') ||
    (type === 'airQuality' && trend === 'up');
  
  return (
    <div className={cn("eco-card", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="p-2 rounded-full bg-secondary">
          {type === 'temperature' && <Thermometer size={18} className="text-eco-alert-high" />}
          {type === 'humidity' && <Droplets size={18} className="text-eco-blue" />}
          {type === 'airQuality' && <Wind size={18} className="text-muted-foreground" />}
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">
            {value}{metricUnits[type]}
          </span>
          
          <div className={cn(
            "flex items-center text-sm pb-1",
            isBadTrend ? "text-eco-alert-high" : "text-eco-green",
            trend === 'stable' && "text-muted-foreground"
          )}>
            {trend === 'up' && <ArrowUp size={16} className="mr-1" />}
            {trend === 'down' && <ArrowDown size={16} className="mr-1" />}
            {trend === 'stable' && <Minus size={16} className="mr-1" />}
            <span>{Math.abs(percentChange).toFixed(1)}%</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-1">
          From previous {previousValue}{metricUnits[type]}
        </p>
      </div>
    </div>
  );
};

export default MetricCard;
