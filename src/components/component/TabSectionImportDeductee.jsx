import staticDataContext from "@/context/staticDataContext";
import { refinedSearchParams } from "@/lib/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImportCustomerDetails from "./ImportCustomerDetails";
import ImportGH15LDCFile from "./ImportGH15LDCFile";
import ImportGLFiles from "./ImportGLFiles";
import ImportPanDetails from "./ImportPanDetails";
import ImportRawFiles from "./ImportRawFiles";
import ImportRefundData from "./ImportRefundData";
import ImportNewAccount from "./ImportNewAccount";
import ImportTaxChangeCode from "./ImportTaxChangeCode";
import ImportNoRefund from "./ImportNoRefund";
import ImportGH15 from "./ImportGH15";

const categories = [
  { name: "Daily Remitance", panelName: "Daily Remitance" },
  { name: "Monthly Remitance", panelName: "Monthly Remitance" },
];

const Daily = [
  { name: "Import GH15 ", panelName: "ImportGH15" },
  { name: "Import New A/C", panelName: "ImportNewAccount" },
  { name: "Import Tax Change Code", panelName: "ImportTaxChangeCode" },
  { name: "Import No TDS", panelName: "ImportNoRefund" },
];

const Monthly = [
  { name: "Import Raw Files", panelName: "ImportRawFiles" },
  { name: "Import GL Files", panelName: "ImportGLFiles" },
  { name: "Import GH15 & LDC File", panelName: "ImportGH15AndLDCFile" },
  { name: "Import Refund Data", panelName: "ImportRefundData" },
  { name: "Import PAN Details", panelName: "ImportPanDetails" },
  { name: "Import Customer Details", panelName: "ImportCustomerDetails" },
];

const TabSectionImportDeductee = ({ searchParams, setSearchParams }) => {
  const navigate = useNavigate();
  const { params } = useParams();

  const [dailyTabIndex, setDailyTabIndex] = useState(() => {
    const saved = localStorage.getItem("dailyTabIndex");
    return saved ? Number(saved) : 0;
  });

  const [monthlyTabIndex, setMonthlyTabIndex] = useState(() => {
    const saved = localStorage.getItem("monthlyTabIndex");
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("dailyTabIndex", dailyTabIndex);
    localStorage.setItem("monthlyTabIndex", monthlyTabIndex);
  }, [dailyTabIndex, monthlyTabIndex]);

  const parsedParams = params ? JSON.parse(decodeURIComponent(params)) : {};

  const { crtFy, crtMonth, crtQuarter, ClientPAN, crtDay, typeOfFile } =
    useContext(staticDataContext);

  // Determine outer tab index (0 = Daily, 1 = Monthly)
  const outerTabIndex = parsedParams.panelName === "Monthly Remitance" ? 1 : 0;

  const handleTabChange = (selectedPanelName) => {
    // Update searchParams
    setSearchParams((prev) => ({
      ...prev,
      panelName: selectedPanelName,
    }));

    const searchObj = {
      pan: ClientPAN,
      fy: searchParams.fy || crtFy,
      month: searchParams.month || crtMonth,
      quarter: searchParams.quarter || crtQuarter,
      typeOfFile: typeOfFile[0],
      day: selectedPanelName === "Daily Remitance" ? crtDay : "",
      panelName: selectedPanelName,
      pageName: "Import Deductee",
    };

    const refinedParams = refinedSearchParams(searchObj);
    navigate(`/home/listSearch/importDeductee/${refinedParams}`);
  };

  return (
    <TabGroup
      selectedIndex={outerTabIndex}
      onChange={(index) =>
        handleTabChange(index === 0 ? "Daily Remitance" : "Monthly Remitance")
      }
    >
      <TabList className="nav-pills relative mb-6 flex h-full w-full translate-y-[-0.2em] items-center justify-center rounded-[10px] border border-[#999] shadow-[0px_3px_0px_0px_#808894] transition duration-300">
        {categories.map(({ name, panelName }) => (
          <Tab
            key={panelName}
            className={({ selected }) =>
              `text-md grow basis-0 cursor-pointer rounded-[10px] text-center${
                selected
                  ? "flex h-[50px] items-center justify-center bg-[#1761fd] text-white"
                  : ""
              }`
            }
          >
            {name}
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-3">
        {/* Daily Remitance */}
        <TabPanel>
          <TabGroup selectedIndex={dailyTabIndex} onChange={setDailyTabIndex}>
            <TabList className="nav-pills relative mb-6 flex h-full w-full translate-y-[-0.2em] items-center justify-center rounded-[10px] border border-[#999] shadow-[0px_3px_0px_0px_#808894] transition duration-300">
              {Daily.map(({ name, panelName }) => (
                <Tab
                  key={panelName}
                  className={({ selected }) =>
                    `text-md grow basis-0 cursor-pointer rounded-[10px] text-center${
                      selected
                        ? "flex h-[50px] items-center justify-center bg-[#1761fd] text-white"
                        : ""
                    }`
                  }
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-3">
              {Daily.map((tab) => (
                <TabPanel key={tab.panelName}>
                  {tab.panelName === "ImportGH15" && <ImportGH15 />}
                  {tab.panelName === "ImportNewAccount" && <ImportNewAccount />}
                  {tab.panelName === "ImportTaxChangeCode" && (
                    <ImportTaxChangeCode />
                  )}
                  {tab.panelName === "ImportNoRefund" && <ImportNoRefund />}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </TabPanel>

        <TabPanel>
          {/* Monthly Remitance */}
          <TabGroup
            selectedIndex={monthlyTabIndex}
            onChange={setMonthlyTabIndex}
          >
            <TabList className="nav-pills relative mb-6 flex h-full w-full translate-y-[-0.2em] items-center justify-center rounded-[10px] border border-[#999] shadow-[0px_3px_0px_0px_#808894] transition duration-300">
              {Monthly.map(({ name, panelName }) => (
                <Tab
                  key={panelName}
                  className={({ selected }) =>
                    `text-md grow basis-0 cursor-pointer rounded-[10px] text-center${
                      selected
                        ? "flex h-[50px] items-center justify-center bg-[#1761fd] text-white"
                        : ""
                    }`
                  }
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-3">
              {Monthly.map((tab) => (
                <TabPanel key={tab.panelName}>
                  {tab.panelName === "ImportRawFiles" && <ImportRawFiles />}
                  {tab.panelName === "ImportGLFiles" && <ImportGLFiles />}
                  {tab.panelName === "ImportGH15AndLDCFile" && (
                    <ImportGH15LDCFile />
                  )}
                  {tab.panelName === "ImportRefundData" && <ImportRefundData />}
                  {tab.panelName === "ImportPanDetails" && <ImportPanDetails />}
                  {tab.panelName === "ImportCustomerDetails" && (
                    <ImportCustomerDetails />
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default TabSectionImportDeductee;
