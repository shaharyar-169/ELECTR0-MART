import React from "react";
import { Modal, Nav, Row, Col, Form, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";

const Complain_Type_Maitenance_Modal = ({
  isOpen,
  handleClose,
  title,
  searchText,
  handleSearchChange,
  searchRef,
  enterCount,
  setEnterCount,
  handleArrowKeyPress,
  handleRowClick,
  filteredRows,
  highlightedRowIndex,
  tableRef,
  fetchDataAndDisplay,
  firstRowRef,
  firstColWidth,
  secondColWidth,
  firstColKey,
  secondColKey,
}) => {
  console.log("filteredRowsfilteredRowsfilteredRows", filteredRows);
  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Nav
        className="col-12 d-flex justify-content-between"
        style={{
          backgroundColor: "#3368b5",
          color: "#fff",
          height: "24px",
        }}
      >
        <div className="col-4 ">
          {/* <i className="fa fa-refresh fa-lg topBtn" title="Refresh"></i> */}
        </div>
        <div style={{ fontSize: "14px" }} className="col-4 text-center">
          <strong>{title}</strong>
        </div>
        <div className="text-end col-4">
          <NavLink
            onClick={handleClose}
            className="topBtn"
            style={{ marginTop: "-5%" }}
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
                    <td style={{ width: firstColWidth }}>{row[firstColKey]}</td>
                    <td
                      style={{
                        width: secondColWidth,
                        textAlign: "left",
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
          <tfoot>
            <tr style={{ fontSize: "11px" }}>
              <th
                className="sticky-footer-area"
                style={{
                  textAlign: "center",
                  width: firstColWidth,
                }}
              ></th>
              <th
                className="sticky-footer-area"
                style={{
                  width: secondColWidth,
                }}
              ></th>
            </tr>
          </tfoot>
        </table>
      </Modal.Body>
    </Modal>
  );
};

export default Complain_Type_Maitenance_Modal;
