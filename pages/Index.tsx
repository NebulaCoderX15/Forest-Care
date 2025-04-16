import { useEffect, useState } from 'react';

const Dashboard = () => {
  // State to hold the fetched data
  const [data, setData] = useState<any>(null);

  // Fetch data from the server when the component mounts
  useEffect(() => {
    // Function to fetch data from the server
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.239.104:3000/api/data'); // Replace with your actual server IP
        if (response.ok) {
          const result = await response.json();
          setData(result); // Set the fetched data to the state
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-4">Environmental Data Dashboard</h1>
      
      {data ? (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Temperature: {data.temperature} °C</h2>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Humidity: {data.humidity} %</h2>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Air Quality: {data.air_quality} AQI</h2>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Dashboard;
