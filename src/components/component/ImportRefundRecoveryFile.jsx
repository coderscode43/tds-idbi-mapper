import React from "react";

const ImportRefundRecoveryFile = () => {
  return (
    <>
      <div className="space-y-5">
        <h6 className="mb-4 text-[15px] font-bold">
          {" "}
          ImportRefundRecoveryFile
        </h6>
      </div>

      <div className="flex items-end gap-5 rounded-md border border-gray-100 p-5 shadow-md focus:outline-none">
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
      </div>
    </>
  );
};

export default ImportRefundRecoveryFile;
