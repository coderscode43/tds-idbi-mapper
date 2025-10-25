import staticDataContext from "@/context/staticDataContext";
import { refinedSearchParams } from "@/lib/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ImportGH15LDCFile from "./ImportGH15LDCFile";
import ImportGLFiles from "./ImportGLFiles";
import ImportRawFiles from "./ImportRawFiles";
import ImportRefundData from "./ImportRefundData";

const categories = [
  { name: "Import Raw Files", panelName: "ImportRawFiles" },
  { name: "Import GL Files", panelName: "ImportGLFiles" },
  { name: "Import GH15 & LDC File", panelName: "ImportGH15AndLDCFile" },
  { name: "Import Refund Data", panelName: "ImportRefundData" },
  { name: "Import PAN Details", panelName: "ImportPanDetails" },
  { name: "Import Customer Details", panelName: "ImportCustomerDetails" },
];

const TabSectionImportDeductee = ({ searchParams, setSearchParams }) => {
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
      panelName: selectedPanelName, // Update panelName
      pageName: "Import Deductee",
    };

    // Refine the search params
    const refinedParams = refinedSearchParams(searchObj);

    // Navigate to the new path with the updated params
    navigate(`/home/listSearch/importDeducteeDetails/${refinedParams}`);
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
            <ImportRawFiles />
          </TabPanel>
          <TabPanel>
            <ImportGLFiles />
          </TabPanel>
          <TabPanel>
            <ImportGH15LDCFile />
          </TabPanel>
          <TabPanel>
            <ImportRefundData />
          </TabPanel>
          <TabPanel>
            <ImportRawFiles />
          </TabPanel>
          <TabPanel>
            <ImportRawFiles />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
};

export default TabSectionImportDeductee;
