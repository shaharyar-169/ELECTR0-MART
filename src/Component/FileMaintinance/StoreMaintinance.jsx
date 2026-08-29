import React, { useState } from "react";
import "./storemaintenance.css";
import { FiUpload, FiCamera, FiDownload } from "react-icons/fi";

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

function Field({ label, children }) {
  return (
    <label className="el-field">
      <span className="el-field-label">{label}</span>
      {children}
    </label>
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

  const contentStyle = {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: '"Verdana", Geneva, Tahoma, sans-serif',
  };

  return (
    <div className="el-page-host">
      <div className="el-page-wrapper" style={contentStyle}>
        <div className="el-page">
          <div className="el-card">
            <form onSubmit={handleSubmit}>
              <header className="el-header">
                <h1>Customer Maintenance</h1>
              </header>

              {/* Scrollable Body */}
              <div className="el-scrollable-body">
                <div className="el-body">
                  {/* LEFT LEDGER */}
                  <div className="el-ledger">
                    {/* TOP ROW: Code, Man, Ref, Status */}
                    <div className="el-top-fields">
                      <Field label="Code">
                        <div className="el-code-input">
                          <input
                            value={store.code}
                            onChange={set("code")}
                            placeholder="Store code"
                          />
                          <div className="el-stepper">
                            <button
                              type="button"
                              onClick={() => bumpCode(1)}
                              aria-label="Increment code"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => bumpCode(-1)}
                              aria-label="Decrement code"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </Field>

                      <Field label="Man">
                        <input
                          value={store.manager}
                          onChange={set("manager")}
                          placeholder="Manager name"
                        />
                      </Field>

                      <Field label="Ref">
                        <input
                          value={store.storeAbb}
                          onChange={set("storeAbb")}
                          placeholder="Reference"
                        />
                      </Field>

                      <Field label="Status">
                        <select value={store.status} onChange={set("status")}>
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    {/* SECOND ROW: Mobile, Name */}
                    <div className="el-second-row">
                      <Field label="Mobile">
                        <input
                          type="tel"
                          value={store.phone}
                          onChange={set("phone")}
                          placeholder="Mobile number"
                        />
                      </Field>

                      <Field label="Name">
                        <input
                          value={store.description}
                          onChange={set("description")}
                          placeholder="Store name"
                        />
                      </Field>
                    </div>

                    <section className="el-section">
                      <h2>Personal Info</h2>
                      
                      {/* Row 1: Name, Email */}
                      <div className="el-personal-row-1">
                        <Field label="Name">
                          <input
                            value={store.description}
                            onChange={set("description")}
                            placeholder="Full name"
                          />
                        </Field>

                        <Field label="Email">
                          <input
                            type="email"
                            value={store.email}
                            onChange={set("email")}
                            placeholder="Email address"
                          />
                        </Field>
                      </div>

                      {/* Row 2: Address1, Address2 */}
                      <div className="el-personal-row-2">
                        <Field label="Address1">
                          <input
                            value={store.address}
                            onChange={set("address")}
                            placeholder="Street address"
                          />
                        </Field>

                        <Field label="Address2">
                          <input
                            value={store.address2}
                            onChange={set("address2")}
                            placeholder="Address line 2"
                          />
                        </Field>
                      </div>

                      {/* Row 3: Type, CNIC, City */}
                      <div className="el-personal-row-3">
                        <Field label="Type">
                          <select value={store.storeType} onChange={set("storeType")}>
                            <option value="">Select type…</option>
                            <option value="Retail">Retail</option>
                            <option value="Warehouse">Warehouse</option>
                            <option value="Distribution">Distribution</option>
                            <option value="Outlet">Outlet</option>
                          </select>
                        </Field>

                        <Field label="CNIC">
                          <input
                            value={store.cnic}
                            onChange={set("cnic")}
                            placeholder="CNIC number"
                          />
                        </Field>

                        <Field label="City">
                          <input
                            value={store.city}
                            onChange={set("city")}
                            placeholder="City"
                          />
                        </Field>
                      </div>

                      {/* Row 4: Collector, Area, Group */}
                      <div className="el-personal-row-4">
                        <Field label="Collector">
                          <input
                            value={store.collector}
                            onChange={set("collector")}
                            placeholder="Collector name"
                          />
                        </Field>

                        <Field label="Area">
                          <input
                            value={store.area}
                            onChange={set("area")}
                            placeholder="Area/Locality"
                          />
                        </Field>

                        <Field label="Group">
                          <input
                            value={store.group}
                            onChange={set("group")}
                            placeholder="Group name"
                          />
                        </Field>
                      </div>
                    </section>

                    {/* Additional Info Section */}
                    <section className="el-section el-section-additional">
                      <h2>Additional Info</h2>
                      
                      {/* Row 1: Profession */}
                      <div className="el-additional-row-1">
                        <Field label="Profession">
                          <input
                            value={store.profession}
                            onChange={set("profession")}
                            placeholder="Profession/Occupation"
                          />
                        </Field>
                      </div>

                      {/* Row 2: Address1, Address2 */}
                      <div className="el-additional-row-2">
                        <Field label="Address1">
                          <input
                            value={store.address}
                            onChange={set("address")}
                            placeholder="Street address"
                          />
                        </Field>

                        <Field label="Address2">
                          <input
                            value={store.address2}
                            onChange={set("address2")}
                            placeholder="Address line 2"
                          />
                        </Field>
                      </div>

                      {/* Row 3: Contact, Monthly (low width) */}
                      <div className="el-additional-row-3">
                        <Field label="Contact">
                          <input
                            type="tel"
                            value={store.contact}
                            onChange={set("contact")}
                            placeholder="Contact number"
                          />
                        </Field>

                        <Field label="Monthly">
                          <input
                            type="number"
                            value={store.monthly}
                            onChange={set("monthly")}
                            placeholder="Monthly income"
                          />
                        </Field>
                      </div>
                    </section>

                    {/* Guarantor Info Section */}
                    <section className="el-section">
                      <h2>Guarantor Info</h2>
                      
                      {/* Row 1: Name, Full Name */}
                      <div className="el-guarantor-row-1">
                        <Field label="Name">
                          <input
                            value={store.g1Name}
                            onChange={set("g1Name")}
                            placeholder="Name"
                          />
                        </Field>

                        <Field label="Full Name">
                          <input
                            value={store.g1FullName}
                            onChange={set("g1FullName")}
                            placeholder="Full name"
                          />
                        </Field>
                      </div>

                      {/* Row 2: Address1, Address2 */}
                      <div className="el-guarantor-row-2">
                        <Field label="Address1">
                          <input
                            value={store.g1Address1}
                            onChange={set("g1Address1")}
                            placeholder="Street address"
                          />
                        </Field>

                        <Field label="Address2">
                          <input
                            value={store.g1Address2}
                            onChange={set("g1Address2")}
                            placeholder="Address line 2"
                          />
                        </Field>
                      </div>

                      {/* Row 3: Contact, CNIC (low width) */}
                      <div className="el-guarantor-row-3">
                        <Field label="Contact">
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
                    </section>

                    {/* Duplicate Guarantor Info Section */}
                    <section className="el-section">
                      <h2>Guarantor Info</h2>
                      
                      {/* Row 1: Name, Full Name */}
                      <div className="el-guarantor-row-1">
                        <Field label="Name">
                          <input
                            value={store.g2Name}
                            onChange={set("g2Name")}
                            placeholder="Name"
                          />
                        </Field>

                        <Field label="Full Name">
                          <input
                            value={store.g2FullName}
                            onChange={set("g2FullName")}
                            placeholder="Full name"
                          />
                        </Field>
                      </div>

                      {/* Row 2: Address1, Address2 */}
                      <div className="el-guarantor-row-2">
                        <Field label="Address1">
                          <input
                            value={store.g2Address1}
                            onChange={set("g2Address1")}
                            placeholder="Street address"
                          />
                        </Field>

                        <Field label="Address2">
                          <input
                            value={store.g2Address2}
                            onChange={set("g2Address2")}
                            placeholder="Address line 2"
                          />
                        </Field>
                      </div>

                      {/* Row 3: Contact, CNIC (low width) */}
                      <div className="el-guarantor-row-3">
                        <Field label="Contact">
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
                    </section>

                    {/* Financial Standing - No heading, just line */}
                    <div className="el-financial-line"></div>

                    <div className="el-financial-fields">
                      {/* Row 1: Verify, Date (low width) */}
                      <div className="el-financial-row-1">
                        <Field label="Verify">
                          <input
                            value={store.verify}
                            onChange={set("verify")}
                            placeholder="Verify"
                          />
                        </Field>

                        <Field label="Date">
                          <input
                            type="date"
                            value={store.date}
                            onChange={set("date")}
                          />
                        </Field>
                      </div>

                      {/* Row 2: Remarks (large height) */}
                      <div className="el-financial-row-2">
                        <Field label="Remarks">
                          <textarea
                            value={store.remarks}
                            onChange={set("remarks")}
                            placeholder="Remarks"
                            rows={3}
                          />
                        </Field>
                      </div>

                      {/* Row 3: Document with Upload & Download */}
                      <div className="el-financial-row-3">
                        <div className="el-document-wrapper">
                          <span className="el-document-label">Document</span>
                          <div className="el-document-actions">
                            <button type="button" className="el-btn el-btn-ghost el-btn-doc">
                              <FiUpload className="el-btn-icon" />
                              Upload
                            </button>
                            <span className="el-download-label">Download</span>
                            <button type="button" className="el-btn el-btn-ghost el-btn-doc">
                              <FiDownload className="el-btn-icon" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="el-form-actions">
                      <button type="submit" className="el-btn el-btn-save">
                        Save
                      </button>

                      <button type="button" className="el-btn el-btn-return">
                        Return
                      </button>

                      <button type="button" className="el-btn el-btn-new">
                        New
                      </button>
                    </div>
                  </div>

                  {/* RIGHT RAIL - Photo upload with Guarantor images */}
                  <aside className="el-rail">
                    <div className="el-rail-content">
                      {/* Main Photo */}
                      <div className="el-photo">
                        <div className="el-photo-frame">
                          <span>🏪</span>
                        </div>
                        <div className="el-photo-actions">
                          <button type="button" className="el-btn el-btn-ghost">
                            <FiUpload className="el-btn-icon" />
                            Upload
                          </button>
                          <button type="button" className="el-btn el-btn-ghost">
                            <FiCamera className="el-btn-icon" />
                            Camera
                          </button>
                        </div>
                      </div>

                      {/* Guarantor 1 Photo */}
                      <div className="el-photo el-photo-guarantor" style={{marginTop:'155px'}}>
                        <div className="el-photo-frame el-photo-frame-small">
                          <span>👤</span>
                        </div>
                        <div className="el-photo-label">Guarantor 1</div>
                        <div className="el-photo-actions">
                          <button type="button" className="el-btn el-btn-ghost">
                            <FiUpload className="el-btn-icon" />
                            Upload
                          </button>
                          <button type="button" className="el-btn el-btn-ghost">
                            <FiCamera className="el-btn-icon" />
                            Camera
                          </button>
                        </div>
                      </div>

                      {/* Guarantor 2 Photo */}
                      <div className="el-photo el-photo-guarantor">
                        <div className="el-photo-frame el-photo-frame-small">
                          <span>👤</span>
                        </div>
                        <div className="el-photo-label">Guarantor 2</div>
                        <div className="el-photo-actions">
                          <button type="button" className="el-btn el-btn-ghost">
                            <FiUpload className="el-btn-icon" />
                            Upload
                          </button>
                          <button type="button" className="el-btn el-btn-ghost">
                            <FiCamera className="el-btn-icon" />
                            Camera
                          </button>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}