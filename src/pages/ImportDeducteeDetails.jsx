import common from "@/common/common";
import FilterSelect from "@/components/component/FilterSelect";
import OpenFolderModal from "@/components/modals/OpenFolderModal";
import Pagination from "@/components/component/Pagination";
import SCTableAction from "@/components/tables/SCTableAction";
import staticDataContext from "@/context/staticDataContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const categories = [
  { name: "Import Raw Files", panelName: "importRawFiles" },
  { name: "Import GL Files", panelName: "importGLFiles" },
  { name: "Import GH15 File", panelName: "importGH15File" },
  { name: "Import LDC Files", panelName: "importLDCFiles" },
  {
    name: "Import Refund & Recovery File",
    panelName: "importRefundRecoveryFile",
  },
  { name: "Latest Updated PAN", panelName: "latestUpdatedPAN" },
];

const ImportDeducteeDetails = () => {
  const pageName = "Import Deductee";

  const { params } = useParams();
  const { crtFy, Quarter, Month, ClientPAN, typeOfFile } =
    useContext(staticDataContext);

  const [listData, setListData] = useState([]);
  const [fileListData, setFileListData] = useState([]);
  const [showOpenFolderModal, setShowOpenFolderModal] = useState(false);
  const [gotoPage, setGotoPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    fy: "",
    month: "",
    quarter: "",
    typeOfFile: "",
    panelName: params?.panelName || "",
  });
  useLockBodyScroll(showOpenFolderModal); // Custom hook to lock body scroll

  useEffect(() => {
    const fetchListData = async () => {
      try {
        let response;
        if (params) {
          const pageNo = 0;
          const resultPerPage = 100;
          const entity = "ProcessDetail";
          response = await common.getSearchListData(
            entity,
            pageNo,
            resultPerPage,
            params
          );
          setSearchParams({
            fy: "",
            month: "",
            quarter: "",
            typeOfFile: "",
            panelName: "",
          });
        }
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
      const parsedParams = JSON.parse(params);
      const clientPAN = ClientPAN;
      const formData = {
        ...parsedParams,
        pan: clientPAN,
        pageName: pageName,
      };

      const refinedFormData = common.getRefinedSearchParams(formData);
      const response = await common.getFileList(entity, refinedFormData);
      console.log(response.data);

      setFileListData(response?.data || []);
    } catch (error) {
      console.error(error);
    }
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
                onChange={common.handleSearchInputChange}
              />
              <FilterSelect
                label="Month"
                name="month"
                options={Month}
                value={searchParams.month}
                onChange={common.handleSearchInputChange}
              />
              <FilterSelect
                label="Quarter"
                name="quarter"
                options={Quarter}
                value={searchParams.quarter}
                onChange={common.handleSearchInputChange}
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
              onClick={handleOpenFolderClick}
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
              {categories?.map(({ name }) => (
                <Tab
                  key={name}
                  className={({ selected }) =>
                    `text-md grow basis-0 cursor-pointer rounded-[10px] text-center ${
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
              {categories?.map(({ name }) => {
                return (
                  <TabPanel
                    key={name}
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
                );
              })}
            </TabPanels>
          </TabGroup>
        </div>

        <div className="rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex justify-between gap-4">
            <button className="btnBorder DarkGreen btn">
              <img
                src={"/images/gificons/generateexcelfile.gif"}
                alt="Export to Excel Button"
                className="h-7 mix-blend-multiply"
              />
              <span className="w-full text-[16px]">Generate Report</span>
            </button>
            <button className="btnBorder Green btn">
              <img
                src={"/images/gificons/launchTemplate.gif"}
                alt="Launch Icon"
                className="h-[30px] w-[35px] mix-blend-multiply"
              />

              <span className="btntext text-[16px]">
                Launch Refund & Recovery Excel
              </span>
            </button>
            <button className="btnBorder DarkGreen btn">
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
          <SCTableAction
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
