
import { cn } from "@/lib/utils";
import { TreeDeciduous } from "lucide-react";

interface TreeCountDisplayProps {
  count: number;
  degradation: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

const TreeCountDisplay = ({ count, degradation, className }: TreeCountDisplayProps) => {
  // Format tree count with commas
  const formattedCount = count.toLocaleString();
  
  // Degradation message based on level
  const degradationMessages = {
    low: "Healthy forest ecosystem",
    medium: "Some forest degradation",
    high: "Significant forest loss",
    critical: "Critical deforestation"
  };
  
  // Tree icon count based on degradation level
  const treeIconCount = {
    low: 5,
    medium: 3,
    high: 2,
    critical: 1
  };
  
  return (
    <div className={cn("eco-card", className)}>
      <h3 className="text-lg font-medium mb-2">Tree Population</h3>
      
      <div className="flex flex-col items-center">
        <div className="flex mb-2">
          {Array.from({ length: treeIconCount[degradation] }).map((_, i) => (
            <TreeDeciduous 
              key={i}
              size={28} 
              className={cn(
                "mx-1 animate-pulse-opacity", 
                `degradation-${degradation}`
              )} 
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        <div className="text-4xl font-bold animate-count-up">
          {formattedCount}
        </div>
        
        <div className={cn(
          "mt-2 text-sm font-medium px-3 py-1 rounded-full",
          degradation === 'low' && "bg-eco-green/20 text-eco-green-dark",
          degradation === 'medium' && "bg-eco-alert-low/20 text-eco-alert-low",
          degradation === 'high' && "bg-eco-alert-medium/20 text-eco-alert-medium",
          degradation === 'critical' && "bg-eco-alert-high/20 text-eco-alert-high"
        )}>
          {degradationMessages[degradation]}
        </div>
      </div>
    </div>
  );
};

export default TreeCountDisplay;
