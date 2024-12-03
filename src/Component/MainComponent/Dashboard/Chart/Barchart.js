import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = () => {
  const options = {
    chart: {
      type: 'bar',
      height: 200,
    },
    title: {
        text: 'Month-wise Premium', // Add your desired heading
        align: 'left', // Align the heading to the top-left
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'black',
        }
       },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      labels: {
        style: {
          colors: 'black', // Set white color for all categories
          fontSize: '12px', // Optional: Adjust font size
          fontWeight: 'bold', // Optional: Adjust font weight
        },
      },
    },

    yaxis: {
    
      labels: {
        style: {
          colors: 'black', // White color for y-axis labels
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
    },
  
    fill: {
      opacity: 1,
    },

    legend: {
      position: 'top', // Move the legend to the top
      horizontalAlign: 'center',
      labels: {
        colors: 'black', // White color for legend labels
        useSeriesColors: false, // Ensures custom color is applied
      },
    },
    tooltip: {
      theme: 'dark', // Ensures white text on tooltip
    },
  
  };

  const series = [
    {
      name: 'Current Year',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: 'Last Year',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: 'Collection',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={200} width={480} />
   
   
    </div>
  );
};

export default BarChart;
