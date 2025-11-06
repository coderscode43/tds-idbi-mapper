import common from "@/common/common";
import FilterSelect from "@/components/component/FilterSelect";
import Pagination from "@/components/component/Pagination";
import TabSectionWithDrawal from "@/components/component/TabSectionWithDrawal";
import AddDayFolderModal from "@/components/modals/AddDayFolderModal";
import OpenAdditionalDetailFolder from "@/components/modals/OpenAdditionalDetailFolder";
import OpenFolderModal from "@/components/modals/OpenFolderModal";
import DynamicTable from "@/components/tables/DynamicTable";
import statusContext from "@/context/ModalsContext/statusContext";
import staticDataContext from "@/context/staticDataContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import {
  dateWithTime,
  errorMessage,
  parsedParams,
  refinedSearchParams,
} from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const WithDrawal = () => {
  const navigate = useNavigate();
  const { params } = useParams();
  // Data from context
  const {
    crtFy,
    crtMonth,
    crtQuarter,
    MonthList,
    Month,
    pageName,
    typeOfFile,
    ClientPAN,
    crtDay,
    financialYear,
  } = useContext(staticDataContext);
  const { showSuccess, showError, showOverride } = useContext(statusContext);

  const [dayList, setDayList] = useState([]);
  const [gotoPage, setGotoPage] = useState(1);
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [fileListData, setFileListData] = useState([]);
  const [lastLocation, setLastLocation] = useState("");
  const [showAddDayFolder, setShowAddDayFolder] = useState(false);
  const [showOpenFolderModal, setShowOpenFolderModal] = useState(false);
  const [additionalDetailModal, setAdditionalDetailModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    fy: "",
    month: "",
    quarter: "",
    typeOfFile: "withDrawal",
    day: "",
    panelName: params?.panelName || "",
  });

  // Custom hook to lock body scroll. Prevent scrolling when modal is open
  useLockBodyScroll(showOpenFolderModal);

  // Filter months based on selected quarter
  const quarterToUse = searchParams.quarter || crtQuarter;
  const filteredMonths = MonthList?.[quarterToUse] || [];

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

  const fetchDayListData = async () => {
    try {
      const response = await common.getDayListData(params);
      setDayList(response.data);
    } catch (error) {
      console.error("Error fetching list data:", error);
    }
  };

  useEffect(() => {
    fetchListData();
    fetchDayListData();
  }, [params]);

  const parsedparams = parsedParams(params);

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
      // pageName: pageName,
      pageName:
        updatedSearchParams.typeOfFile === typeOfFile[1]
          ? "withDrawal"
          : pageName,
    };

    const refinedParams = refinedSearchParams(searchObj);

    // // 🔥 If the user selects Withdrawal, redirect to another page
    navigate(`/home/listSearch/withDrawal/${refinedParams}`);
  };

  const handleOpenFolderClick = async () => {
    setShowOpenFolderModal(true);
    try {
      setLoading(true);
      const parsedparams = parsedParams(params);
      // Combine params to form request data
      const formData = {
        ...parsedparams,
      };
      const response = await common.getFileList(formData);
      setLastLocation(response.data[0].lastLocation || "");
      setFileListData(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdditionalDetailModal = async () => {
    setAdditionalDetailModal(true);
    try {
      setLoading(true);
      const parsedParams = JSON.parse(params);
      // Combine params to form request data
      const formData = {
        ...parsedParams,
        additionalFolder: "Additional Detail",
      };
      const response = await common.getFileList(formData);
      setFileListData(response?.data || []);
      setLastLocation(response?.data[0].lastLocation || "");
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

  return (
    <>
      <div className="custom-scrollbar space-y-5">
        <h1 className="mb-4 text-[25px] font-bold">WithDrawal</h1>

        <div className="space-y-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex items-end justify-between gap-4">
            <div className="flex w-full gap-5">
              <FilterSelect
                label="Financial Year"
                name="fy"
                options={financialYear}
                value={parsedparams.fy || crtFy}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "fy", value } })
                }
              />
              <FilterSelect
                label="Month"
                name="month"
                options={filteredMonths}
                value={parsedparams.month || crtMonth}
                onChange={(value) =>
                  handleSearchParamChange({ target: { name: "month", value } })
                }
              />
              <FilterSelect
                label="Quarter"
                name="quarter"
                options={Object.keys(MonthList || {})}
                value={parsedparams.quarter || crtQuarter}
                onChange={(value) =>
                  handleSearchParamChange({
                    target: { name: "quarter", value },
                  })
                }
              />
              {parsedparams?.panelName === "Daily Remitance" && (
                <FilterSelect
                  label="Date"
                  name="day"
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
            {parsedparams?.panelName === "Daily Remitance" && (
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
        {/* Tab Section */}
        <TabSectionWithDrawal
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        {/* Table Section */}
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
          lastLocation={lastLocation}
          setLastLocation={setLastLocation}
        />
      )}

      {/* Additional Detail Modal */}
      {additionalDetailModal && (
        <OpenAdditionalDetailFolder
          setAdditionalDetailModal={setAdditionalDetailModal}
          fileListData={fileListData}
          setFileListData={setFileListData}
          lastLocation={lastLocation}
          setLastLocation={setLastLocation}
        />
      )}

      {showAddDayFolder && (
        <AddDayFolderModal
          setShowAddDayFolder={setShowAddDayFolder}
          parsedParams={parsedParams}
          setDayList={setDayList}
        />
      )}
    </>
  );
};

export default WithDrawal;
