import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Spinner, Nav, Button } from "react-bootstrap";
import axios from "axios";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";
import { Content } from "../../../App";
import { useHotkeys } from "react-hotkeys-hook";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import DatePicker from "react-datepicker";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "../Daily_Jobs_Reports/Daily_Job_Reports.css";

export default function DailyJobReport() {
  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368B5";
  const secondaryColor = "white";
  const textColor = "white";
  const apiLink =
    "https://crystalsolutions.com.pk/kasurcable/web/admin/CustomerLedger.php";
  // const { tableTopColor, tableHeadColor, secondaryColor, textColor, apiLink } =
  // 	useContext(Content);

  const [tableData, setTableData] = useState([]);
  const [totalAmt, setTotalAmt] = useState("");
  const [totalQnty, setTotalQnty] = useState([]);
  const [selectedOptionType, setSelectedOptionType] = useState("");
  const [selectedOptionSearch, setSelectedOptionSearch] = useState("");
  const [selectedOptionStore, setSelectedOptionStore] = useState("");
  const [dropdownOptionsStore, setDropdownOptionsStore] = useState([]);
  const [selectedOptionCity, setSelectedOptionCity] = useState("");
  const [dropdownOptionsCity, setDropdownOptionsCity] = useState([]);
  const [selectedOptionDealer, setSelectedOptionDealer] = useState("");
  const [dropdownOptionsDealer, setDropdownOptionsDealer] = useState([]);
  const [selectedOptionInstallar, setSelectedOptionInstallar] = useState("");
  const [dropdownOptionsInstallar, setDropdownOptionsInstallar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const navigate = useNavigate();
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const pad = (number) => number.toString().padStart(2, "0");

  const defaultFromDate = `01-${pad(month)}-${year}`;
  const defaultToDate = format(date, "dd-MM-yyyy");

  const [selectedDateFrom, setSelectedDateFrom] = useState(
    parse(defaultFromDate, "dd-MM-yyyy", new Date())
  );

  const [selectedDateTo, setSelectedDateTo] = useState(
    parse(defaultToDate, "dd-MM-yyyy", new Date())
  );

  const formattedFromDate = format(selectedDateFrom, "dd-MM-yyyy");
  const formattedToDate = format(selectedDateTo, "dd-MM-yyyy");

  function fetchDailyDocumentEditItems() {
    const apiUrl = apiLink + "/reports/DailyInstallationReport.php";
    setIsLoading(true);
    // console.log(formattedFromDate + formattedToDate + "aabb");

    const formData = new URLSearchParams({
      FIntDat: formattedFromDate,
      FFnlDat: formattedToDate,
      FCtyCod: selectedOptionCity,
      FIntCod: selectedOptionInstallar,
      FDlrCod: selectedOptionDealer,
      FRepTyp: selectedOptionType,
      FSchTxt: selectedOptionSearch,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        // Extract detail objects from the response
        const data = response.data.map((item) => item.detail);

        // Update the table data state
        setTableData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://crystalsolutions.com.pk/complaint/GetActiveCity.php`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        const transformedData = jsonData.map((item) => ({
          tctycod: item.tctycod,
          tctydsc: item.tctydsc,
        }));
        console.log("transformedData", transformedData);
        setDropdownOptionsCity(transformedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://crystalsolutions.com.pk/complaint/GetActiveReference.php`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        const transformedData = jsonData.map((item) => ({
          trefcod: item.trefcod,
          trefdsc: item.trefdsc,
        }));
        console.log("transformedData", transformedData);
        setDropdownOptionsDealer(transformedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://crystalsolutions.com.pk/complaint/GetActiveTechnician.php`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        const transformedData = jsonData.map((item) => ({
          techid: item.techid,
          ttchdsc: item.ttchdsc,
        }));
        console.log("transformedData", transformedData);
        setDropdownOptionsInstallar(transformedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const exportPDFHandler = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    const rows = tableData.map((item) => [
      item.Date,
      item["Comp #"],
      item.Customer,
      item.Installar,
      item.city,
      item.Item,
      item["Serial#"],
      item.Qnty,
      item["Done On"],
      item.Days,
    ]);

    // rows.push([
    // 	"",
    // 	"",
    // 	"",
    // 	"",
    // 	"",
    // 	"Total",
    // 	"",
    // 	String(totalQnty),
    // 	String(totalAmt),
    // ]);

    const headers = [
      "Date",
      "Comp#",
      "Customer",
      "Installar",
      "City",
      "Item",
      "Serial#",
      "Qty",
      "Done on",
      "Day",
    ];
    const columnWidths = [15, 12, 50, 55, 28, 70, 30, 7, 15, 7];

    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 15;

    doc.setFont("verdana");
    doc.setFontSize(10);

    const addTableHeaders = (startX, startY) => {
      doc.setFont("bold");
      doc.setFontSize(10);

      headers.forEach((header, index) => {
        const cellWidth = columnWidths[index];
        const cellHeight = 6;
        const cellX = startX + cellWidth / 2;
        const cellY = startY + cellHeight / 2 + 1.5;

        // console.log(
        // 	"Header rect params:",
        // 	startX,
        // 	startY,
        // 	cellWidth,
        // 	cellHeight
        // );
        doc.setFillColor(200, 200, 200);
        doc.rect(startX, startY, cellWidth, cellHeight, "F");

        doc.setLineWidth(0.2);
        doc.rect(startX, startY, cellWidth, cellHeight);

        doc.setTextColor(0);
        doc.text(header, cellX, cellY, { align: "center" });
        startX += cellWidth;
      });

      doc.setFont("verdana");
      doc.setFontSize(10);
    };

    const addTableRows = (startX, startY, startIndex, endIndex) => {
      const rowHeight = 5;
      const fontSize = 8;
      const boldFont = "verdana";
      const normalFont = "verdana";
      const tableWidth = getTotalTableWidth();

      doc.setFontSize(fontSize);

      for (let i = startIndex; i < endIndex; i++) {
        const row = rows[i];
        // const isOddRow = i % 2 !== 0;
        // const isRedRow = row[0] && parseInt(row[0]) > 100;
        let textColor = [0, 0, 0];
        let fontName = normalFont;

        // if (isRedRow) {
        // 	textColor = [255, 0, 0];
        // 	fontName = boldFont;
        // }

        doc.setDrawColor(0);
        const rectX = startX;
        const rectY = startY + (i - startIndex + 2) * rowHeight;
        // console.log("Row rect params:", rectX, rectY, tableWidth, rowHeight);
        doc.rect(rectX, rectY, tableWidth, rowHeight);

        row.forEach((cell, cellIndex) => {
          const cellY = startY + (i - startIndex + 2) * rowHeight + 3;
          const cellX = startX + 1;

          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.setFont(fontName, "normal");

          const cellValue = String(cell);

          if (cellIndex === 1) {
            const rightAlignX = startX + columnWidths[cellIndex] - 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "right",
              baseline: "middle",
            });
          } else {
            doc.text(cellValue, cellX, cellY, { baseline: "middle" });
          }

          if (cellIndex < row.length - 1) {
            const columnRectX = startX;
            const columnRectY = startY + (i - startIndex + 2) * rowHeight;
            const columnRectWidth = columnWidths[cellIndex];
            // console.log(
            // 	"Column rect params:",
            // 	columnRectX,
            // 	columnRectY,
            // 	columnRectWidth,
            // 	rowHeight
            // );
            doc.rect(columnRectX, columnRectY, columnRectWidth, rowHeight);
            startX += columnWidths[cellIndex];
          }
        });

        const lastColumnRectX = startX;
        const lastColumnRectY = startY + (i - startIndex + 2) * rowHeight;
        const lastColumnRectWidth = columnWidths[row.length - 1];
        // console.log(
        // 	"Last column rect params:",
        // 	lastColumnRectX,
        // 	lastColumnRectY,
        // 	lastColumnRectWidth,
        // 	rowHeight
        // );
        doc.rect(
          lastColumnRectX,
          lastColumnRectY,
          lastColumnRectWidth,
          rowHeight
        );
        startX = (doc.internal.pageSize.width - tableWidth) / 2;
      }

      const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
      const lineY = pageHeight - 15;
      doc.setLineWidth(0.3);
      doc.line(lineX, lineY, lineX + tableWidth, lineY);

      const headingFontSize = 12;
      const headingX = lineX + 2;
      const headingY = lineY + 5;
      doc.setFontSize(headingFontSize);
      doc.setTextColor(0);
      doc.text(`Crystal Solution \t ${date} \t ${time}`, headingX, headingY);
    };

    const getTotalTableWidth = () => {
      let totalWidth = 0;
      columnWidths.forEach((width) => (totalWidth += width));
      return totalWidth;
    };

    const addNewPage = (startY) => {
      doc.addPage();
      return paddingTop;
    };

    const rowsPerPage = 29;

    const handlePagination = () => {
      const addTitle = (
        title,
        date,
        time,
        pageNumber,
        startY,
        titleFontSize = 16,
        dateTimeFontSize = 8,
        pageNumberFontSize = 8
      ) => {
        doc.setFontSize(titleFontSize);
        doc.text(title, doc.internal.pageSize.width / 2, startY, {
          align: "center",
        });

        const rightX = doc.internal.pageSize.width - 10;

        if (date) {
          doc.setFontSize(dateTimeFontSize);
          if (time) {
            doc.text(date + " " + time, rightX, startY, { align: "right" });
          } else {
            doc.text(date, rightX - 10, startY, { align: "right" });
          }
        }

        doc.setFontSize(pageNumberFontSize);
        doc.text(
          `Page ${pageNumber}`,
          rightX - 10,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      };

      let currentPageIndex = 0;
      let startY = paddingTop;
      let pageNumber = 1;

      while (currentPageIndex * rowsPerPage < rows.length) {
        addTitle(
          "AMERICAN ELECTRONICS SMC PVT LTD",
          "",
          "",
          pageNumber,
          startY,
          20,
          10
        );
        startY += 7;

        addTitle(
          `Daily Installation Report From: ${formattedFromDate} To: ${formattedToDate}`,
          "",
          "",
          pageNumber,
          startY,
          14
        );
        startY += 13;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 2;

        doc.setFontSize(14);
        doc.setFont("verdana", "bold");

        let typeRep = selectedOptionType ? selectedOptionType : "All";
        let typeDealer = selectedOptionDealer ? selectedOptionDealer : "All";
        let typeInstallar = selectedOptionInstallar
          ? selectedOptionInstallar
          : "All";
        let typeCity = selectedOptionCity ? selectedOptionCity : "All";

        doc.text(`Rep: ${typeRep}`, labelsX, labelsY);
        doc.text(`City: ${typeCity}`, labelsX + 105, labelsY);
        doc.text(`Dealer: ${typeDealer}`, labelsX + 170, labelsY);
        doc.text(`Installar: ${typeInstallar}`, labelsX + 260, labelsY);

        doc.setFont("verdana", "normal");

        startY += 0;

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 39);
        const startIndex = currentPageIndex * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
        startY = addTableRows(
          (doc.internal.pageSize.width - totalWidth) / 2,
          startY,
          startIndex,
          endIndex
        );
        if (endIndex < rows.length) {
          startY = addNewPage(startY);
          pageNumber++;
        }
        currentPageIndex++;
      }
    };

    const getCurrentDate = () => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      return dd + "/" + mm + "/" + yyyy;
    };

    const getCurrentTime = () => {
      const today = new Date();
      const hh = String(today.getHours()).padStart(2, "0");
      const mm = String(today.getMinutes()).padStart(2, "0");
      const ss = String(today.getSeconds()).padStart(2, "0");
      return hh + ":" + mm + ":" + ss;
    };

    const date = getCurrentDate();
    const time = getCurrentTime();

    handlePagination();

    doc.save("DailyInstallationReport.pdf");

    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], "table_data.pdf", {
      type: "application/pdf",
    });
  };

  const exportCSVHandler = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 10; // Number of columns

    // Common styles
    const titleStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: "center" },
    };

    const columnAlignments = [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "center",
      "left",
      "center",
    ];

    // Add an empty row at the start
    worksheet.addRow([]);

    // Add title rows
    [
      "AMERICAN ELECTRONICS SMC PVT LTD",
      `Daily Installation Report From ${formattedFromDate} To ${formattedToDate}`,
    ].forEach((title, index) => {
      worksheet.addRow([title]).eachCell((cell) => (cell.style = titleStyle));
      worksheet.mergeCells(
        `A${index + 2}:${String.fromCharCode(64 + numColumns)}${index + 2}`
      );
    });

    worksheet.addRow([]); // Empty row for spacing

    let typeRep = selectedOptionType ? selectedOptionType : "All";
    let typeDealer = selectedOptionDealer ? selectedOptionDealer : "All";
    let typeInstallar = selectedOptionInstallar
      ? selectedOptionInstallar
      : "All";
    let typeCity = selectedOptionCity ? selectedOptionCity : "All";

    // Add type and store row and bold it
    const typeAndStoreRow = worksheet.addRow([
      `Rep: ${typeRep}`,
      "",
      `Dealer: ${typeDealer}`,
      `City: ${typeCity}`,
      "",
      `Installar: ${typeInstallar}`,
    ]);
    typeAndStoreRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    worksheet.addRow([]); // Empty row for spacing

    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: "center" }, // Keep headers centered
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6D9F7" },
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // Add headers
    const headers = [
      "Date",
      "Comp#",
      "Customer",
      "Installar",
      "City",
      "Item",
      "Serial#",
      "Qty",
      "Done on",
      "Days",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.style = { ...headerStyle, alignment: { horizontal: "center" } };
    });

    // Add data rows
    tableData.forEach((item) => {
      worksheet.addRow([
        item.Date,
        item["Comp #"],
        item.Customer,
        item.Installar,
        item.city,
        item.Item,
        item["Serial#"],
        item.Qnty,
        item["Done On"],
        item.Days,
      ]);
    });

    // Add total row and bold it
    // const totalRow = worksheet.addRow([
    // 	"",
    // 	"",
    // 	"",
    // 	"",
    // 	"",
    // 	"Total",
    // 	"",
    // 	totalQnty,
    // 	totalAmt,
    // ]);
    // totalRow.eachCell((cell) => {
    // 	cell.font = { bold: true };
    // });

    // Set column widths
    [12, 8, 30, 35, 20, 45, 20, 5, 12, 5].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // Apply individual alignment and borders to each column
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 5) {
        // Skip title rows and the empty row
        row.eachCell((cell, colNumber) => {
          if (rowNumber === 7) {
            // Keep headers centered
            cell.alignment = { horizontal: "center" };
          } else {
            // Apply individual alignment to body cells
            cell.alignment = { horizontal: columnAlignments[colNumber - 1] };
          }
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Generate Excel file buffer and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "DailyInstallationReport.xlsx");
  };

  const handleSelectChangeSearch = (e) => {
    const query = e.target.value;
    setSelectedOptionSearch(query);
    // setIsFilterApplied(query !== "");
  };

  const handleSelectChangeType = (e) => {
    setSelectedOptionType(e.target.value);
  };

  const handleCity = (event) => {
    // Check if event is not null before accessing its properties
    if (event) {
      setSelectedOptionCity(event.value);
    } else {
      // Handle the case when the selection is cleared
      setSelectedOptionCity(null);
    }
  };
  const handleDealer = (event) => {
    // Check if event is not null before accessing its properties
    if (event) {
      setSelectedOptionDealer(event.value);
    } else {
      // Handle the case when the selection is cleared
      setSelectedOptionDealer(null);
    }
  };
  const handleInstallar = (event) => {
    // Check if event is not null before accessing its properties
    if (event) {
      setSelectedOptionInstallar(event.value);
    } else {
      // Handle the case when the selection is cleared
      setSelectedOptionInstallar(null);
    }
  };

  const optionCity = [
    {
      value: "",
      label: "All",
    },
    ...dropdownOptionsCity.map((option) => ({
      value: option.tctycod,
      label: `${option.tctydsc}`,
    })),
  ];

  const optionDealer = [
    {
      value: "",
      label: "All",
    },
    ...dropdownOptionsDealer.map((option) => ({
      value: option.trefcod,
      label: `${option.trefdsc}`,
    })),
  ];

  const optionInstallar = [
    {
      value: "",
      label: "All",
    },
    ...dropdownOptionsInstallar.map((option) => ({
      value: option.techid,
      label: `${option.ttchdsc}`,
    })),
  ];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "24px",
      maxHeight: "24px",
      width: "100%",
      fontSize: "12px",
      borderRadius: 0,
      border: "1px solid black",
      transition: "border-color 0.15s ease-in-out",
      "&:hover": {
        borderColor: state.isFocused ? base.borderColor : "black",
      },
      // padding: "0 1px",
      // marginLeft: 10,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
  };

  useEffect(() => {
    if (isFilterApplied || tableData.length > 0) {
      setSelectedIndex(0); // Set the selected index to the first row
      rowRefs.current[0]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setSelectedIndex(-1); // Reset selected index if no filter applied or filtered data is empty
    }
  }, [tableData, isFilterApplied]);

  let totalEnteries = 0;

  const [selectedRowId, setSelectedRowId] = useState(null); // Track the selected row's tctgcod

  // state initialize for table row highlight
  const [selectedIndex, setSelectedIndex] = useState(-1); // Initialize selectedIndex state

  const rowRefs = useRef([]); // Array of refs for rows
  const handleRowClick = (index) => {
    setSelectedIndex(index);
    // setSelectedRowId(getFilteredTableData[index].tcmpdsc); // Save the selected row's tctgcod
  };

  useEffect(() => {
    if (selectedRowId !== null) {
      const newIndex = tableData.findIndex(
        (item) => item.tcmpcod === selectedRowId
      );
      setSelectedIndex(newIndex);
    }
  }, [tableData, selectedRowId]);

  const handleKeyDown = (e) => {
    if (selectedIndex === -1 || e.target.id === "searchInput") return; // Return if no row is selected or target is search input
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      scrollToSelectedRow();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, tableData.length - 1)
      );
      scrollToSelectedRow();
    }
  };

  const scrollToSelectedRow = () => {
    if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]); // Add selectedIndex as a dependency

  useEffect(() => {
    // Scroll the selected row into view
    if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]); // Add selectedIndex as a dependency

  const firstColWidth = {
    width: "6%",
  };
  const secondColWidth = {
    width: "7%",
  };
  const thirdColWidth = {
    width: "19%",
  };
  const forthColWidth = {
    width: "10%",
  };
  const fifthColWidth = {
    width: "15%",
  };
  const sixthColWidth = {
    width: "20%",
  };
  const seventhColWidth = {
    width: "8%",
  };
  const eighthColWidth = {
    width: "10%",
  };
  const ninthColWidth = {
    width: "5%",
  };
  //   const tenthColWidth = {
  //     width: "2.25%",
  //   };

  useHotkeys("alt+r", fetchDailyDocumentEditItems);
  useHotkeys("p", exportPDFHandler);
  useHotkeys("e", exportCSVHandler);
  useHotkeys("esc", () => navigate("/sidebar"));

  return (
    <>
      <Container
        fluid
        className="mt-5 border border-dark"
        id="ContainerStylingDailyJobReport"
      >
        <div style={{ margin: "0 -12px" }}>
          <Nav
            className="col-12 d-flex justify-content-between"
            style={{ backgroundColor: tableTopColor, color: textColor }}
          >
            <div className="col-4">
              {/*<span
								className="fa-solid fa-envelope fa-xl topBtn"
								title="Email"
							></span>

							<i
								className="fa-solid fa-file-csv fa-xl topBtn"
								title="Download Excel"
								onClick={exportCSVHandler}
							></i>

							<i
								onClick={exportPDFHandler}
								className="fa-solid fa-file-pdf fa-xl topBtn"
								title="Download PDF"
							></i>
							<i
								className="fa fa-refresh fa-xl topBtn"
								title="Refresh"
								onClick={fetchDailyDocumentEditItems}
							></i>*/}
            </div>
            <div style={{ fontSize: "14px" }} className="col-4 text-center">
              <strong style={{ color: "white" }}>Daily Job Report</strong>
            </div>
            <div className="text-end col-4">
              {/* <Link to="/sidebar">
								<i className="fa fa-close fa-2xl crossBtn"></i>
							</Link> */}
            </div>
          </Nav>
          <div className="mx-2">
            <div className="d-flex justify-content-between my-1 col-12">
              <div className="d-flex col-4 justify-content-start align-items-center">
                <label className="col-4 text-end">
                  <strong>From: &ensp;&ensp;</strong>
                </label>
                <DatePicker
                  selected={selectedDateFrom}
                  onChange={(e) => setSelectedDateFrom(e)}
                  dateFormat="dd-MM-yyyy"
                  className="col-7"
                  style={{ height: "24px" }}
                />
              </div>
              <div className="d-flex col-4 justify-content-start align-items-center">
                <label className="col-4 text-end">
                  <strong>To: &ensp;&ensp;</strong>
                </label>
                <DatePicker
                  selected={selectedDateTo}
                  onChange={(e) => setSelectedDateTo(e)}
                  dateFormat="dd-MM-yyyy"
                  className="col-7"
                  style={{ height: "24px" }}
                />
              </div>
              <div className="d-flex col-4 justify-content-end align-items-center">
                <label className="col-4 text-end">
                  <strong>Search: &ensp;&ensp;</strong>
                </label>
                <input
                  style={{ height: "24px" }}
                  className="col-8 border border-dark"
                  type="search"
                  placeholder="Type Here..."
                  onChange={handleSelectChangeSearch}
                  value={selectedOptionSearch}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="d-flex justify-content-between my-1 col-12">
              <div className="d-flex col-4 justify-content-start align-items-center">
                <label className="col-4 text-end">
                  <strong>City: &ensp;&ensp;</strong>
                </label>
                <Select
                  className="col-8"
                  onChange={handleCity}
                  options={optionCity}
                  placeholder="Search or select..."
                  styles={customStyles}
                  defaultValue={optionCity[0]}
                  // isClearable={isClearable}
                />
              </div>
              <div className="d-flex col-4 justify-content-end align-items-center">
                <label className="col-4 text-end">
                  <strong>Type: &ensp;&ensp;</strong>
                </label>
                <select
                  style={{ height: "24px" }}
                  className="col-8 border border-dark"
                  onChange={handleSelectChangeType}
                  value={selectedOptionType}
                >
                  <option value="All">All</option>
                  <option value="Not Assigned">Not Assigned</option>
                  <option value="Pending">Pending</option>
                  <option value="Installed">Installed</option>
                  <option value="Closed">Closed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-between my-1 col-12">
              <div className="d-flex col-4 justify-content-start align-items-center">
                <label className="col-4 text-end">
                  <strong>Reference: &ensp;&ensp;</strong>
                </label>
                <Select
                  className="col-8"
                  onChange={handleDealer}
                  options={optionDealer}
                  placeholder="Search or select..."
                  styles={customStyles}
                  defaultValue={optionDealer[0]}
                  // isClearable={isClearable}
                />
              </div>
              <div className="d-flex col-4 justify-content-start align-items-center">
                <label className="col-4 text-end">
                  <strong>Technician: &ensp;&ensp;</strong>
                </label>
                <Select
                  className="col-8"
                  onChange={handleInstallar}
                  options={optionInstallar}
                  placeholder="Search or select..."
                  styles={customStyles}
                  defaultValue={optionInstallar[0]}
                  // isClearable={isClearable}
                />
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                overflowY: "auto",
                // maxHeight: "vh",
                width: "100%",
              }}
            >
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: "12px",
                  width: "100%",
                  position: "relative",
                  paddingRight: "1.3%",
                }}
              >
                <thead
                  style={{
                    fontWeight: "bold",
                    height: "24px",
                    position: "sticky",
                    top: 0,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    backgroundColor: tableHeadColor,
                  }}
                >
                  <tr
                    style={{
                      backgroundColor: tableHeadColor,
                    }}
                  >
                    <td className="border-dark" style={firstColWidth}>
                      <a style={{ color: "white" }}>Job#</a>
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      <a style={{ color: "white" }}>Date</a>
                    </td>
                    <td className="border-dark" style={thirdColWidth}>
                      <a style={{ color: "white" }}>Customer</a>
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      <a style={{ color: "white" }}>Mobile</a>
                    </td>

                    <td className="border-dark" style={fifthColWidth}>
                      <a style={{ color: "white" }}>Technician</a>
                    </td>

                    <td className="border-dark" style={sixthColWidth}>
                      <a style={{ color: "white" }}>Item</a>
                    </td>
                    <td className="border-dark" style={seventhColWidth}>
                      <a style={{ color: "white" }}>Status</a>
                    </td>
                    <td className="border-dark" style={eighthColWidth}>
                      <a style={{ color: "white" }}>Closed On</a>
                    </td>
                    <td className="border-dark" style={ninthColWidth}>
                      <a style={{ color: "white" }}>Day</a>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>

            <div
              style={{
                overflowY: "auto",
                maxHeight: "50vh",
                width: "100%",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: "12px",
                  width: "100%",
                  position: "relative",
                }}
              >
                <tbody style={{ backgroundColor: "white" }}>
                  {isLoading ? (
                    <>
                      <tr>
                        <td colSpan="10" className="text-center">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                      {Array.from({ length: Math.max(0, 30 - 3) }).map(
                        (_, rowIndex) => (
                          <tr key={`blank-${rowIndex}`}>
                            {Array.from({ length: 9 }).map((_, colIndex) => (
                              <td key={`blank-${rowIndex}-${colIndex}`}>
                                &nbsp;
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                      <tr>
                        <td style={firstColWidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {tableData.map((item, i) => {
                        totalEnteries += 1;
                        return (
                          <tr
                            key={i}
                            ref={(el) => (rowRefs.current[i] = el)} // Assign ref to each row
                            onClick={() => handleRowClick(i)}
                            style={{
                              backgroundColor:
                                selectedIndex === i ? "#ADD8E6" : "white",
                              // fontWeight: selectedIndex === i ? "bold" : "",
                              fontSize: "12px !important",
                            }}
                          >
                            <td className="text-start" style={firstColWidth}>
                              {item.Date}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {/* {item["Comp #"]} */}
                            </td>
                            <td className="text-start" style={thirdColWidth}>
                              {item.Customer}
                            </td>
                            <td className="text-start" style={forthColWidth}>
                              {item.Installar}
                            </td>

                            <td className="text-start" style={fifthColWidth}>
                              {item.Item}
                            </td>

                            <td className="text-center" style={sixthColWidth}>
                              {item.Qnty}
                            </td>
                            <td className="text-start" style={seventhColWidth}>
                              {/* {item["Done On"]} */}
                            </td>
                            <td className="text-start" style={eighthColWidth}>
                              {item.Item}
                            </td>

                            <td className="text-center" style={ninthColWidth}>
                              {item.Qnty}
                            </td>
                          </tr>
                        );
                      })}
                      {Array.from({
                        length: Math.max(0, 27 - tableData.length),
                      }).map((_, rowIndex) => (
                        <tr key={`blank-${rowIndex}`}>
                          {Array.from({ length: 9 }).map((_, colIndex) => (
                            <td key={`blank-${rowIndex}-${colIndex}`}>
                              &nbsp;
                            </td>
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
                        <td style={ninthColWidth}></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="col-12 border-dark border-top"
              style={{
                backgroundColor: secondaryColor,
                paddingRight: "1.3%",
              }}
            >
              <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...firstColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...secondColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...thirdColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...forthColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...fifthColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...sixthColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...seventhColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              <input
                type="text"
                // value={totalQnty}
                className="text-end border-dark"
                disabled
                style={{
                  ...eighthColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...ninthColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              />
              {/* <input
                type="text"
                // value={totalAmt}
                className="text-end border-dark"
                disabled
                style={{
                  ...tenthColWidth,
                  height: "24px",
                  backgroundColor: textColor,
                  fontWeight: "bold",
                }}
              /> */}
            </div>
          </div>
        </div>
      </Container>
      <div className="mt-2 text-center">
        <button className="reportBtn" onClick={() => navigate("/sidebar")}>
          Return
        </button>{" "}
        <button className="reportBtn" onClick={exportPDFHandler}>
          PDF
        </button>{" "}
        <button className="reportBtn" onClick={exportCSVHandler}>
          Excel
        </button>{" "}
        <button className="reportBtn" onClick={fetchDailyDocumentEditItems}>
          Select
        </button>{" "}
      </div>
    </>
  );
}
