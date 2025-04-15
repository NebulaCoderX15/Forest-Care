
import React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface DataTimelineProps {
  timestamps: string[];
  currentIndex: number;
  onSelectPoint: (index: number) => void;
  className?: string;
}

const DataTimeline = ({ 
  timestamps, 
  currentIndex, 
  onSelectPoint, 
  className 
}: DataTimelineProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Only show a subset of timestamps on smaller screens
  const displayTimestamps = timestamps.filter((_, i) => i % 4 === 0 || i === timestamps.length - 1);
  
  return (
    <div className={cn("eco-card", className)}>
      <div className="flex items-center mb-2">
        <Clock size={16} className="mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">Time Series Data</h3>
      </div>
      
      <div className="relative mt-3">
        {/* Timeline line */}
        <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-muted" />
        
        {/* Timeline points */}
        <div className="flex justify-between relative">
          {timestamps.map((timestamp, index) => (
            <button
              key={index}
              onClick={() => onSelectPoint(index)}
              className="relative flex flex-col items-center"
              aria-label={`Select data point at ${formatTimestamp(timestamp)}`}
            >
              <div 
                className={cn(
                  "w-4 h-4 rounded-full z-10 transition-all",
                  index === currentIndex 
                    ? "bg-primary ring-2 ring-primary/30" 
                    : "bg-muted-foreground/50 hover:bg-primary/70"
                )}
              />
              
              {/* Only display some timestamps for space */}
              {(index % 4 === 0 || index === timestamps.length - 1) && (
                <span className="text-xs mt-2 text-muted-foreground whitespace-nowrap">
                  {formatTimestamp(timestamp)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Current: {formatTimestamp(timestamps[currentIndex])}
      </div>
    </div>
  );
};

export default DataTimeline;
