import staticDataContext from "@/context/staticDataContext";
import { refinedSearchParams } from "@/lib/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImportGLFiles from "./ImportGLFiles";
import ImportWithDrawalDaily from "./ImportWithDrawalDaily";
import ImportWithDrawalMonthly from "./ImportWithDrawalMonthly";

const categories = [
  { name: "Daily Remitance", panelName: "Daily Remitance" },
  { name: "Monthly Remitance", panelName: "Monthly Remitance" },
];

const Daily = [
  { name: "Import Dump File", panelName: "DumpFile" },
  { name: "Import IBNK_ITR", panelName: "IBNK_ITR" },
  { name: "Import TDS_OC", panelName: "TDS_OC" },
  { name: "Import HCRT", panelName: "HCRT" },
  { name: "Import TDS E-File", panelName: "TDS-E-File" },
  { name: "Import PAN Status", panelName: "PanStatus" },
];

const Monthly = [
  { name: "Import Monthly GL", panelName: "MonthlyGL" },
  { name: "Import Monthly Refunds", panelName: "MonthlyRefund" },
  { name: "Import Monthly  Dump Files", panelName: "MonthlyDumpFile" },
  { name: "Import Monthly TDS-E-File", panelName: "MonthlyTDS-E-File" },
  { name: "Import All Files", panelName: "AllFiles" },
  { name: "Import PAN Status", panelName: "PanStatus" },
];
const TabSectionWithDrawal = ({ searchParams, setSearchParams }) => {
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

  const parsedParam = params ? JSON.parse(decodeURIComponent(params)) : {};

  const { crtFy, crtMonth, crtQuarter, ClientPAN, crtDay, typeOfFile } =
    useContext(staticDataContext);

  // Determine outer tab index (0 = Daily, 1 = Monthly)
  const outerTabIndex = parsedParam.panelName === "Monthly Remitance" ? 1 : 0;

  const handleTabChange = (selectedPanelName) => {
    // Update the panelName in the searchParams
    setSearchParams((prevParams) => ({
      ...prevParams,
      panelName: selectedPanelName,
    }));

    // Build the updated search object with the new panelName
    const searchObj = {
      pan: ClientPAN,
      fy: searchParams.fy || crtFy,
      month: searchParams.month || crtMonth,
      quarter: searchParams.quarter || crtQuarter,
      typeOfFile: typeOfFile[1],
      day: selectedPanelName === "Daily Remitance" ? crtDay : "",
      panelName: selectedPanelName,
      pageName: "withDrawal",
    };

    const refinedParams = refinedSearchParams(searchObj);
    navigate(`/home/listSearch/withDrawal/${refinedParams}`);
  };
  return (
    <>
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
                `text-md grow basis-0 cursor-pointer rounded-[10px] text-balance ${
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
                    {tab.panelName === "DumpFile" && (
                      <ImportWithDrawalDaily
                        subPanel={["DumpFile"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "IBNK_ITR" && (
                      <ImportWithDrawalDaily
                        subPanel={["IBNK_ITR"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "TDS_OC" && (
                      <ImportWithDrawalDaily
                        subPanel={["TDS_OC"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "HCRT" && (
                      <ImportWithDrawalDaily
                        subPanel={["HCRT"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "TDS-E-File" && (
                      <ImportWithDrawalDaily
                        subPanel={["TDS-E-File"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "PanStatus" && (
                      <ImportWithDrawalDaily
                        subPanel={["PanStatus"]}
                        entity={"Withdrawal"}
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
                    {tab.panelName === "MonthlyGL" && (
                      <ImportGLFiles
                        subPanel={["MonthlyGL"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "MonthlyRefund" && (
                      <ImportWithDrawalMonthly
                        subPanel={["MonthlyRefund"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "MonthlyDumpFile" && (
                      <ImportWithDrawalMonthly
                        subPanel={["MonthlyDumpFile"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "MonthlyTDS-E-File" && (
                      <ImportWithDrawalMonthly
                        subPanel={["MonthlyTDS-E-File"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "AllFiles" && (
                      <ImportWithDrawalMonthly
                        subPanel={["AllFiles"]}
                        entity={"Withdrawal"}
                      />
                    )}
                    {tab.panelName === "PanStatus" && (
                      <ImportWithDrawalMonthly
                        subPanel={["PanStatus"]}
                        entity={"Withdrawal"}
                      />
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
};

export default TabSectionWithDrawal;
