import React, { useEffect, useState } from "react";
import ReactApexChart from 'react-apexcharts';
import { getOrganisationData, getUserData, getYearDescription, getLocationnumber } from "../../../Auth";
import { useTheme } from "../../../../ThemeContext";
import axios from "axios";

const MonthwiseChart = () => {
    const [RestourentDaydata, setRestourentDaydata] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const {
        isSidebarVisible,
        getcolor,
        fontcolor,
        apiLinks,
        getLocationNumber,
        getyeardescription,
        getfontstyle,
        getdatafontsize,
    } = useTheme();

    useEffect(() => {
        const apiUrl = apiLinks + "/ResDashboard.php";
        setIsLoading(true);

        const formData = new URLSearchParams({
            code: 'FDEEK',
            FYerDsc: '2025-2025',
            FLocCod: '001'
        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                if (response.data && typeof response.data === 'object') {
                    setRestourentDaydata(response.data);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data
                    );
                    setRestourentDaydata({});
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setRestourentDaydata({});
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // ✅ Extract MonthWiseGraph data safely
    const monthWise = RestourentDaydata?.MonthWiseGraph || [];

    // ✅ Month names array with full names and short names
    const monthNames = [
        { full: "January", short: "Jan" },
        { full: "February", short: "Feb" },
        { full: "March", short: "Mar" },
        { full: "April", short: "Apr" },
        { full: "May", short: "May" },
        { full: "June", short: "Jun" },
        { full: "July", short: "Jul" },
        { full: "August", short: "Aug" },
        { full: "September", short: "Sep" },
        { full: "October", short: "Oct" },
        { full: "November", short: "Nov" },
        { full: "December", short: "Dec" }
    ];

    // ✅ Convert API data to a lookup object by month number
    const monthLookup = {};
    monthWise.forEach((item) => {
        const monthNum = parseInt(item.Month, 10);
        monthLookup[monthNum] = {
            invoices: parseInt(item.Invoices?.replace(/,/g, "")) || 0,
            sale: parseFloat(item.Sale?.replace(/,/g, "")) || 0,
        };
    });

    // ✅ Build categories with short month names
    const categories = monthNames.map(month => month.short);

    // ✅ Fill series with either API value or 0 for each month
    const series = [
        {
            name: "Invoices",
            data: monthNames.map((_, index) => monthLookup[index + 1]?.invoices || 0),
        },
        {
            name: "Sale",
            data: monthNames.map((_, index) => monthLookup[index + 1]?.sale || 0),
        },
    ];

    // ✅ Extract series values
    const allInvoices = series[0]?.data || [];
    const allSales = series[1]?.data || [];

    // ✅ Calculate averages
    const avgInvoices =
        allInvoices.length > 0
            ? allInvoices.reduce((a, b) => a + b, 0) / allInvoices.length
            : 0;

    const avgSale =
        allSales.length > 0
            ? allSales.reduce((a, b) => a + b, 0) / allSales.length
            : 0;

    const options = {
        chart: {
            type: 'bar',
            width: 'auto',
            height: 230,
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
        // title: {
        //     text: 'Monthly Performance Overview',
        //     align: 'left',
        //     offsetY: 0,
        //     style: {
        //         fontSize: '16px',
        //         fontWeight: '700',
        //         color: '#2c3e50',
        //         fontFamily: "'Inter', 'Segoe UI', sans-serif"
        //     }
        // },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '30%',
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
            categories: categories,
            labels: {
                style: {
                    fontSize: "12px",
                    fontWeight: "600",
                    colors: "#718096",
                    fontFamily: "'Inter', 'Segoe UI', sans-serif"
                }
                // Removed rotation since short names fit better
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#718096',
                    fontSize: '11px',
                    fontWeight: '500',
                    fontFamily: "'Inter', 'Segoe UI', sans-serif"
                },
                formatter: function (value) {
                    // Format large numbers with K, M suffixes
                    if (value >= 1000000) {
                        return (value / 1000000).toFixed(1) + 'M';
                    }
                    if (value >= 1000) {
                        return (value / 1000).toFixed(1) + 'K';
                    }
                    return value;
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
                inverseColors: false,
                opacityFrom: 0.9,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        },
        colors: ['#06B6D4', '#EF4444'],
        grid: {
            borderColor: '#f1f3f9',
            strokeDashArray: 2,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: {
                top: -20,
                right: 0,
                bottom: -10,
                left: 0
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -5,
            fontSize: '12px',
            itemMargin: { horizontal: 25, vertical: 8 },
            markers: { width: 10, height: 10, radius: 5 },
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
            x: {
                formatter: function (value, { seriesIndex, dataPointIndex }) {
                    // Show full month name in tooltip
                    return monthNames[dataPointIndex].full;
                }
            },
            y: {
                formatter: function (val, { seriesIndex }) {
                    if (seriesIndex === 0) {
                        return val.toLocaleString() + ' Invoices';
                    } else {
                        return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 });
                    }
                }
            }
        },
        responsive: [{
            breakpoint: 768,
            options: {
                plotOptions: {
                    bar: { columnWidth: '50%' }
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetY: 0
                }
            }
        }],
        annotations: {
            yaxis: [
                {
                    y: avgInvoices,
                    borderColor: "#008FFB",
                    strokeDashArray: 4,
                    label: {
                        borderColor: "#008FFB",
                        style: {
                            color: "#fff",
                            background: "#008FFB",
                            fontSize: "11px",
                            fontWeight: "600"
                        },
                    }
                },
                {
                    y: avgSale,
                    borderColor: "#FF4560",
                    strokeDashArray: 4,
                    label: {
                        borderColor: "#FF4560",
                        style: {
                            color: "#fff",
                            background: "#FF4560",
                            fontSize: "11px",
                            fontWeight: "600"
                        },
                    }
                }
            ]
        }
    };

    return (
        <div style={{
            borderRadius: '12px',
            width: '100%',
            margin: '0 auto'
        }}>
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={230}
            />
        </div>
    );
};

export default MonthwiseChart;