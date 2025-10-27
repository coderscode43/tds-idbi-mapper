import staticDataContext from "@/context/staticDataContext";
import { refinedSearchParams } from "@/lib/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ImportGH15LDCFile from "./ImportGH15LDCFile";
import ImportRefundData from "./ImportRefundData";
import ImportGLFiles from "./ImportGLFiles";
import ImportGLFilesWithDrawal from "./ImportGLFilesWithDrawal";

const categories = [
  { name: "Daily Remitance", panelName: "DailyRemitance" },
  { name: "Monthly Remitance", panelName: "MonthlyRemitance" },
];

const DailyRemitanceCategories = [
  { name: "Import Dump File", panelName: "ImportDumpFile" },
  { name: "Import IBNK_ITR", panelName: "ImportIBNK_ITR" },
  { name: "Import TDS_OC", panelName: "ImportTDS_OC" },
  { name: "Import HCRT", panelName: "ImportHCRT" },
  { name: "Import TDS E-file", panelName: "ImportTdsEFile" },
  { name: "Import PAN Status", panelName: "ImportPanStatus" },
];

const TabSectionWithDrawal = ({ searchParams, setSearchParams }) => {
  const navigate = useNavigate();

  const { crtFy, crtMonth, crtQuarter, ClientPAN } =
    useContext(staticDataContext);

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
      panelName: selectedPanelName || categories[0], // Update panelName
      pageName: "withDrawal",
    };

    // Refine the search params
    const refinedParams = refinedSearchParams(searchObj);

    // Navigate to the new path with the updated params
    navigate(`/home/listSearch/withDrawal/${refinedParams}`);
  };
  return (
    <>
      <TabGroup>
        <TabList className="nav-pills relative mb-6 flex h-full w-full translate-y-[-0.2em] items-center justify-center rounded-[10px] border border-[#999] shadow-[0px_3px_0px_0px_#808894] transition duration-300">
          {categories?.map(({ name, panelName }) => (
            <Tab
              key={panelName}
              className={({ selected }) =>
                `text-md grow basis-0 cursor-pointer rounded-[10px] text-center${
                  selected
                    ? "flex h-[50px] items-center justify-center bg-[#1761fd] text-white"
                    : " "
                }`
              }
              onClick={() => handleTabChange(panelName)} // Handle the tab change here
            >
              {name}
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-3">
          <TabPanel>
            {/*  Daily Remitance Categories */}
            <>
              <TabGroup>
                <TabList className="nav-pills relative mb-6 flex h-full w-full translate-y-[-0.2em] items-center justify-center rounded-[10px] border border-[#999] shadow-[0px_3px_0px_0px_#808894] transition duration-300">
                  {DailyRemitanceCategories?.map(({ name, panelName }) => (
                    <Tab
                      key={panelName}
                      className={({ selected }) =>
                        `text-md grow basis-0 cursor-pointer rounded-[10px] text-center${
                          selected
                            ? "flex h-[50px] items-center justify-center bg-[#1761fd] text-white"
                            : " "
                        }`
                      }
                      onClick={() => handleTabChange(panelName)} // Handle the tab change here
                    >
                      {name}
                    </Tab>
                  ))}
                </TabList>

                <TabPanels className="mt-3">
                  <TabPanel>
                    <ImportGH15LDCFile />
                  </TabPanel>
                  <TabPanel>
                    <ImportGH15LDCFile />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </>
            {/* End of Daily Remitance  */}
          </TabPanel>
          <TabPanel>
            <ImportGLFilesWithDrawal />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
};

export default TabSectionWithDrawal;
