import common from "@/common/common";
import statusContext from "@/context/ModalsContext/statusContext";
import {
  anyFileDownload,
  dateWithTime,
  errorMessage,
  fileSize,
} from "@/lib/utils";
import { useContext, useState } from "react";
import ErrorMessage from "../component/ErrorMessage";
import DynamicTableCheckBoxAction from "../tables/DynamicTableCheckBoxAction";
import AddDocumentModal from "./AddDocumentModal";
import AddFolderModal from "./AddFolderModal";
import CreateFolderModal from "./CreateFolderModal";

const OpenFolderModal = ({ onClose, fileListData, setFileListData }) => {
  const { showSuccess, showError } = useContext(statusContext);

  const [errors, setErrors] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  // Table Details
  const tableHead = [
    { key: "name", label: "File Name" },
    { key: "lastModified", label: "Last Modified", formatter: dateWithTime },
    { key: "fileType", label: "File Type" },
    { key: "size", label: "File Size", formatter: fileSize },
    { key: "action", label: "Action" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, "Name");
    console.log(value, "Value");
  };

  const handleBack = async () => {
    const lastLocation = fileListData[0]?.lastLocation;
    const lastPart = lastLocation.substring(lastLocation.lastIndexOf("/") + 1);
    try {
      const response = await common.getGotoLastLocation(lastLocation, lastPart);
      setFileListData(response?.data?.entities);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTableDownload = async (data) => {
    try {
      // Construct the file path with proper slashes
      const lastLocation = `${data.lastLocation}/${data.name}`;
      // Replace / with ^ (or any placeholder) since backend replaces ^ back to /
      const filePath = encodeURIComponent(lastLocation).replace(/%2F/g, "^");
      const response = await common.getDownloadFile(filePath);
      anyFileDownload(response);
      showSuccess(response?.data?.succesMsg || "File Downloaded Successfully");
    } catch (error) {
      showError(
        `Cannot download.
       ${error?.response?.data?.entityName || ""}
       ${errorMessage(error)}`
      );
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    // Validate checkbox selection
    if (selectedRows.length === 0) {
      newErrors.selectedRows = "Please select at least one checkbox.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    // Construct the file path with proper slashes
    const lastLocation = `${selectedRowsData[0]?.lastLocation}`;
    const formData = {
      entity: {
        deleteFileOrFolder: selectedRowsData,
      },
      lastLocation: lastLocation,
    };
    try {
      const response = await common.getFileDeleted(JSON.stringify(formData));
      setFileListData(response?.data?.entities || []);
      showSuccess(response.data.successMsg);
    } catch (error) {
      showError(errorMessage(error));
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Working File
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-xl text-gray-600"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 p-6">
            {/* Top Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="cursor-pointer space-x-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                onClick={() => setShowAddFolderModal(true)}
              >
                <i className="fa-solid fa-folder"></i> <span>Add Folder</span>
              </button>
              <button
                className="cursor-pointer space-x-1 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                onClick={() => setShowAddDocumentModal(true)}
              >
                <i className="fa-solid fa-file"></i> <span>Add Document</span>
              </button>
              <button
                className="cursor-pointer space-x-1 rounded-md bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
                onClick={() => setShowCreateFolderModal(true)}
              >
                <i className="fa-solid fa-folder-plus"></i>{" "}
                <span>Create Folder</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={`${fileListData[0]?.lastLocation || ""}`}
                placeholder="Add Bulk Token Number"
                className="flex-grow rounded-md border border-gray-300 px-4 py-1.5 text-[15px] text-gray-700 focus:outline-none"
                onChange={handleInputChange}
              />
              <button className="cursor-pointer space-x-1 rounded-md bg-green-500 px-3 py-1.5 text-white hover:bg-green-600">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            {/* Table */}
            <DynamicTableCheckBoxAction
              tableHead={tableHead}
              tableData={fileListData}
              setFileListData={setFileListData} //for going inside the table
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              setSelectedRowsData={setSelectedRowsData}
              handleDownload={handleTableDownload} // fro downloading the file
            />
            {errors && errors.selectedRows && (
              <ErrorMessage error={errors.selectedRows} />
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 bg-blue-100 px-6 py-4">
            <button className="cursor-pointer space-x-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
              <i className="fa-solid fa-file-zipper"></i>{" "}
              <span>Generate Zip</span>
            </button>
            <button
              className="cursor-pointer space-x-1 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              <i className="fa-solid fa-trash"></i> <span>Delete</span>
            </button>
            <button
              className="cursor-pointer space-x-1 rounded-md bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
              onClick={handleBack}
            >
              <i className="fa-solid fa-arrow-left"></i> <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {showAddFolderModal && (
        <AddFolderModal
          fileListData={fileListData}
          setFileListData={setFileListData}
          closeAddFolderModal={() => setShowAddFolderModal(false)}
        />
      )}

      {showAddDocumentModal && (
        <AddDocumentModal
          fileListData={fileListData}
          setFileListData={setFileListData}
          closeAddDocumentModal={() => setShowAddDocumentModal(false)}
        />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal
          fileListData={fileListData}
          setFileListData={setFileListData}
          closeCreateFolderModal={() => setShowCreateFolderModal(false)}
        />
      )}
    </>
  );
};

export default OpenFolderModal;
