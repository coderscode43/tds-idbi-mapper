
const OpenAdditionalDetailFolder = ({
  fileListData,
  // setFileListData,
  setAdditionalDetailModal,
}) => {
  // // Table Details
  // const tableHead = [
  //   { key: "name", label: "File Name" },
  //   { key: "lastModified", label: "Last Modified", formatter: dateWithTime },
  //   { key: "fileType", label: "File Type" },
  //   { key: "size", label: "File Size", formatter: fileSize },
  //   { key: "action", label: "Action" },
  // ];

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
              onClick={() => setAdditionalDetailModal(false)}
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
                // onClick={() => setShowAddFolderModal(true)}
              >
                <i className="fa-solid fa-folder"></i> <span>Add Folder</span>
              </button>
              <button
                className="cursor-pointer space-x-1 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                // onClick={() => setShowAddDocumentModal(true)}
              >
                <i className="fa-solid fa-file"></i> <span>Add Document</span>
              </button>
              <button
                className="cursor-pointer space-x-1 rounded-md bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
                // onClick={() => setShowCreateFolderModal(true)}
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
                // onChange={handleInputChange}
              />
              <button className="cursor-pointer space-x-1 rounded-md bg-green-500 px-3 py-1.5 text-white hover:bg-green-600">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            {/* Table
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
            )} */}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 bg-blue-100 px-6 py-4">
            <button className="cursor-pointer space-x-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
              <i className="fa-solid fa-file-zipper"></i>{" "}
              <span>Generate Zip</span>
            </button>
            <button
              className="cursor-pointer space-x-1 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              // onClick={handleDelete}
            >
              <i className="fa-solid fa-trash"></i> <span>Delete</span>
            </button>
            <button
              className="cursor-pointer space-x-1 rounded-md bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
              // onClick={handleBack}
            >
              <i className="fa-solid fa-arrow-left"></i> <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* {showAddFolderModal && (
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
      )} */}
    </>
  );
};

export default OpenAdditionalDetailFolder;
