import common from "@/common/common";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const AddDocumentModal = ({
  setFileListData,
  fileListData,
  closeAddDocumentModal,
}) => {
  const { params } = useParams();
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleDocumentChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setSelectedDocument(files);
    } else {
      setSelectedDocument(null);
    }
  };

  const handleAddDocumentFolder = async () => {
    if (selectedDocument) {
      try {
        const response = await common.getAddFileInFolder(
          params,
          fileListData,
          selectedDocument
        );
        setFileListData(response?.data?.entities);
        closeAddDocumentModal();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-blue-100 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">Add Document</h2>
          <button
            onClick={() => closeAddDocumentModal(false)}
            className="cursor-pointer text-xl text-gray-500 transition hover:text-red-500"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 px-6 py-5">
          <label className="block font-medium text-gray-700">
            Select a document:
          </label>
          <input
            type="file"
            // webkitdirectory="true"
            // directory=""
            onChange={handleDocumentChange}
            className="w-full cursor-pointer rounded-md border border-gray-200 px-4 py-2 text-sm"
          />
          {/* {selectedDocument && (
            <p className="text-sm text-gray-600">Selected: {selectedDocument}</p>
          )} */}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-blue-100 px-6 py-4">
          <button
            onClick={() => closeAddDocumentModal(false)}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <i className="fa-solid fa-xmark"></i> <span>Cancel</span>
          </button>
          <button
            onClick={handleAddDocumentFolder}
            disabled={!selectedDocument}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white transition ${
              selectedDocument
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-blue-300"
            }`}
          >
            <i className="fa-solid fa-folder-plus"></i>{" "}
            <span>Add Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;
