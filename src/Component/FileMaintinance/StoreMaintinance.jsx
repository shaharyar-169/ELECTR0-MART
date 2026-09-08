import React, { useState } from "react";
import "./storemaintenance.css";
import { FiUpload, FiCamera, FiDownload, FiPlus } from "react-icons/fi";

const STOCK_OPTIONS = ["In Stock", "Out of Stock", "Low Stock", "Pre-Order"];
const STATUS_OPTIONS = ["Active", "Inactive", "Pending", "Closed"];

const emptyStore = {
  code: "",
  status: "Active",
  description: "",
  storeAbb: "",
  stock: "In Stock",
  manager: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  openingDate: "",
  closingTime: "",
  storeType: "",
  region: "",
  area: "",
  creditDays: "",
  creditLimit: "",
  debit: "",
  credit: "",
  amount: "",
  dueDate: "",
  address2: "",
  cnic: "",
  collector: "",
  group: "",
  profession: "",
  contact: "",
  monthly: "",
  fullName: "",
  g1Name: "",
  g1FullName: "",
  g1Address1: "",
  g1Address2: "",
  g1Contact: "",
  g1Cnic: "",
  g2Name: "",
  g2FullName: "",
  g2Address1: "",
  g2Address2: "",
  g2Contact: "",
  g2Cnic: "",
  verify: "",
  date: "",
  remarks: "",
};

function Field({ label, children, className = "" }) {
  return (
    <div className={`el-field ${className}`}>
      <span className="el-field-label">{label}</span>
      {children}
    </div>
  );
}

export default function StoreMaintenance() {
  const [store, setStore] = useState(emptyStore);

  const set = (key) => (e) =>
    setStore((prev) => ({ ...prev, [key]: e.target.value }));

  const bumpCode = (dir) => {
    setStore((prev) => {
      const currentCode = parseInt(prev.code, 10) || 0;
      const next = Math.max(0, currentCode + dir);
      return { ...prev, code: String(next).padStart(4, "0") };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Store data saved:", store);
  };

  return (
    <div className="el-page-host">
      <div className="el-page-wrapper">
        <div className="el-page">
          <div className="el-card">
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <header className="el-header">
                <h1>Customer Maintenance</h1>
                <p className="el-subtitle">
                  Enter the customer information in the form below
                </p>
              </header>

              {/* Scrollable Body */}
              <div className="el-scrollable-body">
                {/* TOP BAR: Code + Status */}
                <div className="el-top-bar">
                  <Field label="CODE" className="el-code-field">
                    <div className="el-code-input">
                      <input
                        value={store.code}
                        onChange={set("code")}
                        placeholder="Code"
                      />
                      <div className="el-stepper">
                        <button type="button" onClick={() => bumpCode(1)}>▲</button>
                        <button type="button" onClick={() => bumpCode(-1)}>▼</button>
                      </div>
                    </div>
                  </Field>

                  <Field label="STATUS" className="el-status-field">
                    <select value={store.status} onChange={set("status")}>
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="el-body">
                  {/* LEFT COLUMN */}
                  <div className="el-main-content">
                    {/* Personal Information */}
                    <section className="el-section">
                      <h2>Personal Information</h2>

                      <div className="el-stack">
                        <Field label="NAME">
                          <input
                            value={store.description}
                            onChange={set("description")}
                            placeholder="Enter Name"
                          />
                        </Field>

                        <Field label="ADDRESS1">
                          <input
                            value={store.address}
                            onChange={set("address")}
                            placeholder="Enter Address"
                          />
                        </Field>

                        <Field label="ADDRESS2">
                          <input
                            value={store.address2}
                            onChange={set("address2")}
                            placeholder="Enter Address 2"
                          />
                        </Field>

                        <div className="el-row-2">
                          <Field label="MOBILE">
                            <input
                              type="tel"
                              value={store.phone}
                              onChange={set("phone")}
                              placeholder="Enter Mobile"
                            />
                          </Field>

                          <Field label="CITY">
                            <input
                              value={store.city}
                              onChange={set("city")}
                              placeholder="Enter City"
                            />
                          </Field>
                        </div>

                        <div className="el-row-2">
                          <Field label="CONTACT">
                            <input
                              type="tel"
                              value={store.phone}
                              onChange={set("phone")}
                              placeholder="Enter Contact Number"
                            />
                          </Field>

                          <Field label="NAME (ALT)">
                            <input
                              value={store.description}
                              onChange={set("description")}
                              placeholder="Enter Name"
                            />
                          </Field>
                        </div>
                      </div>
                    </section>

                    {/* Guarantor Info Section */}
                    <section className="el-section el-section-guarantor">
                      <h2>Guarantor Info</h2>

                      <div className="el-guarantor-grid">
                        {/* Left side - Guarantor 1 */}
                        <div className="el-guarantor-col">
                          <div className="el-guarantor-fields">
                            <Field label="NAME">
                              <input
                                value={store.g1Name}
                                onChange={set("g1Name")}
                                placeholder="Name"
                              />
                            </Field>

                            <Field label="FULL NAME">
                              <input
                                value={store.g1FullName}
                                onChange={set("g1FullName")}
                                placeholder="Full name"
                              />
                            </Field>

                            <Field label="ADDRESS1">
                              <input
                                value={store.g1Address1}
                                onChange={set("g1Address1")}
                                placeholder="Street address"
                              />
                            </Field>

                            <Field label="ADDRESS2">
                              <input
                                value={store.g1Address2}
                                onChange={set("g1Address2")}
                                placeholder="Address line 2"
                              />
                            </Field>

                            <div className="el-guarantor-contact-row">
                              <Field label="CONTACT">
                                <input
                                  type="tel"
                                  value={store.g1Contact}
                                  onChange={set("g1Contact")}
                                  placeholder="Contact number"
                                />
                              </Field>

                              <Field label="CNIC">
                                <input
                                  value={store.g1Cnic}
                                  onChange={set("g1Cnic")}
                                  placeholder="CNIC number"
                                />
                              </Field>
                            </div>
                          </div>
                        </div>

                        {/* Right side - Guarantor 2 */}
                        <div className="el-guarantor-col">
                          <div className="el-guarantor-fields">
                            <Field label="NAME">
                              <input
                                value={store.g2Name}
                                onChange={set("g2Name")}
                                placeholder="Name"
                              />
                            </Field>

                            <Field label="FULL NAME">
                              <input
                                value={store.g2FullName}
                                onChange={set("g2FullName")}
                                placeholder="Full name"
                              />
                            </Field>

                            <Field label="ADDRESS1">
                              <input
                                value={store.g2Address1}
                                onChange={set("g2Address1")}
                                placeholder="Street address"
                              />
                            </Field>

                            <Field label="ADDRESS2">
                              <input
                                value={store.g2Address2}
                                onChange={set("g2Address2")}
                                placeholder="Address line 2"
                              />
                            </Field>

                            <div className="el-guarantor-contact-row">
                              <Field label="CONTACT">
                                <input
                                  type="tel"
                                  value={store.g2Contact}
                                  onChange={set("g2Contact")}
                                  placeholder="Contact number"
                                />
                              </Field>

                              <Field label="CNIC">
                                <input
                                  value={store.g2Cnic}
                                  onChange={set("g2Cnic")}
                                  placeholder="CNIC number"
                                />
                              </Field>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Verification Section */}
                    <section className="el-section">
                      <h2>Verification</h2>

                      <div className="el-row-3">
                        <Field label="DATE">
                          <input
                            type="date"
                            value={store.date}
                            onChange={set("date")}
                          />
                        </Field>

                        <Field label="VERIFY">
                          <input
                            value={store.verify}
                            onChange={set("verify")}
                            placeholder="Verify"
                          />
                        </Field>
                      </div>

                      <div className="el-document-wrapper">
                        <span className="el-document-label">DOCUMENT</span>
                        <div className="el-document-actions">
                          <button type="button" className="el-btn-doc el-btn-upload">
                            <FiUpload className="el-btn-icon" />
                            Upload
                          </button>
                          <button type="button" className="el-btn-doc el-btn-download">
                            <FiDownload className="el-btn-icon" />
                            Download
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* Remarks Section */}
                    <section className="el-section">
                      <h2>Remarks</h2>
                      <Field label="" className="el-remarks-field">
                        <textarea
                          value={store.remarks}
                          onChange={set("remarks")}
                          placeholder="Enter Remarks"
                          rows={3}
                        />
                      </Field>
                    </section>
                  </div>

                  {/* RIGHT RAIL - Photo Section */}
                  <aside className="el-rail">
                    <div className="el-rail-content">
                      {/* Main Photo — aligned with Name field */}
                      <div className="el-photo el-photo-primary">
                        <div className="el-photo-label">Profile Picture</div>
                        <div className="el-photo-frame">
                          <span>👤</span>
                        </div>
                        <div className="el-photo-actions">
                          <button type="button" className="el-btn el-btn-primary-pill">
                            <FiPlus className="el-btn-icon" /> Upload Photo
                          </button>
                          {/* <button type="button" className="el-btn el-btn-ghost-pill">
                            <FiCamera className="el-btn-icon" /> Camera
                          </button> */}
                        </div>
                        <div className="el-photo-hint">Supports JPG, PNG, WebP</div>
                      </div>

                      {/* Guarantor 1 Photo — aligned with Guarantor 1 fields */}
                      <div className="el-photo el-photo-guarantor">
                        <div className="el-photo-label">Guarantor 1</div>
                        <div className="el-photo-frame el-photo-frame-small">
                          <span>👤</span>
                        </div>
                        <div className="el-photo-actions">
                          <button type="button" className="el-btn el-btn-primary-pill">
                            <FiPlus className="el-btn-icon" /> Upload
                          </button>
                          {/* <button type="button" className="el-btn el-btn-ghost-pill">
                            <FiCamera className="el-btn-icon" /> Camera
                          </button> */}
                        </div>
                        <div className="el-photo-hint">Supports JPG, PNG, WebP</div>
                      </div>

                      {/* Guarantor 2 Photo — aligned with Guarantor 2 fields */}
                      <div className="el-photo el-photo-guarantor">
                        <div className="el-photo-label">Guarantor 2</div>
                        <div className="el-photo-frame el-photo-frame-small">
                          <span>👤</span>
                        </div>
                        <div className="el-photo-actions">
                          <button type="button" className="el-btn el-btn-primary-pill">
                            <FiPlus className="el-btn-icon" /> Upload
                          </button>
                          {/* <button type="button" className="el-btn el-btn-ghost-pill">
                            <FiCamera className="el-btn-icon" /> Camera
                          </button> */}
                        </div>
                        <div className="el-photo-hint">Supports JPG, PNG, WebP</div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>

              {/* Buttons */}
              <div className="el-form-actions">
                <button type="submit" className="el-btn el-btn-save">Save</button>
                <button type="button" className="el-btn el-btn-return">Return</button>
                <button type="button" className="el-btn el-btn-new">New</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}