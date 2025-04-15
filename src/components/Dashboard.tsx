
import React, { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import TreeCountDisplay from "./TreeCountDisplay";
import EnvironmentalChart from "./EnvironmentalChart";
import DataTimeline from "./DataTimeline";
import { generateSampleData, initialData } from "@/utils/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowPathIcon } from "./icons/ArrowPathIcon";

const Dashboard = () => {
  const [data, setData] = useState(initialData);
  const [currentIndex, setCurrentIndex] = useState(data.timestamps.length - 1); // Start with the most recent
  const [activeMetrics, setActiveMetrics] = useState<('temperature' | 'humidity' | 'airQuality')[]>([
    'temperature', 'humidity', 'airQuality'
  ]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  // Handle data point selection
  const handleSelectDataPoint = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Toggle a metric's visibility in the chart
  const toggleMetric = (metric: 'temperature' | 'humidity' | 'airQuality') => {
    if (activeMetrics.includes(metric)) {
      // Don't allow deselecting the last metric
      if (activeMetrics.length > 1) {
        setActiveMetrics(activeMetrics.filter(m => m !== metric));
      }
    } else {
      setActiveMetrics([...activeMetrics, metric]);
    }
  };
  
  // Refresh data manually
  const refreshData = () => {
    const newData = generateSampleData();
    setData(newData);
    setCurrentIndex(newData.timestamps.length - 1);
  };
  
  // Auto refresh on interval
  useEffect(() => {
    let interval: number | null = null;
    
    if (autoRefresh) {
      interval = window.setInterval(() => {
        refreshData();
      }, 10000); // Refresh every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);
  
  // Get current values based on selected index
  const currentValues = {
    temperature: data.metrics.temperature[currentIndex],
    humidity: data.metrics.humidity[currentIndex],
    airQuality: data.metrics.airQuality[currentIndex]
  };
  
  // Get previous values (if available)
  const previousIndex = Math.max(0, currentIndex - 1);
  const previousValues = {
    temperature: data.metrics.temperature[previousIndex],
    humidity: data.metrics.humidity[previousIndex],
    airQuality: data.metrics.airQuality[previousIndex]
  };
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Eco Trend Watcher</h1>
          <p className="text-muted-foreground mt-1">
            Monitor environmental metrics and forest health in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh">Auto Refresh</Label>
          </div>
          
          <button
            onClick={refreshData}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Temperature"
          value={currentValues.temperature}
          previousValue={previousValues.temperature}
          type="temperature"
        />
        <MetricCard
          title="Humidity"
          value={currentValues.humidity}
          previousValue={previousValues.humidity}
          type="humidity"
        />
        <MetricCard
          title="Air Quality"
          value={currentValues.airQuality}
          previousValue={previousValues.airQuality}
          type="airQuality"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="charts" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="metrics">Metrics Controls</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    activeMetrics.includes('temperature') 
                      ? "bg-eco-alert-high/20 text-eco-alert-high" 
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => toggleMetric('temperature')}
                >
                  Temperature
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    activeMetrics.includes('humidity') 
                      ? "bg-eco-blue/20 text-eco-blue" 
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => toggleMetric('humidity')}
                >
                  Humidity
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${
                    activeMetrics.includes('airQuality') 
                      ? "bg-muted-foreground/20 text-muted-foreground" 
                      : "bg-muted text-muted-foreground/50"
                  }`}
                  onClick={() => toggleMetric('airQuality')}
                >
                  Air Quality
                </button>
              </div>
            </div>
            
            <TabsContent value="charts" className="mt-0">
              <EnvironmentalChart 
                data={data} 
                activeMetrics={activeMetrics}
                className="h-[400px]"
              />
            </TabsContent>
            
            <TabsContent value="metrics" className="mt-0">
              <div className="eco-card h-[400px] flex flex-col justify-center items-center">
                <h3 className="text-xl font-medium mb-6">Metric Visibility Controls</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-eco-alert-high/20 mb-2">
                      <span className="text-eco-alert-high font-bold">T</span>
                    </div>
                    <p className="text-sm mb-2">Temperature</p>
                    <Switch
                      checked={activeMetrics.includes('temperature')}
                      onCheckedChange={() => toggleMetric('temperature')}
                      disabled={activeMetrics.length === 1 && activeMetrics.includes('temperature')}
                    />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-eco-blue/20 mb-2">
                      <span className="text-eco-blue font-bold">H</span>
                    </div>
                    <p className="text-sm mb-2">Humidity</p>
                    <Switch
                      checked={activeMetrics.includes('humidity')}
                      onCheckedChange={() => toggleMetric('humidity')}
                      disabled={activeMetrics.length === 1 && activeMetrics.includes('humidity')}
                    />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted mb-2">
                      <span className="text-muted-foreground font-bold">AQ</span>
                    </div>
                    <p className="text-sm mb-2">Air Quality</p>
                    <Switch
                      checked={activeMetrics.includes('airQuality')}
                      onCheckedChange={() => toggleMetric('airQuality')}
                      disabled={activeMetrics.length === 1 && activeMetrics.includes('airQuality')}
                    />
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-8">
                  Toggle metrics to change what's displayed on the chart
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <TreeCountDisplay 
            count={data.treeCount} 
            degradation={data.degradation}
            className="mb-4 h-[192px]"
          />
          
          <div className="eco-card">
            <h3 className="text-lg font-medium mb-2">Environment Health</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Forest Cover</span>
                  <span className={`degradation-${data.degradation}`}>
                    {data.degradation === 'low' ? 'Healthy' :
                     data.degradation === 'medium' ? 'Declining' :
                     data.degradation === 'high' ? 'At Risk' : 'Critical'}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full degradation-${data.degradation}`}
                    style={{ 
                      width: `${data.treeCount / 10000 * 100}%`,
                      opacity: 0.7
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Biodiversity</span>
                  <span className={data.metrics.temperature[currentIndex] > 30 ? "text-eco-alert-high" : "text-eco-green"}>
                    {data.metrics.temperature[currentIndex] > 30 ? 'Declining' : 'Stable'}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={data.metrics.temperature[currentIndex] > 30 ? "bg-eco-alert-high" : "bg-eco-green"}
                    style={{ 
                      width: `${Math.max(0, 100 - (data.metrics.temperature[currentIndex] - 15) * 3)}%`,
                      opacity: 0.7
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Water Resources</span>
                  <span className={data.metrics.humidity[currentIndex] < 40 ? "text-eco-alert-medium" : "text-eco-blue"}>
                    {data.metrics.humidity[currentIndex] < 40 ? 'Low' : 'Adequate'}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={data.metrics.humidity[currentIndex] < 40 ? "bg-eco-alert-medium" : "bg-eco-blue"}
                    style={{ 
                      width: `${data.metrics.humidity[currentIndex]}%`,
                      opacity: 0.7
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DataTimeline
        timestamps={data.timestamps}
        currentIndex={currentIndex}
        onSelectPoint={handleSelectDataPoint}
      />
    </div>
  );
};

export default Dashboard;
