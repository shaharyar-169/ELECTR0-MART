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

//////////////////////////// DASHBOARD //////////////////////////////
import Dashboard from "./Component/MainComponent/Dashboard/Dashboard.jsx";
//////////////////////////// DASHBOARD //////////////////////////////
import DashboardAdminDealer from "./Component/MainComponent/Dashboard2/Dashboard2.jsx";
//////////////////////////// RESTURENT DASHBOARD //////////////////////////////
import ResturentDashboard from "./Component/MainComponent/ResturentDashboard/Resturentdashboad.jsx";
//////////////////////////// GYM DASHBOARD //////////////////////////////
import GYMDashboard from "./Component/MainComponent/GYMDashboard/Gym.jsx";

//////////////////////////// List reports //////////////////////////////
import CompanyList from "./Component/Reports/Daily_Jobs_Reports/List/CompanyList1.js";
import CategoryList from "./Component/Reports/Daily_Jobs_Reports/List/CategoryList.js";
import ChartofAccount from "./Component/Reports/Daily_Jobs_Reports/List/ChartofAccount.js";
import StoreList from "./Component/Reports/Daily_Jobs_Reports/List/StoreList.js";
import CapacityList from "./Component/Reports/Daily_Jobs_Reports/List/CapacityList.js";
import TypeList from "./Component/Reports/Daily_Jobs_Reports/List/TypeList.js";
import EmployeeList from "./Component/Reports/Daily_Jobs_Reports/List/EmployeeList.js";
import UserList from "./Component/Reports/Daily_Jobs_Reports/List/UserList.js";
import ItemList from "./Component/Reports/Daily_Jobs_Reports/List/itemList.js";
import ItemPriceList from "./Component/Reports/Daily_Jobs_Reports/List/ItemPriceList.js";
import ItemPriceListA from "./Component/Reports/Daily_Jobs_Reports/List/ItemPriceListA.js";
import MobileListReport from "./Component/Reports/Daily_Jobs_Reports/List/MobileListReport.js";
import TechnicianList from "./Component/Reports/Daily_Jobs_Reports/List/TechnicionList.js";
import CityList from "./Component/Reports/Daily_Jobs_Reports/List/CityList.js";
import AreaList from "./Component/Reports/Daily_Jobs_Reports/List/AreaList.js";
import ComplaintList from "./Component/Reports/Daily_Jobs_Reports/List/ComplaintList.js";
import ReferenceList from "./Component/Reports/Daily_Jobs_Reports/List/ReferenceList.js";
import ControlList from "./Component/Reports/Daily_Jobs_Reports/List/ControlList.js";
import WorkShopItemList from "./Component/Reports/Daily_Jobs_Reports/List/WorkshopItemList.js";
import SalesmanList from "./Component/Reports/Daily_Jobs_Reports/List/SalesmanList.js";
import ManagerList from "./Component/Reports/Daily_Jobs_Reports/List/ManagerList.js";
import RegionList from "./Component/Reports/Daily_Jobs_Reports/List/RegionList.js";
import CustomerListAmerican from "./Component/Reports/Daily_Jobs_Reports/List/CustomerListAmerican.js";
import InstallerList from "./Component/Reports/Daily_Jobs_Reports/List/InstallarList.js";
import CategoryListPos from "./Component/Reports/Daily_Jobs_Reports/List/CategoryListPos.js";
import ClassList from "./Component/Reports/Daily_Jobs_Reports/List/ClassList.js";
import FacilityList from "./Component/Reports/Daily_Jobs_Reports/List/FacilityList.js";
import SlotList from "./Component/Reports/Daily_Jobs_Reports/List/SlotList.js";
import MembersList from "./Component/Reports/Daily_Jobs_Reports/List/MmembersList.js";
import TrainerList from "./Component/Reports/Daily_Jobs_Reports/List/TrainerList.js";
import MemberTypeList from "./Component/Reports/Daily_Jobs_Reports/List/MemberTypeList.js";
import GoalList from "./Component/Reports/Daily_Jobs_Reports/List/GoalList.js";
import CollectorList from "./Component/Reports/Daily_Jobs_Reports/List/CollectorList.js";
import MembersList1 from "./Component/Reports/Daily_Jobs_Reports/List/MemberList1.js";
import PriceListPurSale from "./Component/Reports/Daily_Jobs_Reports/List/PriceListPurSale.js";
import PriceListAPurSale from "./Component/Reports/Daily_Jobs_Reports/List/PriceListAPurSal.js";
import SparePartsList from "./Component/Reports/Daily_Jobs_Reports/List/SparePartsList.js";
import ItemPriceList2 from "./Component/Reports/Daily_Jobs_Reports/List/ItempriceList2.js";
import HelperList from "./Component/Reports/Daily_Jobs_Reports/List/HelperList.js";

//////////////////////////// JOb reports //////////////////////////////
import SparePartProfitReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/SparePartProfitreport.js";
import SparePartProfitSummary from "./Component/Reports/Daily_Jobs_Reports/JobReports/SparePartProfitSummary.js";
import TechnicianPerformanceReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/TechnicianPerformanceReport.js";
import TechnicianAggingReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/TechnicianAggingreport.js";
import CompanyPerformanceReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/CompanyPerformance.js";
import ReferencePerformanceReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/ReferencePerformancereport.js";
import ReferenceReceivableReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/ReferenceRecievable.js";
import CompanyReceivableReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/CompanyRecievable.js";
import TechnicianJobStatusReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/TechnicianJobstatus.js";
import ReferenceJobStatusReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/ReferenceJobStatus.js";
import TechnicianMonthlyJobStatusReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/TechnicianMonthlyJobStatus.js";
import ReferenceMonthlyJobStatusReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/ReferenceMonthlyJobStatus.js";
import CompanyJobComparison from "./Component/Reports/Daily_Jobs_Reports/JobReports/CompanyJobComparison.js";
import CategoryJobComparison from "./Component/Reports/Daily_Jobs_Reports/JobReports/CategoryJobComparison.js";
import CompanyMonthlyJobComparison from "./Component/Reports/Daily_Jobs_Reports/JobReports/CompanyMonthlyJobComparison.js";
import CategoryMonthlyJobComparison from "./Component/Reports/Daily_Jobs_Reports/JobReports/CategoryMonthlyJobComparison.js";
import CompanyJobSummary from "./Component/Reports/Daily_Jobs_Reports/JobReports/CompanyJobSummary.js";
import CategoryJobSummary from "./Component/Reports/Daily_Jobs_Reports/JobReports/CategoryJobSummary.js";
import CompanyJobStatusReport from "./Component/Reports/Daily_Jobs_Reports/JobReports/CompanyjobStatus.js";

//////////////////////////// ledger reports //////////////////////////////
import GeneralLedger1 from "./Component/Reports/Daily_Jobs_Reports/ledgers/GeneralLeder1.js";
import SupplierLedger1 from "./Component/Reports/Daily_Jobs_Reports/ledgers/SupplierLedger1.js";
import CustomerLedger1 from "./Component/Reports/Daily_Jobs_Reports/ledgers/CustomerLedger1.js";
import BankRegisterLedger1 from "./Component/Reports/Daily_Jobs_Reports/ledgers/BankRegisterLedger1.js";
import CustomerProgressLedger from "./Component/Reports/Daily_Jobs_Reports/ledgers/CustomerprogressReport.js";
import MobileLedger from "./Component/Reports/Daily_Jobs_Reports/ledgers/MobileLedger.js";
import SupplierprogressReport from "./Component/Reports/Daily_Jobs_Reports/ledgers/SupplierprogressReport.js";
import ItemLedgerReport from "./Component/Reports/Daily_Jobs_Reports/ledgers/ItemLedgerReport.js";
import ItemEvaluationReport from "./Component/Reports/Daily_Jobs_Reports/ledgers/ItemEvaluationReport.js";
import InvoiceLedgerReport from "./Component/Reports/Daily_Jobs_Reports/ledgers/InvoiceLedger.js";
import MobileLedgerJob from "./Component/Reports/Daily_Jobs_Reports/ledgers/MobileLedgerJob.js";
import ItemAggingReport from "./Component/Reports/Daily_Jobs_Reports/ledgers/ItemAggingReport.js";
import SupplierLedgerpos from "./Component/Reports/Daily_Jobs_Reports/ledgers/SupplierLedgerpos.js";

//////////////////////////// Daily reports //////////////////////////////
import DailyCashBook from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyCashBook.js";
import JournalReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/Journal.js";
import DailyCreditReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyCreditMemo.js";
import DocumentEditReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DocumentEditReport.js";
import DailyProfitReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyProfitReport.js";
import CashFlowReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/CashFlow.js";
import DailyStatusReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailystatusReport.js";
import DailyCollectionReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyCollectionReport.js";
import DailyPaymentReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyPaymentReport.js";
import DailyCashBankBalance from "./Component/Reports/Daily_Jobs_Reports/DailyReports/CashBankBalanceReport.js";
import DailySaleReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailySaleReport.js";
import DailyPurchaseReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyPurchaseReport.js";
import DailyJobReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyJobReport.js";
import DailyCollectionSummary from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyCollectionSummary.js";
import DailySaleReportPosReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailySaleReportPos.js";
import DailySaleDetailReportPos from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailySaleDetailReportPos.js";
import DailyPurchaseDetailReportPos from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyPurchaseDetailReportPos.js";
import DailyMemberCollectionReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyMemberColletion.js";
import DailyMemberCollectionSummaryReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/DailyMemberCollectionSummary.js";
import ExpenseReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/ExpenseReport.js";
import TechnicianCollectionReport from "./Component/Reports/Daily_Jobs_Reports/DailyReports/TechnicianCollectionReport.js";
//////////////////////////// Installments reports //////////////////////////////

import InstallmentBalanceReport from "./Component/Reports/Daily_Jobs_Reports/InstallmentReport/InstallmentBalanceReport.js";
import InstallmentSaleReport from "./Component/Reports/Daily_Jobs_Reports/InstallmentReport/InstallmentSaleReport.js";
import InstallmentCollectReport from "./Component/Reports/Daily_Jobs_Reports/InstallmentReport/InstallmentCollectReport.js";
import InstallmentLedgerReport from "./Component/Reports/Daily_Jobs_Reports/InstallmentReport/InstallmentLedgerReport.js";
import InstallmentCollectionDailyComparison from "./Component/Reports/Daily_Jobs_Reports/InstallmentReport/InstallmentCollectionDailyComparison.js";
import InstallmentCollectionMonthlyComparison from "./Component/Reports/Daily_Jobs_Reports/InstallmentReport/InstallmentCollectionMonthlyComparison.js";

//////////////////////////// Item reports //////////////////////////////
import ItemPurchaseSummary from "./Component/Reports/Daily_Jobs_Reports/ItemReports/ItemPurchaseSummaryReport.js";
import ItemStockReportPos from "./Component/Reports/Daily_Jobs_Reports/ItemReports/Itemstockreportpos.js";
import ItemStockReport from "./Component/Reports/Daily_Jobs_Reports/ItemReports/itemStockReport.js";
import ItemStoreStockReport from "./Component/Reports/Daily_Jobs_Reports/ItemReports/ItemstorestockRrport.js";
import ItemSaleReport from "./Component/Reports/Daily_Jobs_Reports/ItemReports/ItemSaleReport.js";
import ItemPurchaseReport from "./Component/Reports/Daily_Jobs_Reports/ItemReports/ItempurchaseReport.js";
import ItemStatusReport from "./Component/Reports/Daily_Jobs_Reports/ItemReports/ItemStatusReport.js";
import ItemSaleSummaryReport from "./Component/Reports/Daily_Jobs_Reports/ItemReports/ItemSaleSummaryReport.js";
import ItemEvalutionReport from "./Component/Reports/Daily_Jobs_Reports/ItemReports/ItemEvalutionReport.js";
import ItemReorderLevelReport from "./Component/Reports/Daily_Jobs_Reports/ItemReports/ItemReorderLevelReport.js";

//////////////////////////// MISC REPORT //////////////////////////////
import EmployeeAdvanceReport from "./Component/Reports/Daily_Jobs_Reports/EmployeeReports/EmployeeAdvanceReport.js";
import EmployeeSaleReport from "./Component/Reports/Daily_Jobs_Reports/EmployeeReports/EmployeeSaleReport.js";
import EmployeeSaleSummaryReport from "./Component/Reports/Daily_Jobs_Reports/EmployeeReports/EmployeeSaleSummaryReport.js";

//////////////////////////// Transection reports //////////////////////////////
import MemberCreditMemo from "./Component/Transaction/CreditMemoBil.js";
import MemberRecivableReport from "./Component/Transaction/MemberRecievableReport.js";

//////////////////////////// MISC REPORT //////////////////////////////
import ReceivableReport from "./Component/Reports/Daily_Jobs_Reports/Misc Reports/ReceivableReport.js";
import PayableReport from "./Component/Reports/Daily_Jobs_Reports/Misc Reports/Payablereport.js";
import ReceivableAggingReport from "./Component/Reports/Daily_Jobs_Reports/Misc Reports/ReceiableAggingReport.js";
import PayableAggingReport from "./Component/Reports/Daily_Jobs_Reports/Misc Reports/PayableAggingReport.js";

//////////////////////////// FBR DATA reports //////////////////////////////
import FbrDataReport from "./Component/Reports/Daily_Jobs_Reports/UtilitiesReport/FbrData.js";
import TaxSaleRegisterReport from "./Component/Reports/Daily_Jobs_Reports/UtilitiesReport/TaxsaleRegister.js";
function App() {
  const queryClient = new QueryClient();

  const globadata = {
    tableTopColor: "#3368B5",
    tableHeadColor: "#C6DAF7",
    headerColor: "#D9DADF",
    secondaryColor: "#F5F5F5",
    textColor: "#fff",
    btnColor: "#3368B5",
    apiLink: "https://crystalsolutions.com.pk/emart/web"
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
                <Route exact path="/CapacityList" element={<CapacityList />} />
                <Route exact path="/TypeList" element={<TypeList />} />
                <Route exact path="/EmployeeList" element={<EmployeeList />} />
                <Route exact path="/UserList" element={<UserList />} />
                <Route exact path="/ItemList" element={<ItemList />} />
                <Route exact path="/PriceList" element={<ItemPriceList />} />
                {/* <Route exact path="/PriceList" element={<ItemPriceList2 />} /> */}

                <Route exact path="/PriceListA" element={<ItemPriceListA />} />
                <Route exact path="/MobileList" element={<MobileListReport />} />
                <Route exact path="/TechnicianList" element={<TechnicianList />} />
                <Route exact path="/CityList" element={<CityList />} />
                <Route exact path="/AreaList" element={<AreaList />} />
                <Route exact path="/ComplaintList" element={<ComplaintList />} />
                <Route exact path="/ReferenceList" element={<ReferenceList />} />
                <Route exact path="/ControlList" element={<ControlList />} />
                <Route exact path="/WorkShopItem" element={<WorkShopItemList />} />
                <Route exact path="/SalesmanList" element={<SalesmanList />} />
                <Route exact path="/ManagerList" element={<ManagerList />} />
                <Route exact path="/RegionList" element={<RegionList />} />
                <Route exact path="/CustomerList" element={<CustomerListAmerican />} />
                <Route exact path="/InstallarList" element={<InstallerList />} />
                <Route exact path="/CategorListPOS" element={<CategoryListPos />} />
                <Route exact path="/ClassList" element={<ClassList />} />
                <Route exact path="/FacilityList" element={<FacilityList />} />
                <Route exact path="/SlotList" element={<SlotList />} />
                <Route exact path="/MemberList" element={<MembersList />} />
                <Route exact path="/TrainerList" element={<TrainerList />} />
                <Route exact path="/MemberTypeList" element={<MemberTypeList />} />
                <Route exact path="/GoalList" element={<GoalList />} />
                <Route exact path="/CollectorList" element={<CollectorList />} />
                <Route exact path="/MemberList" element={< MembersList1 />} />
                <Route exact path="/PriceListPurSale" element={< PriceListPurSale />} />
                <Route exact path="/PriceListAPurSal" element={< PriceListAPurSale />} />
                <Route exact path="/SparePartsList" element={< SparePartsList />} />
                <Route exact path="/CategoryListPOS" element={< CategoryListPos />} />
                <Route exact path="/HelperList" element={< HelperList />} />


                {/* Rountes for ledgers reports */}
                <Route exact path="/GeneralLedger1" element={<GeneralLedger1 />} />
                <Route exact path="/SupplierLedger" element={<SupplierLedger1 />} />
                <Route exact path="/CustomerLedger" element={<CustomerLedger1 />} />
                <Route exact path="/BankRegister" element={<BankRegisterLedger1 />} />
                <Route exact path="/SupplieProgress" element={<SupplierprogressReport />} />
                <Route exact path="/CustomerProgress" element={<CustomerProgressLedger />} />
                <Route exact path="/MobileLedger" element={<MobileLedger />} />
                <Route exact path="/ItemLedger" element={<ItemLedgerReport />} />
                <Route exact path="/ItemAgging" element={<ItemAggingReport />} />
                <Route exact path="/InvoiceLedger" element={<InvoiceLedgerReport />} />
                <Route exact path="/MobileLedgerJob" element={<MobileLedgerJob />} />
                <Route exact path="/SupplierLedgerPos" element={<SupplierLedgerpos />} />


                {/* Rountes for Job reports */}
                <Route exact path="/SparePartsProfitReport" element={<SparePartProfitReport />} />
                <Route exact path="/SparePartsProfitSummary" element={<SparePartProfitSummary />} />
                <Route exact path="/TechnicianPerformance" element={<TechnicianPerformanceReport />} />
                <Route exact path="/TechnicianAgging" element={<TechnicianAggingReport />} />
                <Route exact path="/CompanyPerformance" element={<CompanyPerformanceReport />} />
                <Route exact path="/ReferencePerformance" element={<ReferencePerformanceReport />} />
                <Route exact path="/ReferenceReceivable" element={<ReferenceReceivableReport />} />
                <Route exact path="/CompanyReceivable" element={<CompanyReceivableReport />} />
                <Route exact path="/TechnicianJobStatus" element={<TechnicianJobStatusReport />} />
                <Route exact path="/ReferenceJobStatus" element={<ReferenceJobStatusReport />} />
                <Route exact path="/TechnicianMonthlyJobStatus" element={<TechnicianMonthlyJobStatusReport />} />
                <Route exact path="/ReferenceMonthlyJobStatus" element={<ReferenceMonthlyJobStatusReport />} />
                <Route exact path="/CompanyJobComparison" element={<CompanyJobComparison />} />
                <Route exact path="/CategoryJobComparison" element={<CategoryJobComparison />} />
                <Route exact path="/CompanyMonthlyJobComparison" element={<CompanyMonthlyJobComparison />} />
                <Route exact path="/CategoryMonthlyJobComparison" element={<CategoryMonthlyJobComparison />} />
                <Route exact path="/CompanyJobSummary" element={<CompanyJobSummary />} />
                <Route exact path="/CategoryJobSummary" element={<CategoryJobSummary />} />
                <Route exact path="/JobLedger" element={<CompanyJobStatusReport />} />



                {/* Rountes for Daily reports */}
                <Route exact path="/CashBook" element={<DailyCashBook />} />
                <Route exact path="/Journal" element={<JournalReport />} />
                <Route exact path="/EditDocumentReport" element={<DocumentEditReport />} />
                <Route exact path="/DailyCreditMemo" element={<DailyCreditReport />} />
                <Route exact path="/DailyProfitReport" element={<DailyProfitReport />} />
                <Route exact path="/CashFlow" element={<CashFlowReport />} />
                <Route exact path="/DailyStatusReport" element={<DailyStatusReport />} />
                <Route exact path="/DailyCollectionReport" element={<DailyCollectionReport />} />
                <Route exact path="/DailyPaymentReport" element={<DailyPaymentReport />} />
                <Route exact path="/Cash&BankBalance" element={<DailyCashBankBalance />} />
                <Route exact path="/SaleReport" element={<DailySaleReport />} />
                <Route exact path="/PurchaseReport" element={<DailyPurchaseReport />} />
                <Route exact path="/ItemEvaluation" element={<ItemEvaluationReport />} />
                <Route exact path="/DailyJobReport" element={<DailyJobReport />} />
                <Route exact path="/DailyCollectionSummary" element={<DailyCollectionSummary />} />
                <Route exact path="/DailySaleReportPOS" element={<DailySaleReportPosReport />} />
                <Route exact path="/DailySaleDetailReportPos" element={<DailySaleDetailReportPos />} />
                <Route exact path="/DailyPurchaseDetailReport" element={<DailyPurchaseDetailReportPos />} />
                <Route exact path="/MemberCollectionReport" element={<DailyMemberCollectionReport />} />
                <Route exact path="/MemberCollectionSummary" element={<DailyMemberCollectionSummaryReport />} />
                <Route exact path="/ExpenseReportGYM" element={<ExpenseReport />} />
                <Route exact path="/TechnicianCollectionReport" element={<TechnicianCollectionReport />} />


                {/* Rountes for Installments reports */}
                <Route exact path="/InstallmentLedger" element={<InstallmentLedgerReport />} />
                <Route exact path="/InstallmentBalanceReport" element={<InstallmentBalanceReport />} />
                <Route exact path="/InstallmentSaleReport" element={<InstallmentSaleReport />} />
                <Route exact path="/InstallmentCollectionReport" element={<InstallmentCollectReport />} />
                <Route exact path="/InstallmentCollectionDailyComparison" element={<InstallmentCollectionDailyComparison />} />
                <Route exact path="/InstallmentCollectorMonthlyComparison" element={<InstallmentCollectionMonthlyComparison />} />


                {/* Rountes for item reports */}
                <Route exact path="/ItemPurchaseSummary" element={<ItemPurchaseSummary />} />
                {/* <Route exact path="/ItemStatusReport" element={<ItemStockReportPos />} /> */}
                <Route exact path="/ItemStockReportElec" element={<ItemStockReport />} />
                <Route exact path="/ItemAggingReport" element={<ItemAggingReport />} />
                <Route exact path="/StoreStockReport" element={<ItemStoreStockReport />} />
                <Route exact path="/ItemSaleReport" element={<ItemSaleReport />} />
                <Route exact path="/ItemPurchaseReport" element={<ItemPurchaseReport />} />
                <Route exact path="/ItemStatusReport" element={<ItemStatusReport />} />
                <Route exact path="/ItemSaleSummary" element={<ItemSaleSummaryReport />} />
                <Route exact path="/ItemSaleComparison" element={<ItemEvalutionReport />} />
                <Route exact path="/CompanySaleComparison" element={<ItemReorderLevelReport />} />


                {/* ROUTES FOR MISC REPORT */}
                <Route exact path="/ReceivableReport" element={<ReceivableReport />} />
                <Route exact path="/PayableReport" element={<PayableReport />} />
                <Route exact path="/ReceivableAggingReport" element={<ReceivableAggingReport />} />
                <Route exact path="/PayableAggingReport" element={<PayableAggingReport />} />


                {/* ROUTES FOR EMPLOYEE REPORT */}
                <Route exact path="/EmployeeAdvanceReport" element={<EmployeeAdvanceReport />} />
                <Route exact path="/EmployeeSaleReport" element={<EmployeeSaleReport />} />
                <Route exact path="/EmployeeSaleSummary" element={<EmployeeSaleSummaryReport />} />


                {/* Rountes for item reports */}
                <Route exact path="/FBRData" element={<FbrDataReport />} />
                <Route exact path="/SalesTaxRegister" element={<TaxSaleRegisterReport />} />


                {/* Rountes for Transection reports */}
                <Route exact path="/CreditMemoBill" element={<MemberCreditMemo />} />
                <Route exact path="/MemberReceiveableReport" element={<MemberRecivableReport />} />


                {/* Rountes for Dashboard */}
                <Route exact path="/salesdashboad" element={<Dashboard />} />
                <Route exact path="/AdminDealer" element={<DashboardAdminDealer />} />
                <Route exact path="/ResturentDashboard" element={<ResturentDashboard />} />
                <Route exact path="/GymDashboard" element={<GYMDashboard />} />


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
