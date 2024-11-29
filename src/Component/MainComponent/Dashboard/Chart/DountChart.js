import { Tune } from "@mui/icons-material";
import React from "react";
import Chart from "react-apexcharts";

const Donut = (props) => {
  const options = {
    chart: {
      type: "donut",
      // width: "100px", // Increase chart width
      // height: "100px", // Increase chart height
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
      labels: ["Motor", "Fire", "Helth", "Marine", "Group"], // Labels for the series
  
    legend: {
      show: false, // Disable the legend
    },
    tooltip: {
      enabled: Tune, // Disable the tooltip
    },
    dataLabels: {
      enabled: false, // Disable data labels inside the chart
    },

    dataLabels: {
      enabled: true, // Enable data labels inside the chart
      style: {
        colors: ["black", "black", "black", "black", "black"], // Colors for each label
        fontSize: "14px",
        fontWeight: "300",
      },
      formatter: function (val, opts) {
        return opts.w.globals.labels[opts.seriesIndex]; // Show the label for each slice
      },
    },

    plotOptions: {
      pie: {
        donut: {
          size: "50%", // Adjust this value to increase or decrease the donut radius
        },
      },
    },

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

  const series = [44, 55, 41, 17, 15]; // Data for the chart

  return (
    <div id="chart">
      <Chart options={options} series={series} type="donut" width={240} />
    </div>
  );
};
export default Donut;
