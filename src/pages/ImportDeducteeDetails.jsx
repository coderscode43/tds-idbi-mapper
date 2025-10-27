import common from "@/common/common";
import FilterSelect from "@/components/component/FilterSelect";
import Pagination from "@/components/component/Pagination";
import TabSectionImportDeductee from "@/components/component/TabSectionImportDeductee";
import OpenFolderModal from "@/components/modals/OpenFolderModal";
import DynamicTable from "@/components/tables/DynamicTable";
import staticDataContext from "@/context/staticDataContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { dateWithTime, refinedSearchParams } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ImportDeducteeDetails = () => {
  const pageName = "Import Deductee";

  const { params } = useParams();
  const navigate = useNavigate();

  // Data from context
  const { crtFy, crtMonth, crtQuarter, Quarter, Month, ClientPAN, typeOfFile } =
    useContext(staticDataContext);
  // const { showSuccess, showError } = useContext(statusContext);

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

  const fetchListData = async () => {
    try {
      const pageNo = 0;
      const resultPerPage = 100;
      const entity = "ProcessDetail";

      const response = await common.getSearchListData(
        entity,
        pageNo,
        resultPerPage,
        params
      );

      setListData(response?.data?.entities || []);

      const count = response?.data?.count || 0;
      const pages = Math.ceil(count / 100);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching list data:", error);
    }
  };

  useEffect(() => {
    fetchListData();
  }, [params]);

  // Table Details
  const tableHead = [
    { key: "srNo", label: "Sr.No" },
    { key: "addedBy", label: "Added By" },
    { key: "addedOn", label: "Added On", formatter: dateWithTime },
    { key: "processName", label: "Process Name" },
    { key: "status", label: "Status" },
    { key: "remark", label: "Remark" },
    { key: "completedOn", label: "Completed On", formatter: dateWithTime },
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
                value={searchParams.fy || crtFy}
                onChange={handleSearchParamChange}
              />
              <FilterSelect
                label="Month"
                name="month"
                options={Month}
                value={searchParams.month || crtMonth?.toUpperCase()}
                onChange={handleSearchParamChange}
              />
              <FilterSelect
                label="Quarter"
                name="quarter"
                options={Quarter}
                value={searchParams.quarter || crtQuarter}
                onChange={handleSearchParamChange}
              />
              <FilterSelect
                label="Type of file"
                name="typeOfFile"
                options={typeOfFile}
                value={typeOfFile}
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
          </div>
        </div>

        <TabSectionImportDeductee
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-[var(--primary-color)]">
                Activity Log
              </h1>
              <p>Track all the actions and their status</p>
            </div>
            <button className="btnBorder Green btn" onClick={fetchListData}>
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
