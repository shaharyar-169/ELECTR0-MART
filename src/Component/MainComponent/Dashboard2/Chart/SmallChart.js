import { Tune } from "@mui/icons-material";
import React from "react";
import Chart from "react-apexcharts";

const Donut1 = (props) => {
  const options = {
    chart: {
      type: "donut",
      
    },
    title: {
      text: props.title, // Add your desired heading
      align: 'center', // Align the heading to the top-left
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: 'black',
      
      }
     },
  
      

    plotOptions: {
      pie: {
        donut: {
          size: "65%", // Adjust this value to increase or decrease the donut radius
        },
      },
    },
    legend: {
        show: false, // Hide the series labels
      },
      dataLabels: {
        enabled: false, // Disable percentage labels on the chart
      },
    colors: ["#1E90FF", "#FE5353"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300, // Adjust for smaller screens
            height: 300,
          },
        },
      },
    ],
  };

  const series = [50, 50]; // Data for the chart

  return (
    <div id="chart">
      <Chart options={options} series={series} type="donut" width={180} />
    </div>
  );
};
export default Donut1;
