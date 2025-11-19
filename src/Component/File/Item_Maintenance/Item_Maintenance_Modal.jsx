import React, { useState, useRef } from "react";
import { Modal, Nav, Row, Col, Form, NavLink } from "react-bootstrap";
import "./Item_Maintenance.css";
const GeneralTwoFieldsModal = ({
  isOpen,
  handleClose,
  title,
  searchRef,
  firstColKey,
  secondColKey,
  handleRowClick,
  technicians,
}) => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState({ columns: [], rows: [] });
  const [enterCount, setEnterCount] = useState(0);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(0);
  const tableRef = useRef(null);
  const firstRowRef = useRef(null);

  const fetchDataAndDisplay = async () => {
    const columns = [
      { label: "Code", field: "tacccod", sort: "asc" },
      { label: "Description", field: "taccdsc", sort: "asc" },
      { label: "Status", field: "taccsts", sort: "asc" },
    ];
    setData({ columns, rows: technicians });
  };

  const filteredRows =
    data.rows &&
    data.rows.filter(
      (row) =>
        (row[firstColKey] &&
          row[firstColKey].toLowerCase().includes(searchText.toLowerCase())) ||
        (row[secondColKey] &&
          row[secondColKey].toLowerCase().includes(searchText.toLowerCase()))
    );

  const handleSearchChange = (event) => {
    const uppercase = event.target.value.toUpperCase();
    setHighlightedRowIndex(0);
    setSearchText(uppercase);
  };

  const resetData = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
  };

  const handleArrowKeyPress = (direction) => {
    if (filteredRows.length === 0) return;

    let newIndex = highlightedRowIndex;
    let upindex = highlightedRowIndex - 10;
    let bottomindex = highlightedRowIndex + 10;

    if (direction === "up") {
      const rowElement = document.getElementById(`row-${upindex}`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      newIndex = Math.max(0, highlightedRowIndex - 1);
    } else if (direction === "down") {
      const rowElement = document.getElementById(`row-${bottomindex}`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      newIndex = Math.min(filteredRows.length - 1, highlightedRowIndex + 1);
    }

    setHighlightedRowIndex(newIndex);
  };

  const firstColWidth = "150px";
  const secondColWidth = "500px";

  return (
    <Modal show={isOpen} onHide={handleClose} dialogClassName="my-modal">
      <Nav
        className="col-12 d-flex justify-content-between"
        style={{
          backgroundColor: "#3368b5",
          color: "#fff",
          height: "24px",
        }}
      >
        <div className="col-4 "></div>
        <div style={{ fontSize: "14px" }} className="col-4 text-center">
          <strong>{title}</strong>
        </div>
        <div className="text-end col-4">
          <NavLink
            onClick={handleClose}
            className="topBtn"
            style={{ marginTop: "-5%", color: "white" }}
          >
            <i className="fa fa-close fa-lg crossBtn"></i>
          </NavLink>
        </div>
      </Nav>
      <Modal.Body>
        <Row>
          <Col xs={12} sm={4} md={4} lg={4} xl={{ span: 4 }}>
            <Form.Control
              type="text"
              className="form-control-employee search"
              style={{
                height: "25px",
                boxShadow: "none",
                margin: "0.5%",
                borderRadius: "0px",
                backgroundColor: "white",
              }}
              name="searchText"
              ref={searchRef}
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (enterCount === 0) {
                    fetchDataAndDisplay();
                    setEnterCount(1);
                  } else if (enterCount === 1) {
                    const selectedRowData = filteredRows[highlightedRowIndex];
                    handleRowClick(selectedRowData, highlightedRowIndex);
                    setEnterCount(0); // Reset count after the second enter press
                  }
                } else if (e.key === "ArrowUp") {
                  handleArrowKeyPress("up");
                } else if (e.key === "ArrowDown") {
                  handleArrowKeyPress("down");
                } else {
                  setEnterCount(0); // Reset count for any other key press
                }
              }}
            />
          </Col>
        </Row>
        <table className="custom-table-area" style={{ color: "black" }}>
          <thead>
            <tr>
              <th
                className="sticky-header-area"
                style={{
                  width: firstColWidth,
                  fontWeight: "bold",
                  textAlign: "center",
                  borderRight: "1px solid black",
                }}
              >
                Code
              </th>
              <th
                className="sticky-header-area"
                style={{
                  width: secondColWidth,
                  textAlign: "center",
                  fontWeight: "bold",
                  borderRight: "1px solid black",
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody ref={tableRef} style={{ fontSize: "10px" }}>
            {!filteredRows || filteredRows.length === 0 ? (
              <>
                {Array.from({ length: 18 }).map((_, index) => (
                  <tr key={`blank-${index}`}>
                    {Array.from({ length: 2 }).map((_, colIndex) => (
                      <td key={`blank-${index}-${colIndex}`}>&nbsp;</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                      width: firstColWidth,
                    }}
                  ></td>
                  <td
                    style={{
                      textAlign: "center",
                      width: secondColWidth,
                    }}
                  ></td>
                </tr>
              </>
            ) : (
              <>
                {filteredRows.map((row, index) => (
                  <tr
                    style={{
                      fontWeight:
                        highlightedRowIndex === index ? "bold" : "normal",
                      border:
                        highlightedRowIndex === index
                          ? "1px solid #3368B5"
                          : "1px solid #3368B5",
                      backgroundColor:
                        highlightedRowIndex === index ? "#739ad1" : "",
                    }}
                    ref={index === 0 ? firstRowRef : null}
                    key={index}
                    id={`row-${index}`}
                    onClick={() => handleRowClick(row, index)}
                  >
                    <td style={{ width: firstColWidth, fontWeight: "normal" }}>
                      {row[firstColKey]}
                    </td>
                    <td
                      style={{
                        width: secondColWidth,
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      {row[secondColKey]}
                    </td>
                  </tr>
                ))}
                {Array.from({
                  length: Math.max(0, 19 - filteredRows.length),
                }).map((_, index) => (
                  <tr key={`blank-${index}`}>
                    {Array.from({ length: 2 }).map((_, colIndex) => (
                      <td key={`blank-${index}-${colIndex}`}>&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
};

export default GeneralTwoFieldsModal;
