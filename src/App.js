import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";
import HomePage1 from "./Component/MainComponent/HomePage/Homepage";
import { ThemeProvider } from "./ThemeContext";
import Loginn from "./Component/MainComponent/Loginn/Login";
import Category_Maintenance from "./Component/File/Category_Maintenance/Category_Maintenance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./Component/i18n.js";
import Account_Code_Maintenance from "./Component/File/Account_Code_Maintenance/Account_Code_Maintenance";
import Item_Maintenance from "./Component/File/Item_Maintenance/Item_Maintenance";
import Company_Maintenance from "../src/Component/File/Company_Maintenance/Company_Maintenance";
import Capacity_Maintenance from "./Component/File/Capacity_Maintenance/Capacity_Maintenance";
import Type_Maintenance from "./Component/File/Type_Maintenance/Type_Maintenance";
import UserMaintenance from "./Component/Utilities/UserManagement/UserManagement1.jsx";
import MenuUser from "./Component/Utilities/UserManagement/MenuUser/MenuUser.jsx";
import Layout from "./Component/MainComponent/Layout/Layout.js";
import AddUser1 from "./Component/Utilities/UserManagement/AddUser/AddUser.jsx";
import Customer from "./Component/MainComponent/Header/Admin/Customer.jsx";
import MenuAdmin from "./Component/MainComponent/Header/Admin/MenuAdmin/MenuAdmin.jsx";


//////////////////////////// List reports //////////////////////////////
import CompanyList from "./Component/Reports/Daily_Jobs_Reports/List/CompanyList.js";
import CategoryList from "./Component/Reports/Daily_Jobs_Reports/List/CategoryList.js";
import ChartofAccount from "./Component/Reports/Daily_Jobs_Reports/List/ChartofAccount.js";
import StoreList from "./Component/Reports/Daily_Jobs_Reports/List/StoreList.js";

//////////////////////////// ledger reports //////////////////////////////
import GeneralLedger from "./Component/Reports/Daily_Jobs_Reports/ledgers/GeneralLedger.js";
import SupplierLedger from "./Component/Reports/Daily_Jobs_Reports/ledgers/SupplierLedger.js";
import CustomerLedger from "./Component/Reports/Daily_Jobs_Reports/ledgers/CustomerLedger.js";
import BankRegisterLedger from "./Component/Reports/Daily_Jobs_Reports/ledgers/BankRegisterLedger.js";
import SupplierprogressReport from "./Component/Reports/Daily_Jobs_Reports/ledgers/SupplierprogressReport.js";

function App() {
  const queryClient = new QueryClient();

  const globadata={
    tableTopColor : "#3368B5",
	 tableHeadColor: "#C6DAF7",
	 headerColor : "#D9DADF",
	 secondaryColor : "#F5F5F5",
	 textColor : "#fff",
	 btnColor : "#3368B5",
	 apiLink : "https://crystalsolutions.com.pk/emart/web"
  }

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Router basename="/crystalsol">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route exact path="/" element={<Loginn />} />
              <Route exact path="/login" element={<Loginn />} />
              <Route element={<Layout />}>
                {/* All pages with the sidebar */}
                <Route exact path="/MainPage" element={<HomePage1 />} />
                <Route exact path="/AccountCodeMaintenance" element={<Account_Code_Maintenance />} />
                <Route exact path="/ItemMaintenance" element={<Item_Maintenance />} />
                <Route exact path="/Customer" element={<Customer />} />
                <Route exact path="/MenuAdmin" element={<MenuAdmin />} />
                <Route exact path="/CompanyMaintenance" element={<Company_Maintenance />} />
                <Route exact path="/TypeMaintenance" element={<Type_Maintenance />} />
                <Route exact path="/CategoryMaintenance" element={<Category_Maintenance />} />
                <Route exact path="/CapacityMaintenance" element={<Capacity_Maintenance />} />
                <Route exact path="/UserManagement" element={<UserMaintenance />} />

                 {/* Rountes for List reports */}
                 <Route exact path="/CompanyList" element={<CompanyList />} />
                 <Route exact path="/CategoryList" element={<CategoryList />} />
                 <Route exact path="/CharofAccount" element={<ChartofAccount />} />
                 <Route exact path="/StoreList" element={<StoreList />} />


                {/* Rountes for ledgers reports */}
                <Route exact path="/GeneralLedger1" element={<GeneralLedger />} />
                <Route exact path="/SupplierLedger" element={<SupplierLedger />} />
                <Route exact path="/CustomerLedger" element={<CustomerLedger />} />
                <Route exact path="/BankRegister" element={<BankRegisterLedger />} />
                <Route exact path="/SupplieProgress" element={<SupplierprogressReport />} />


                <Route exact path="/MenuUser/:tusrid" element={<MenuUser />} />
                <Route exact path="/AddUser1" element={<AddUser1 />} />
              </Route>
            </Routes>
          </QueryClientProvider>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
