const PAST_HOURS = [
  24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0
];

// Generate a timestamp for each hour
export const generateTimestamps = () => {
  const now = new Date();
  return PAST_HOURS.map(hours => {
    const date = new Date(now);
    date.setHours(now.getHours() - hours);
    return date.toISOString();
  });
};

// Generate random values with a trend
const generateTrendingValues = (
  min: number, 
  max: number, 
  count: number, 
  trend: 'up' | 'down' | 'stable' = 'stable',
  volatility: number = 0.2
) => {
  const range = max - min;
  const values = [];
  let currentValue = min + (range / 2);
  
  for (let i = 0; i < count; i++) {
    // Add trend component
    if (trend === 'up') {
      currentValue += (range * 0.05);
    } else if (trend === 'down') {
      currentValue -= (range * 0.05);
    }
    
    // Add random noise
    const noise = (Math.random() - 0.5) * range * volatility;
    currentValue += noise;
    
    // Keep within bounds
    currentValue = Math.max(min, Math.min(max, currentValue));
    
    values.push(Number(currentValue.toFixed(1)));
  }
  
  return values;
};

// Calculate tree count based on environmental factors
export const calculateTreeCount = (
  temperature: number[], 
  humidity: number[], 
  airQuality: number[]
): number => {
  // A simplistic model where higher temperatures, lower humidity, and worse air quality reduce tree count
  const avgTemp = temperature.reduce((sum, val) => sum + val, 0) / temperature.length;
  const avgHumidity = humidity.reduce((sum, val) => sum + val, 0) / humidity.length;
  const avgAirQuality = airQuality.reduce((sum, val) => sum + val, 0) / airQuality.length;
  
  // Base count: 10,000 trees
  let treeCount = 10000;
  
  // Temperature impact: reduce trees as temperature goes up
  const tempImpact = (avgTemp - 15) * 100;
  treeCount -= tempImpact;
  
  // Humidity impact: reduce trees as humidity goes down
  const humidityImpact = (60 - avgHumidity) * 50;
  treeCount -= humidityImpact;
  
  // Air quality impact: reduce trees as air quality gets worse (higher values are worse)
  const airQualityImpact = avgAirQuality * 20;
  treeCount -= airQualityImpact;
  
  return Math.max(0, Math.round(treeCount));
};

// Calculate environment degradation level
export const calculateDegradation = (treeCount: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (treeCount > 8000) return 'low';
  if (treeCount > 5000) return 'medium';
  if (treeCount > 2000) return 'high';
  return 'critical';
};

// Generate all sample data
export const generateSampleData = () => {
  const timestamps = generateTimestamps();
  const temperature = generateTrendingValues(15, 35, timestamps.length, 'up', 0.1);
  const humidity = generateTrendingValues(30, 70, timestamps.length, 'down', 0.15);
  const airQuality = generateTrendingValues(10, 100, timestamps.length, 'up', 0.3);
  const treeCount = calculateTreeCount(temperature, humidity, airQuality);
  const degradation = calculateDegradation(treeCount);
  
  return {
    timestamps,
    metrics: {
      temperature,
      humidity,
      airQuality
    },
    treeCount,
    degradation
  };
};

// Units for metrics
export const metricUnits = {
  temperature: '°C',
  humidity: '%',
  airQuality: 'AQI'
};

// Color mapping for chart lines
export const chartColors = {
  temperature: '#ef4444',  // red
  humidity: '#0ea5e9',     // blue
  airQuality: '#a3a3a3'    // gray
};

// Initial data
export const initialData = generateSampleData();
