import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = () => {
  const options = {
    chart: {
      type: 'bar',
      height: 200,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 5,
        opacity: 0.1
      }
    },
    title: {
      text: 'Monthly Performance Overview',
      align: 'left',
      offsetY: 0, // Reduced offset
      style: {
        fontSize: '16px', // Slightly smaller font
        fontWeight: '700',
        color: '#2c3e50',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%', // Increased column width for thicker bars
        borderRadius: 4,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1.5,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      labels: {
        style: {
          colors: '#718096',
          fontSize: '11px', // Slightly smaller font
          fontWeight: '500',
          fontFamily: "'Inter', 'Segoe UI', sans-serif"
        }
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Values',
        style: {
          color: '#718096',
          fontSize: '11px', // Slightly smaller font
          fontWeight: '500',
          fontFamily: "'Inter', 'Segoe UI', sans-serif"
        }
      },
      labels: {
        style: {
          colors: '#718096',
          fontSize: '11px', // Slightly smaller font
          fontWeight: '500',
          fontFamily: "'Inter', 'Segoe UI', sans-serif"
        }
      }
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.2,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    colors: ['#6a38b9', '#8e44ad', '#2e86de', '#00bd9d'],
    grid: {
      borderColor: '#f1f3f9',
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: -20, // Reduced padding to increase bar height
        right: 0,
        bottom: -10,
        left: 0
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -5, // Moved legend closer to title
      fontSize: '12px', // Slightly smaller font
      itemMargin: {
        horizontal: 10,
        vertical: 5
      },
      markers: {
        width: 10,
        height: 10,
        radius: 5
      },
      labels: {
        colors: '#2c3e50',
        useSeriesColors: false
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      },
      y: {
        formatter: function(val) {
          return val
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '50%'
          }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          offsetY: 0
        }
      }
    }]
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
    {
      name: 'Expense',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      padding: '20px', // Reduced padding
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <ReactApexChart 
        options={options} 
        series={series} 
        type="bar" 
        height={200} 
      />
    </div>
  );
};

export default BarChart;