import staticDataContext from "@/context/staticDataContext";
import { refinedSearchParams } from "@/lib/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImportCustomerDetails from "./ImportCustomerDetails";
import ImportGH15 from "./ImportGH15";
import ImportGH15LDCFile from "./ImportGH15LDCFile";
import ImportGLFiles from "./ImportGLFiles";
import ImportNewAccount from "./ImportNewAccount";
import ImportNoRefund from "./ImportNoRefund";
import ImportPanDetails from "./ImportPanDetails";
import ImportRawFiles from "./ImportRawFiles";
import ImportRefundData from "./ImportRefundData";
import ImportTaxChangeCode from "./ImportTaxChangeCode";

const categories = [
  { name: "Daily Remitance", panelName: "Daily Remitance" },
  { name: "Monthly Remitance", panelName: "Monthly Remitance" },
];

const Daily = [
  { name: "Import GH15 ", panelName: "GH15" },
  { name: "Import New A/C", panelName: "NewAccount" },
  { name: "Import Tax Change Code", panelName: "TaxChangeCode" },
  { name: "Import No TDS", panelName: "NoRefund" },
];

const Monthly = [
  { name: "Import Raw Files", panelName: "RawFiles" },
  { name: "Import GL Files", panelName: "GLFiles" },
  { name: "Import GH15 & LDC File", panelName: "GH15AndLDCFile" },
  { name: "Import Refund Data", panelName: "RefundData" },
  { name: "Import PAN Details", panelName: "PanDetails" },
  { name: "Import Customer Details", panelName: "CustomerDetails" },
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
                  {tab.panelName === "GH15" && (
                    <ImportGH15
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
                  {tab.panelName === "NewAccount" && (
                    <ImportNewAccount
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
                  {tab.panelName === "TaxChangeCode" && (
                    <ImportTaxChangeCode
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
                  {tab.panelName === "NoRefund" && (
                    <ImportNoRefund
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
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
                  {tab.panelName === "RawFiles" && (
                    <ImportRawFiles
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
                  {tab.panelName === "GLFiles" && (
                    <ImportGLFiles
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
                  {tab.panelName === "GH15AndLDCFile" && (
                    <ImportGH15LDCFile
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
                  {tab.panelName === "RefundData" && (
                    <ImportRefundData
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
                  {tab.panelName === "PanDetails" && (
                    <ImportPanDetails
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
                  )}
                  {tab.panelName === "CustomerDetails" && (
                    <ImportCustomerDetails
                      subPanel={tab.panelName}
                      entity={"ImportDeductee"}
                    />
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
