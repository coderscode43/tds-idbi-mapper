import common from "@/common/common";
import FilterSelect from "@/components/component/FilterSelect";
import OpenFolderModal from "@/components/modals/OpenFolderModal";
import Pagination from "@/components/component/Pagination";
import DynamicTable from "@/components/tables/DynamicTable";
import staticDataContext from "@/context/staticDataContext";
import statusContext from "@/context/ModalsContext/statusContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { errorMessage, refinedSearchParams } from "@/lib/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
  { name: "Import Raw Files", panelName: "ImportRawFiles" },
  { name: "Import GL Files", panelName: "ImportGLFiles" },
  { name: "Import GH15 File", panelName: "ImportGH15File" },
  { name: "Import LDC Files", panelName: "ImportLDCFiles" },
  {
    name: "Import Refund & Recovery File",
    panelName: "ImportRefundRecoveryFile",
  },
  { name: "Latest Updated PAN", panelName: "LatestUpdatedPAN" },
];

const ImportDeducteeDetails = () => {
  const pageName = "Import Deductee";

  const { params } = useParams();
  const navigate = useNavigate();

  // Data from context
  const { crtFy, crtMonth, crtQuarter, Quarter, Month, ClientPAN, typeOfFile } =
    useContext(staticDataContext);
  const { showSuccess, showError } = useContext(statusContext);

  const [listData, setListData] = useState([]);
  const [gotoPage, setGotoPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [fileListData, setFileListData] = useState([]);
  const [showOpenFolderModal, setShowOpenFolderModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    fy: "",
    month: "",
    quarter: "",
    typeOfFile: "",
    panelName: params?.panelName || "",
  });

  // Custom hook to lock body scroll. Prevent scrolling when modal is open
  useLockBodyScroll(showOpenFolderModal);

  useEffect(() => {
    const fetchListData = async () => {
      try {
        let response;
        if (params) {
          const pageNo = 0; // start from first page
          const resultPerPage = 100; // items per page
          const entity = "ProcessDetail"; // API entity
          // Fetch data from API
          response = await common.getSearchListData(
            entity,
            pageNo,
            resultPerPage,
            params
          );
          // Reset filters
          setSearchParams({
            fy: "",
            month: "",
            quarter: "",
            typeOfFile: "",
            panelName: "",
          });
        }
        // Store list data and calculate total pages
        setListData(response?.data?.entities || []);

        const count = response?.data?.count || 0;
        const pages = Math.ceil(count / 100);
        setTotalPages(pages);
      } catch (error) {
        console.error("Error fetching list data:", error);
      }
    };
    fetchListData();
  }, [params]);

  // Table Details
  const tableHead = [
    { key: "srNo", label: "Sr.No" },
    { key: "addedBy", label: "Added By" },
    { key: "addedOn", label: "Added On" },
    { key: "processName", label: "Process Name" },
    { key: "status", label: "Status" },
    { key: "remark", label: "Remark" },
    { key: "completedOn", label: "Completed On" },
    { key: "action", label: "Action" },
  ];

  const tableData = listData?.map((data, index) => ({
    srNo: (currentPage - 1) * 100 + (index + 1),
    ...data,
  }));

  const handleOpenFolderClick = async () => {
    setShowOpenFolderModal(true);

    try {
      const entity = "WorkingFile";
      const parsedParams = JSON.parse(params); // parse URL params
      const clientPAN = ClientPAN;
      // Combine params to form request data
      const formData = {
        ...parsedParams,
        pan: clientPAN,
        pageName: pageName,
      };

      const refinedFormData = refinedSearchParams(formData);
      const response = await common.getFileList(entity, refinedFormData);

      setFileListData(response?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fileType = Array.isArray(typeOfFile) ? typeOfFile[0] : "";
  const handleProcessButtonClick = async (processName) => {
    const entity = "ImportDeductee";
    const parsedParams = JSON.parse(params);

    const formData = {
      ...parsedParams,
      typeOfFile: fileType,
      processName: processName,
    };

    try {
      await common.getStartProcess(entity, formData);
      showSuccess(
        `${processName.replace(/(?!^)([A-Z])/g, " $1")} is in progress`
      );
    } catch (error) {
      showError(
        `Cannot start process ${processName.replace(/(?!^)([A-Z])/g, " $1")}: ${errorMessage(error)}`
      );
      console.error(error);
    }
  };

  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;

    const updatedSearchParams = {
      ...searchParams,
      [name]: value,
    };

    setSearchParams(updatedSearchParams);

    const searchObj = {
      pan: ClientPAN,
      fy: updatedSearchParams.fy || crtFy,
      month: updatedSearchParams.month || crtMonth,
      quarter: updatedSearchParams.quarter || crtQuarter,
      typeOfFile:
        updatedSearchParams.typeOfFile ||
        (Array.isArray(typeOfFile) ? typeOfFile[0] : typeOfFile),
      panelName: updatedSearchParams.panelName || "ImportRawFiles",
      pageName: "Import Deductee",
    };

    if (updatedSearchParams.typeOfFile) {
      delete searchObj.typeOfFile;
    }

    const refinedParams = refinedSearchParams(searchObj);

    // Navigate to the updated URL
    navigate(`/home/listSearch/importDeducteeDetails/${refinedParams}`);
  };

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
      <div className="space-y-5">
        <h1 className="mb-4 text-[25px] font-bold">Import Deductee Details</h1>

        <div className="space-y-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-end justify-between gap-4">
            <div className="flex w-full gap-5">
              <FilterSelect
                label="Financial Year"
                name="fy"
                options={[crtFy]}
                value={searchParams.fy}
                onChange={handleSearchParamChange}
              />
              <FilterSelect
                label="Month"
                name="month"
                options={Month}
                value={searchParams.month}
                onChange={handleSearchParamChange}
              />
              <FilterSelect
                label="Quarter"
                name="quarter"
                options={Quarter}
                value={searchParams.quarter}
                onChange={handleSearchParamChange}
              />
              <FilterSelect
                label="Type of file"
                name="typeOfFile"
                options={typeOfFile}
                value={searchParams.typeOfFile}
                onChange={common.handleSearchInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-5">
            <button
              // disabled={selectFolder.length === 0}
              className="btnBorder lightYellow btn"
            >
              <img
                src={"/images/gificons/openfile.gif"}
                alt="Add Bulk Token"
                className="h-7 mix-blend-multiply"
              />
              <span className="btntext text-[16px]">
                Open Additional Details
              </span>
            </button>
            <button
              // disabled={selectFolder.length === 0}
              className="btnBorder lightYellow btn"
              onClick={handleOpenFolderClick}
            >
              <img
                src={"/images/gificons/OpenFolder.gif"}
                alt="Add Bulk Token"
                className="h-7 mix-blend-multiply"
              />
              <span className="btntext text-[16px]">Open Folder</span>
            </button>
            <button className="btnBorder DarkGreen btn">
              <img
                src={"/images/gificons/refresh.gif"}
                alt="Export to Excel Button"
                className="h-7 mix-blend-multiply"
              />
              <span className="w-full text-[16px]">Refresh</span>
            </button>
          </div>
        </div>

        <div className="rounded-md border border-gray-100 p-5 shadow-md">
          <TabGroup>
            <TabList className="nav-pills relative mb-6 flex h-full w-full translate-y-[-0.2em] items-center justify-center rounded-[10px] border border-[#999] shadow-[inset_0_30px_30px_-15px_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(255,255,255,0.3),inset_0_1px_20px_rgba(0,0,0,0),0_3px_0_rgba(50,70,100,0.4),0_3px_2px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.1)] transition duration-300">
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
              {categories?.map(({ panelName }) => (
                <TabPanel
                  key={panelName}
                  className="flex items-end gap-5 p-4 pl-0 focus:outline-none"
                >
                  <div>
                    <label className="font-medium text-[var(--primary-color)]">
                      Select Folder
                    </label>
                    <input
                      type="file"
                      name="branchName"
                      id="branchName"
                      className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm/6 text-gray-900 file:mr-3 file:cursor-pointer focus:outline-none"
                    />
                  </div>
                  <button className="btnBorder lightCyan btn">
                    <img
                      className="h-[30px] w-[35px] mix-blend-multiply"
                      src={"/images/gificons/importFile.gif"}
                      alt="Import"
                    />
                    <span>Import</span>
                  </button>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>

        <div className="rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex justify-between gap-4">
            <button
              className="btnBorder DarkGreen btn"
              onClick={() => handleProcessButtonClick("GenerateFormatFile")}
            >
              <img
                src={"/images/gificons/generateexcelfile.gif"}
                alt="Export to Excel Button"
                className="h-7 mix-blend-multiply"
              />
              <span className="w-full text-[16px]">Generate Report</span>
            </button>
            <button
              className="btnBorder Green btn"
              onClick={() =>
                handleProcessButtonClick("LaunchRefundAndRecoveryExcel")
              }
            >
              <img
                src={"/images/gificons/launchTemplate.gif"}
                alt="Launch Icon"
                className="h-[30px] w-[35px] mix-blend-multiply"
              />
              <span className="btntext text-[16px]">
                Launch Refund & Recovery Excel
              </span>
            </button>
            <button
              className="btnBorder DarkGreen btn"
              onClick={() =>
                handleProcessButtonClick("ValidateDataAndSegregateData")
              }
            >
              <img
                src={"/images/gificons/ValidateExcel.gif"}
                alt="Search Icon"
                className="h-7 mix-blend-multiply"
              />
              <span className="btntext text-[16px]">
                Validate Data & Segregate Data
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-[var(--primary-color)]">
                Activity Log
              </h1>
              <p>Track all the actions and their status</p>
            </div>
            <button className="btnBorder DarkGreen btn">
              <img
                src={"/images/gificons/refresh.gif"}
                alt="Export to Excel Button"
                className="h-7 mix-blend-multiply"
              />
              <span className="w-full text-[16px]">Refresh</span>
            </button>
          </div>
          <DynamicTable
            entity={pageName}
            tableHead={tableHead}
            tableData={tableData}
          />
        </div>
      </div>

      {/* Pagination */}
      {listData.length > 0 && (
        <Pagination
          entity={pageName}
          setListData={setListData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          gotoPage={gotoPage}
          setGotoPage={setGotoPage}
          totalPages={totalPages}
        />
      )}

      {/* OpenFolder */}
      {showOpenFolderModal && (
        <OpenFolderModal
          onClose={() => setShowOpenFolderModal(false)}
          fileListData={fileListData}
          setFileListData={setFileListData}
        />
      )}
    </>
  );
};

export default ImportDeducteeDetails;
