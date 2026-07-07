import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import {
    getUserData,
    getOrganisationData,
    getLocationnumber,
    getYearDescription,
} from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import Select from "react-select";
import { components } from "react-select";
import { BsCalendar } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Balance, Description, Store } from "@mui/icons-material";
import '../../../vardana/vardana';
import '../../../vardana/verdana-bold'

export default function ProductionMonthlyReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();
    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber();
    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const MonthRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("2026");
    const currentMonth = String(new Date().getMonth() + 1);
    const [transectionType2, settransectionType2] = useState(currentMonth);

    // Dynamic state variables
    const [tableData, setTableData] = useState([]);
    const [dateColumns, setDateColumns] = useState([]);
    const [totalColumns, setTotalColumns] = useState({});
    const [GrandTotal, setGrandTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const rowRefs = useRef([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const {
        isSidebarVisible,
        toggleSidebar,
        getcolor,
        fontcolor,
        toggleChangeColor,
        apiLinks,
        getLocationNumber,
        getyeardescription,
        getfromdate,
        gettodate,
        getfontstyle,
        getdatafontsize,
    } = useTheme();

    useEffect(() => {
        document.documentElement.style.setProperty("--background-color", getcolor);
    }, [getcolor]);

    const comapnyname = organisation.description;

    // Column sort orders state
    const [columnSortOrders, setColumnSortOrders] = useState({});

    const handleKeyPress = (e, nextInputRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };

    function fetchReceivableReport() {
        const apiUrl = apiLinks + "/ProductionMonthlyReport.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getyeardescription,
            FRepYer: transectionType,
            FRepMon: transectionType2,
        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                // Set dynamic totals
                const totals = response.data.TotalQty || {};
                setTotalColumns(totals);
                setGrandTotal(response.data.GrandTotal || 0);

                // Extract date columns from first item
                if (response.data.Detail && response.data.Detail.length > 0) {
                    const firstItem = response.data.Detail[0];
                    const dateKeys = Object.keys(firstItem).filter(key => 
                        key.match(/^\d{2}-[A-Za-z]{3}-\d{2}$/)
                    );
                    setDateColumns(dateKeys);
                    
                    // Initialize sort orders
                    const newSortOrders = {};
                    newSortOrders["SrNo"] = null;
                    newSortOrders["Code"] = null;
                    newSortOrders["Description"] = null;
                    newSortOrders["Company"] = null;
                    newSortOrders["Category"] = null;
                    newSortOrders["Design"] = null;
                    newSortOrders["Type"] = null;
                    newSortOrders["Capacity"] = null;
                    dateKeys.forEach(key => {
                        newSortOrders[key] = null;
                    });
                    newSortOrders["Total Production"] = null;
                    setColumnSortOrders(newSortOrders);
                }

                if (response.data && Array.isArray(response.data.Detail)) {
                    setTableData(response.data.Detail);
                } else {
                    setTableData([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
                toast.error("Error fetching data");
            });
    }

    useEffect(() => {
        const hasComponentMountedPreviously = sessionStorage.getItem("componentMounted");
        if (!hasComponentMountedPreviously || (input1Ref && input1Ref.current)) {
            if (input1Ref && input1Ref.current) {
                setTimeout(() => {
                    input1Ref.current.focus();
                }, 0);
            }
            sessionStorage.setItem("componentMounted", "true");
        }
    }, []);

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

    const handleTransactionTypeChange2 = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType2(selectedTransactionType);
    };

    // Sorting function
    const handleSorting = (col) => {
        const currentOrder = columnSortOrders[col];
        const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

        const sortedData = [...tableData].sort((a, b) => {
            let aVal = a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
            let bVal = b[col] !== null && b[col] !== undefined ? b[col].toString() : "";
            
            const numA = parseFloat(aVal.replace(/,/g, ""));
            const numB = parseFloat(bVal.replace(/,/g, ""));
            
            if (!isNaN(numA) && !isNaN(numB)) {
                return newOrder === "ASC" ? numA - numB : numB - numA;
            } else {
                return newOrder === "ASC" 
                    ? aVal.localeCompare(bVal) 
                    : bVal.localeCompare(aVal);
            }
        });

        setTableData(sortedData);
        setColumnSortOrders((prev) => ({
            ...Object.keys(prev).reduce((acc, key) => {
                acc[key] = key === col ? newOrder : null;
                return acc;
            }, {}),
        }));
    };

    const resetSorting = () => {
        const resetOrders = {};
        Object.keys(columnSortOrders).forEach(key => {
            resetOrders[key] = null;
        });
        setColumnSortOrders(resetOrders);
    };

    const getIconStyle = (colKey) => {
        const order = columnSortOrders[colKey];
        return {
            transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
            color: order === "ASC" || order === "DSC" ? "red" : "white",
            transition: "transform 0.3s ease, color 0.3s ease",
        };
    };

    // PDF Export - Complete with full styling
    const exportPDFHandler = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        
        // Add company name
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text(comapnyname, doc.internal.pageSize.width / 2, 15, { align: "center" });
        
        // Add report title
        doc.setFontSize(14);
        doc.text("Production Monthly Report", doc.internal.pageSize.width / 2, 25, { align: "center" });
        
        // Add date info
        doc.setFontSize(10);
        const monthName = months[parseInt(transectionType2) - 1];
        doc.text(`Year: ${transectionType} | Month: ${monthName}`, doc.internal.pageSize.width / 2, 33, { align: "center" });
        
        // Prepare table data
        const headers = [
            "SrNo", "Code", "Description", "Company", "Category", 
            "Design", "Type", "Capacity", ...dateColumns, "Total"
        ];
        
        const body = tableData.map(item => [
            item.SrNo,
            item.Code,
            item.Description,
            item.Company,
            item.Category,
            item.Design,
            item.Type,
            item.Capacity,
            ...dateColumns.map(col => item[col] || "0"),
            item["Total Production"]
        ]);
        
        // Add totals row
        const totalRow = [
            "Total",
            "", "", "", "", "", "", "",
            ...dateColumns.map(col => totalColumns[col] || "0"),
            GrandTotal
        ];
        body.push(totalRow);
        
        doc.autoTable({
            head: [headers],
            body: body,
            startY: 40,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [51, 104, 181],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 15 },
                1: { halign: 'left', cellWidth: 30 },
                2: { halign: 'left', cellWidth: 50 },
                3: { halign: 'left', cellWidth: 35 },
                4: { halign: 'left', cellWidth: 30 },
                5: { halign: 'left', cellWidth: 30 },
                6: { halign: 'left', cellWidth: 25 },
                7: { halign: 'left', cellWidth: 25 },
            },
        });
        
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            const currentDate = new Date().toLocaleDateString();
            const currentTime = new Date().toLocaleTimeString();
            doc.text(`Crystal Solution | ${currentDate} | ${currentTime}`, 14, doc.internal.pageSize.height - 10);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        }
        
        const currentDate = new Date().toLocaleDateString().replace(/\//g, "-");
        doc.save(`ProductionMonthlyReport_${currentDate}.pdf`);
    };

    // Excel Export - Complete with original styling
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("ProductionMonthlyReport");

        const headers = [
            "SrNo", "Code", "Description", "Company", "Category", 
            "Design", "Type", "Capacity", ...dateColumns, "Total Production"
        ];

        const numColumns = headers.length;
        
        // Company name with merge
        const companyRow = worksheet.addRow([comapnyname]);
        worksheet.mergeCells(companyRow.number, 1, companyRow.number, numColumns);
        companyRow.getCell(1).font = { name: "Calibri", size: 18, bold: true };
        companyRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(companyRow.number).height = 30;

        // Report title
        const titleRow = worksheet.addRow(["Production Monthly Report"]);
        worksheet.mergeCells(titleRow.number, 1, titleRow.number, numColumns);
        titleRow.getCell(1).font = { name: "Calibri", size: 12 };
        titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

        // Empty row
        worksheet.addRow([]);

        // Header row with styling
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.font = { name: "Calibri", size: 10, bold: true };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF3368B5" },
            };
            cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        // Data rows with alternate colors
        tableData.forEach((item, index) => {
            const rowData = [
                item.SrNo,
                item.Code,
                item.Description,
                item.Company,
                item.Category,
                item.Design,
                item.Type,
                item.Capacity,
                ...dateColumns.map(col => item[col] || "0"),
                item["Total Production"]
            ];
            
            const row = worksheet.addRow(rowData);
            
            row.eachCell((cell, colIndex) => {
                cell.font = { name: "Calibri", size: 10 };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                
                // Alternate row background
                if ((index + 1) % 2 !== 0) {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFF5F5F5" },
                    };
                }
                
                // Alignment
                if (colIndex === 1 || colIndex === 2 || (colIndex > 8 && colIndex <= 8 + dateColumns.length) || colIndex === numColumns) {
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                } else {
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                }
            });
        });

        // Totals row
        const totalRowData = [
            "TOTAL",
            "", "", "", "", "", "", "",
            ...dateColumns.map(col => totalColumns[col] || "0"),
            GrandTotal
        ];
        
        const totalRow = worksheet.addRow(totalRowData);
        totalRow.eachCell((cell, colIndex) => {
            cell.font = { name: "Calibri", size: 10, bold: true };
            cell.border = {
                top: { style: "double" },
                left: { style: "thin" },
                bottom: { style: "double" },
                right: { style: "thin" },
            };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE8E8E8" },
            };
            
            if (colIndex === 1 || colIndex === 2 || (colIndex > 8 && colIndex <= 8 + dateColumns.length) || colIndex === numColumns) {
                cell.alignment = { horizontal: "center", vertical: "middle" };
            } else {
                cell.alignment = { horizontal: "left", vertical: "middle" };
            }
        });

        // Set column widths
        worksheet.getColumn(1).width = 8;
        worksheet.getColumn(2).width = 18;
        worksheet.getColumn(3).width = 40;
        worksheet.getColumn(4).width = 25;
        worksheet.getColumn(5).width = 20;
        worksheet.getColumn(6).width = 20;
        worksheet.getColumn(7).width = 15;
        worksheet.getColumn(8).width = 15;
        
        for (let i = 0; i < dateColumns.length; i++) {
            worksheet.getColumn(9 + i).width = 12;
        }
        
        worksheet.getColumn(9 + dateColumns.length).width = 15;

        // Add date and time footer
        worksheet.addRow([]);
        const currentDate = new Date().toLocaleDateString("en-GB");
        const currentTime = new Date().toLocaleTimeString("en-GB");
        const dateTimeRow = worksheet.addRow([`Date: ${currentDate}  |  Time: ${currentTime}  |  User: ${user.tusrid || ''}`]);
        worksheet.mergeCells(dateTimeRow.number, 1, dateTimeRow.number, numColumns);
        dateTimeRow.getCell(1).font = { name: "Calibri", size: 9 };
        dateTimeRow.getCell(1).alignment = { horizontal: "left" };

        // Save file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const saveDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
        saveAs(blob, `ProductionMonthlyReport_${saveDate}.xlsx`);
    };

    const tableHeadColor = "#3368b5";

    // Keyboard shortcuts
    useHotkeys("alt+s", () => {
        fetchReceivableReport();
        resetSorting();
    }, { preventDefault: true, enableOnFormTags: true });

    useHotkeys("alt+p", exportPDFHandler, {
        preventDefault: true,
        enableOnFormTags: true,
    });
    
    useHotkeys("alt+e", handleDownloadCSV, {
        preventDefault: true,
        enableOnFormTags: true,
    });
    
    useHotkeys("alt+r", () => navigate("/MainPage"), {
        preventDefault: true,
        enableOnFormTags: true,
    });

    // Row selection handlers
    const handleRowClick = (index) => {
        setSelectedIndex(index);
    };

    const handleKeyDown = (e) => {
        if (selectedIndex === -1 || e.target.id === "searchInput") return;
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prevIndex) =>
                Math.min(prevIndex + 1, tableData.length - 1)
            );
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedIndex]);

    useEffect(() => {
        if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
            rowRefs.current[selectedIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [selectedIndex]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Column width definitions (original style)
    const firstColWidth = { width: isSidebarVisible ? "60px" : "60px" };
    const secondColWidth = { width: isSidebarVisible ? "100px" : "120px" };
    const thirdColWidth = { width: isSidebarVisible ? "200px" : "250px" };
    const forthColWidth = { width: isSidebarVisible ? "130px" : "150px" };
    const fifthColWidth = { width: isSidebarVisible ? "120px" : "140px" };
    const sixthColWidth = { width: isSidebarVisible ? "120px" : "140px" };
    const seventhColWidth = { width: isSidebarVisible ? "90px" : "100px" };
    const eighthColWidth = { width: isSidebarVisible ? "90px" : "100px" };
    const dateColWidth = { width: "90px" };
    const totalColWidth = { width: "110px" };

    const contentStyle = {
        width: "100%",
        maxWidth: isSidebarVisible ? "1400px" : "1600px",
        height: "calc(100vh - 100px)",
        position: "absolute",
        top: "70px",
        left: isSidebarVisible ? "60vw" : "52vw",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        textAlign: "center",
        fontSize: "15px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "23px",
        fontFamily: '"Poppins", sans-serif',
        zIndex: 1,
        padding: "0 20px",
        boxSizing: "border-box",
    };

    const totalRows = 22;

    return (
        <div style={contentStyle}>
            <div
                style={{
                    backgroundColor: getcolor,
                    color: fontcolor,
                    width: "100%",
                    border: `1px solid ${fontcolor}`,
                    borderRadius: "9px",
                }}
            >
                <NavComponent textdata="Production Monthly Report" />

                <div className="row" style={{ height: "20px", marginTop: "8px", marginBottom: "8px" }}>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            margin: "0px",
                            padding: "0px",
                            justifyContent: "start",
                        }}
                    >
                        {/* Year Selection */}
                        <div className="d-flex align-items-center" style={{ marginRight: "21px" }}>
                            <div style={{ marginLeft: "10px", width: "60px", display: "flex", justifyContent: "end" }}>
                                <label htmlFor="transactionType">
                                    <span style={{
                                        fontSize: getdatafontsize,
                                        fontFamily: getfontstyle,
                                        fontWeight: "bold",
                                    }}>
                                        Year :
                                    </span>
                                </label>
                            </div>
                            <div style={{ position: "relative", display: "inline-block" }}>
                                <select
                                    ref={input1Ref}
                                    onKeyDown={(e) => handleKeyPress(e, MonthRef)}
                                    id="submitButton"
                                    name="type"
                                    value={transectionType}
                                    onChange={handleTransactionTypeChange}
                                    style={{
                                        width: "150px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: getdatafontsize,
                                        fontFamily: getfontstyle,
                                        color: fontcolor,
                                        paddingRight: "25px",
                                    }}
                                >
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                </select>
                                {transectionType !== "2026" && (
                                    <span
                                        onClick={() => settransectionType("2026")}
                                        style={{
                                            position: "absolute",
                                            right: "25px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            color: fontcolor,
                                            userSelect: "none",
                                            fontSize: "12px",
                                        }}
                                    >
                                        ✕
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Month Selection */}
                        <div className="d-flex align-items-center" style={{ marginLeft: "100px" }}>
                            <div style={{ marginLeft: "10px", width: "60px", display: "flex", justifyContent: "end" }}>
                                <label htmlFor="transactionType">
                                    <span style={{
                                        fontSize: getdatafontsize,
                                        fontFamily: getfontstyle,
                                        fontWeight: "bold",
                                    }}>
                                        Month :
                                    </span>
                                </label>
                            </div>
                            <div style={{ position: "relative", display: "inline-block" }}>
                                <select
                                    ref={MonthRef}
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                    id="submitButton"
                                    name="type"
                                    value={transectionType2}
                                    onChange={handleTransactionTypeChange2}
                                    style={{
                                        width: "150px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: getdatafontsize,
                                        fontFamily: getfontstyle,
                                        color: fontcolor,
                                        paddingRight: "25px",
                                    }}
                                >
                                    {months.map((month, index) => (
                                        <option key={index + 1} value={String(index + 1)}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                {transectionType2 !== currentMonth && (
                                    <span
                                        onClick={() => settransectionType2(currentMonth)}
                                        style={{
                                            position: "absolute",
                                            right: "25px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            color: fontcolor,
                                            userSelect: "none",
                                            fontSize: "12px",
                                        }}
                                    >
                                        ✕
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div style={{ overflowX: "auto", border: `1px solid ${fontcolor}`, background: getcolor }}>
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table style={{ width: "100%", minWidth: "1400px", borderCollapse: "collapse", tableLayout: "fixed", color: fontcolor }}>
                            <thead style={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: tableHeadColor, color: "#fff" }}>
                                <tr>
                                    <th className="border-dark" style={{ ...firstColWidth, cursor: "pointer" }} onClick={() => handleSorting("SrNo")}>
                                        SrNo <i className="fa-solid fa-caret-down" style={getIconStyle("SrNo")}></i>
                                    </th>
                                    <th className="border-dark" style={{ ...secondColWidth, cursor: "pointer" }} onClick={() => handleSorting("Code")}>
                                        Code <i className="fa-solid fa-caret-down" style={getIconStyle("Code")}></i>
                                    </th>
                                    <th className="border-dark" style={{ ...thirdColWidth, cursor: "pointer" }} onClick={() => handleSorting("Description")}>
                                        Description <i className="fa-solid fa-caret-down" style={getIconStyle("Description")}></i>
                                    </th>
                                    <th className="border-dark" style={{ ...forthColWidth, cursor: "pointer" }} onClick={() => handleSorting("Company")}>
                                        Company <i className="fa-solid fa-caret-down" style={getIconStyle("Company")}></i>
                                    </th>
                                    <th className="border-dark" style={{ ...fifthColWidth, cursor: "pointer" }} onClick={() => handleSorting("Category")}>
                                        Category <i className="fa-solid fa-caret-down" style={getIconStyle("Category")}></i>
                                    </th>
                                    <th className="border-dark" style={{ ...sixthColWidth, cursor: "pointer" }} onClick={() => handleSorting("Design")}>
                                        Design <i className="fa-solid fa-caret-down" style={getIconStyle("Design")}></i>
                                    </th>
                                    <th className="border-dark" style={{ ...seventhColWidth, cursor: "pointer" }} onClick={() => handleSorting("Type")}>
                                        Type <i className="fa-solid fa-caret-down" style={getIconStyle("Type")}></i>
                                    </th>
                                    <th className="border-dark" style={{ ...eighthColWidth, cursor: "pointer" }} onClick={() => handleSorting("Capacity")}>
                                        Capacity <i className="fa-solid fa-caret-down" style={getIconStyle("Capacity")}></i>
                                    </th>
                                    
                                    {/* Dynamic Date Columns */}
                                    {dateColumns.map((dateCol) => (
                                        <th key={dateCol} style={{ ...dateColWidth, cursor: "pointer" }} onClick={() => handleSorting(dateCol)}>
                                            {dateCol} <i className="fa-solid fa-caret-down" style={getIconStyle(dateCol)}></i>
                                        </th>
                                    ))}
                                    
                                    <th style={{ ...totalColWidth, cursor: "pointer" }} onClick={() => handleSorting("Total Production")}>
                                        Total Prod <i className="fa-solid fa-caret-down" style={getIconStyle("Total Production")}></i>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {isLoading ? (
                                    <>
                                        <tr style={{ backgroundColor: getcolor }}>
                                            <td colSpan={8 + dateColumns.length + 1} className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                        {Array.from({ length: totalRows - 5 }).map((_, rowIndex) => (
                                            <tr key={`blank-${rowIndex}`} style={{ backgroundColor: getcolor, color: fontcolor }}>
                                                {Array.from({ length: 8 + dateColumns.length + 1 }).map((_, colIndex) => (
                                                    <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                                                ))}
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={firstColWidth}></td>
                                            <td style={secondColWidth}></td>
                                            <td style={thirdColWidth}></td>
                                            <td style={forthColWidth}></td>
                                            <td style={fifthColWidth}></td>
                                            <td style={sixthColWidth}></td>
                                            <td style={seventhColWidth}></td>
                                            <td style={eighthColWidth}></td>
                                            {dateColumns.map((_, idx) => (
                                                <td key={idx} style={dateColWidth}></td>
                                            ))}
                                            <td style={totalColWidth}></td>
                                        </tr>
                                    </>
                                ) : (
                                    <>
                                        {tableData.map((item, i) => (
                                            <tr
                                                key={i}
                                                ref={(el) => (rowRefs.current[i] = el)}
                                                onClick={() => handleRowClick(i)}
                                                className={selectedIndex === i ? "selected-background" : ""}
                                                style={{ backgroundColor: getcolor, color: fontcolor }}
                                            >
                                                <td className="text-center" style={firstColWidth}>{item.SrNo}</td>
                                                <td className="text-start" style={secondColWidth} title={item.Code}>
                                                    {item.Code}
                                                </td>
                                                <td className="text-start" style={thirdColWidth} title={item.Description}>
                                                    {item.Description}
                                                </td>
                                                <td className="text-start" style={forthColWidth} title={item.Company}>
                                                    {item.Company}
                                                </td>
                                                <td className="text-start" style={fifthColWidth}>{item.Category}</td>
                                                <td className="text-start" style={sixthColWidth} title={item.Design}>
                                                    {item.Design}
                                                </td>
                                                <td className="text-start" style={seventhColWidth}>{item.Type}</td>
                                                <td className="text-start" style={eighthColWidth} title={item.Capacity}>
                                                    {item.Capacity}
                                                </td>
                                                
                                                {/* Dynamic Date Columns Data */}
                                                {dateColumns.map((dateCol) => (
                                                    <td key={dateCol} className="text-end" style={dateColWidth}>
                                                        {item[dateCol] || "0"}
                                                    </td>
                                                ))}
                                                
                                                <td className="text-end" style={totalColWidth}>{item["Total Production"]}</td>
                                            </tr>
                                        ))}
                                        
                                        {/* Empty rows */}
                                        {Array.from({ length: Math.max(0, totalRows - tableData.length) }).map((_, rowIndex) => (
                                            <tr key={`blank-${rowIndex}`} style={{ backgroundColor: getcolor, color: fontcolor }}>
                                                {Array.from({ length: 8 + dateColumns.length + 1 }).map((_, colIndex) => (
                                                    <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                                                ))}
                                            </tr>
                                        ))}
                                        
                                        <tr>
                                            <td style={firstColWidth}></td>
                                            <td style={secondColWidth}></td>
                                            <td style={thirdColWidth}></td>
                                            <td style={forthColWidth}></td>
                                            <td style={fifthColWidth}></td>
                                            <td style={sixthColWidth}></td>
                                            <td style={seventhColWidth}></td>
                                            <td style={eighthColWidth}></td>
                                            {dateColumns.map((_, idx) => (
                                                <td key={idx} style={dateColWidth}></td>
                                            ))}
                                            <td style={totalColWidth}></td>
                                        </tr>
                                    </>
                                )}
                            </tbody>

                            <tfoot style={{ position: "sticky", bottom: 0, zIndex: 2, background: getcolor, borderTop: `1px solid ${fontcolor}` }}>
                                <tr>
                                    <td style={firstColWidth}>{tableData.length}</td>
                                    <td style={secondColWidth}></td>
                                    <td style={thirdColWidth}></td>
                                    <td style={forthColWidth}></td>
                                    <td style={fifthColWidth}></td>
                                    <td style={sixthColWidth}></td>
                                    <td style={seventhColWidth}></td>
                                    <td style={eighthColWidth}></td>
                                    
                                    {/* Dynamic Totals */}
                                    {dateColumns.map((dateCol) => (
                                        <td key={dateCol} className="text-end" style={dateColWidth}>
                                            {totalColumns[dateCol] || "0"}
                                        </td>
                                    ))}
                                    
                                    <td className="text-end" style={totalColWidth}>{GrandTotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ margin: "5px", marginBottom: "2px" }}>
                    <SingleButton
                        to="/MainPage"
                        text="Return"
                        onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                        onBlur={(e) => (e.currentTarget.style.border = `1px solid ${fontcolor}`)}
                    />
                    <SingleButton
                        text="PDF"
                        onClick={exportPDFHandler}
                        onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                        onBlur={(e) => (e.currentTarget.style.border = `1px solid ${fontcolor}`)}
                    />
                    <SingleButton
                        text="Excel"
                        onClick={handleDownloadCSV}
                        onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                        onBlur={(e) => (e.currentTarget.style.border = `1px solid ${fontcolor}`)}
                    />
                    <SingleButton
                        id="searchsubmit"
                        text="Select"
                        highlightFirstLetter={true}
                        ref={input3Ref}
                        onClick={() => {
                            fetchReceivableReport();
                            resetSorting();
                        }}
                        onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                        onBlur={(e) => (e.currentTarget.style.border = `1px solid ${fontcolor}`)}
                    />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}