import common from "@/common/common";
import statusContext from "@/context/ModalsContext/statusContext";
import staticDataContext from "@/context/staticDataContext";
import { errorMessage } from "@/lib/utils";
import React from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";

const ImportRawFiles = () => {
  const entity = "ImportDeductee";

  const { params } = useParams();
  // Data from context
  const { typeOfFile } = useContext(staticDataContext);
  const { showSuccess, showError } = useContext(statusContext);

  const fileType = Array.isArray(typeOfFile) ? typeOfFile[0] : "";

  const handleProcessButtonClick = async (processName) => {
    const parsedParams = JSON.parse(params);

    const formData = {
      ...parsedParams,
      typeOfFile: fileType,
      processName: processName,
    };

    try {
      const response = await common.getStartProcess(entity, formData);
      showSuccess(response.data.successMsg);
    } catch (error) {
      showError(
        `Cannot start process ${processName.replace(/(?!^)([A-Z])/g, " $1")}: ${errorMessage(error)}`
      );
      console.error(error);
    }
  };

  return (
    <>
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

      <div className="mt-5 flex justify-between gap-4 rounded-md border border-gray-100 p-5 shadow-lg">
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
    </>
  );
};

export default ImportRawFiles;
