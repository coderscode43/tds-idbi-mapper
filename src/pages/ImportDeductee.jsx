import common from "@/common/common";
import FilterSelect from "@/components/component/FilterSelect";
import Pagination from "@/components/component/Pagination";
import TabSectionImportDeductee from "@/components/component/TabSectionImportDeductee";
import AddDayFolderModal from "@/components/modals/AddDayFolderModal";
import OpenAdditionalDetailFolder from "@/components/modals/OpenAdditionalDetailFolder";
import OpenFolderModal from "@/components/modals/OpenFolderModal";
import DynamicTable from "@/components/tables/DynamicTable";
import statusContext from "@/context/ModalsContext/statusContext";
import staticDataContext from "@/context/staticDataContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import {
  dateWithTime,
  dayList,
  errorMessage,
  refinedSearchParams,
} from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ImportDeductee = () => {
  const pageName = "Import Deductee";

  const { params } = useParams();
  const navigate = useNavigate();

  // Data from context
  const {
    crtFy,
    crtMonth,
    crtQuarter,
    MonthList,
    ClientPAN,
    typeOfFile,
    financialYear,
    crtDay,
  } = useContext(staticDataContext);
  const { showSuccess, showError, showOverride } = useContext(statusContext);

  const [gotoPage, setGotoPage] = useState(1);
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [fileListData, setFileListData] = useState([]);
  const [showAddDayFolder, setShowAddDayFolder] = useState(false);
  const [showOpenFolderModal, setShowOpenFolderModal] = useState(false);
  const [additionalDetailModal, setAdditionalDetailModal] = useState(false);

  const [searchParams, setSearchParams] = useState({
    fy: "",
    month: "",
    quarter: "",
    typeOfFile: "Interest",
    day: "",
    panelName: params?.panelName || "",
  });

  // Custom hook to lock body scroll. Prevent scrolling when modal is open
  useLockBodyScroll(showOpenFolderModal);

  // Filter months based on selected quarter
  const quarterToUse = searchParams.quarter || crtQuarter;
  const filteredMonths = MonthList?.[quarterToUse] || [];

  const fetchListData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;

    let updatedSearchParams = { ...searchParams, [name]: value };

    // If quarter changes, reset month to first month of that quarter
    if (name === "quarter") {
      updatedSearchParams.month = MonthList?.[value]?.[0] || ""; // default to first month
    }

    setSearchParams(updatedSearchParams);

    const searchObj = {
      pan: ClientPAN,
      fy: updatedSearchParams.fy || crtFy,
      month: updatedSearchParams.month || crtMonth,
      quarter: updatedSearchParams.quarter || crtQuarter,
      typeOfFile:
        updatedSearchParams.typeOfFile !== undefined
          ? updatedSearchParams.typeOfFile
          : searchParams.typeOfFile, // Preserve if not updated
      day:
        updatedSearchParams.panelName === "Daily Remitance"
          ? updatedSearchParams.day
          : crtDay,
      panelName: updatedSearchParams.panelName || "Daily Remitance",
      pageName: pageName,
    };

    const refinedParams = refinedSearchParams(searchObj);

    // Navigate to the updated URL
    navigate(`/home/listSearch/importDeductee/${refinedParams}`);
  };

  const handleAdditionalDetailModal = async () => {
    setAdditionalDetailModal(true);
    try {
      setLoading(true);
      const entity = "WorkingFile";
      const parsedParams = JSON.parse(params); // parse URL params
      const clientPAN = ClientPAN;
      // Combine params to form request data
      const formData = {
        ...parsedParams,
        pan: clientPAN,
        pageName: pageName,
        additionalFolder: "Additional Detail",
      };
      const refinedFormData = refinedSearchParams(formData);
      const response = await common.getFileList(entity, refinedFormData);
      setFileListData(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessCancel = async (data, confirm = "NO") => {
    const processName = data?.processName;
    const id = data?.id;

    // 👇 This triggers your override modal
    if (confirm === "NO") {
      showOverride(
        `Are you sure you want to terminate the process ${processName}?`,
        () => handleProcessCancel(data, "YES")
      );
    } else {
      // 👇 This part runs only when the user clicks “Yes”
      try {
        setLoading(true);
        const response = await common.getProcessCancel(id);
        showSuccess(response.data.message);
      } catch (error) {
        showError(
          `Cannot terminate process ${processName.replace(/(?!^)([A-Z])/g, " $1")}: ${errorMessage(error)}`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  let parsedParams = {};
  try {
    parsedParams = JSON.parse(params);
  } catch (error) {
    console.log("Params not JSON parsable:", params, error);
  }

  return (
    <>
      <div className="custom-scrollbar space-y-5">
        <h1 className="mb-4 text-[25px] font-bold">Import Deductee</h1>

        <div className="space-y-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-end justify-between gap-4">
            <div className="flex w-full gap-5">
              <FilterSelect
                label="Financial Year"
                name="fy"
                options={financialYear}
                value={parsedParams.fy || crtFy}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "fy", value } })
                }
              />
              <FilterSelect
                label="Month"
                name="month"
                options={filteredMonths}
                value={parsedParams.month || crtMonth}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "month", value } })
                }
              />

              <FilterSelect
                label="Quarter"
                name="quarter"
                options={Object.keys(MonthList || {})}
                value={parsedParams.quarter || crtQuarter}
                onChange={(value) =>
                  handleSearchParamChange({
                    target: { name: "quarter", value },
                  })
                }
              />
              <FilterSelect
                label="Type of file"
                name="typeOfFile"
                options={typeOfFile}
                value={parsedParams.typeOfFile || ""}
                onChange={(value) =>
                  handleSearchParamChange({
                    target: { name: "typeOfFile", value },
                  })
                }
              />

              {parsedParams?.panelName === "Daily Remitance" && (
                <FilterSelect
                  label="Date"
                  name="date"
                  options={dayList}
                  value={crtDay}
                  onChange={(value) =>
                    handleSearchParamChange({ target: { name: "day", value } })
                  }
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-5">
            {parsedParams?.panelName === "Daily Remitance" && (
              <button
                // disabled={selectFolder.length === 0}
                className="btnBorder Violet btn"
                onClick={() => setShowAddDayFolder(true)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/gificons/add.gif`}
                  alt="Add Date Folder"
                  className="h-7 mix-blend-multiply"
                />
                <span className="btntext text-[16px]">Add Date Folder</span>
              </button>
            )}
            <button
              // disabled={selectFolder.length === 0}
              className="btnBorder lightYellow btn"
              onClick={handleAdditionalDetailModal}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/gificons/openfile.gif`}
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
                src={`${import.meta.env.BASE_URL}images/gificons/OpenFolder.gif`}
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
            <button
              className="btnBorder Green btn"
              onClick={() => fetchListData()}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/gificons/refresh.gif`}
                alt="Export to Excel Button"
                className="h-7 mix-blend-multiply"
              />
              <span className="w-full text-[16px]">Refresh</span>
            </button>
          </div>
          <DynamicTable
            tableHead={tableHead}
            tableData={tableData}
            handleCancel={handleProcessCancel}
            loading={loading}
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

      {/* Additional Detail Modal */}
      {additionalDetailModal && (
        <OpenAdditionalDetailFolder
          setAdditionalDetailModal={setAdditionalDetailModal}
          fileListData={fileListData}
          setFileListData={setFileListData}
        />
      )}

      {showAddDayFolder && (
        <AddDayFolderModal
          setShowAddDayFolder={setShowAddDayFolder}
          parsedParams={parsedParams}
        />
      )}
    </>
  );
};

export default ImportDeductee;
