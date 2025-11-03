import common from "@/common/common";
import statusContext from "@/context/ModalsContext/statusContext";
import { errorMessage } from "@/lib/utils";
import { useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const ImportGH15 = ({ subPanel, entity }) => {
  const { params } = useParams();
  const { showSuccess, showError } = useContext(statusContext);
  const fileInputRef = useRef({});

  const [selectedDocument, setSelectedDocuments] = useState("");

  const handleProcessButtonClick = async (processName) => {
    try {
      const response = await common.getStartProcess(
        entity,
        params,
        processName
      );
      showSuccess(response.data.message);
    } catch (error) {
      showError(
        `Cannot start process ${processName.replace(/(?!^)([A-Z])/g, " $1")}: ${errorMessage(error)}`
      );
      console.error(error);
    }
  };

  const handleImport = async () => {
    try {
      const response = await common.getImportFile(
        selectedDocument,
        subPanel,
        params
      );
      setSelectedDocuments({});
      showSuccess(response.data.successMsg);
      // Reset the specific file input
      if (fileInputRef.current[0]) {
        fileInputRef.current[0].value = "";
      }
    } catch (error) {
      showError(`Cannot start process ${subPanel}: ${errorMessage(error)}`);
      console.error(error);
      setSelectedDocuments({});
    }
  };

  return (
    <>
      {/* Import File Section */}
      <div className="flex items-end gap-5 rounded-md border border-gray-100 p-5 shadow-md focus:outline-none">
        <div>
          <label className="font-medium text-[var(--primary-color)]">
            Select Folder
          </label>
          <input
            type="file"
            name="importFile"
            ref={(el) => (fileInputRef.current[0] = el)}
            onChange={(e) => setSelectedDocuments(e.target.files[0])}
            id="importFile"
            className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm/6 text-gray-900 file:mr-3 file:cursor-pointer focus:outline-none"
          />
        </div>
        <button className="btnBorder lightCyan btn" onClick={handleImport}>
          <img
            className="h-[35px] w-[35px] mix-blend-multiply"
            src={`${import.meta.env.BASE_URL}images/gificons/importFile.gif`}
            alt="Import"
          />
          <span>Import GH15</span>
        </button>
      </div>
      {/* Buttons Section  */}
      <div className="mt-5 rounded-md border border-gray-100 shadow-md">
        <div className="flex items-center-safe justify-between gap-4 p-5">
          {/* Validate 15 GH */}
          <button
            className="btnBorder yellow btn"
            onClick={() => handleProcessButtonClick("Validate15GH")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/challandetails.gif`}
              alt="Search Icon"
              className="h-7 mix-blend-multiply"
            />
            <span className="btntext text-[16px]">Validate 15 GH</span>
          </button>
          <span>
            <i className="fa-solid fa-right-long text-gray-700"></i>
          </span>
          {/* Validate new A/C No */}
          <button
            className="btnBorder yellow btn"
            onClick={() => handleProcessButtonClick("ValidateNewAccount")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/agreement.gif`}
              alt="Search Icon"
              className="h-7 mix-blend-multiply"
            />
            <span className="btntext text-[16px]">Validate New A/C No </span>
          </button>
          <span>
            <i className="fa-solid fa-right-long text-gray-700"></i>
          </span>
          {/* Validate Tax Code*/}
          <button
            className="btnBorder yellow btn"
            onClick={() => handleProcessButtonClick("ValidateTaxCode")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/change.gif`}
              alt="Search Icon"
              className="h-7 mix-blend-multiply"
            />
            <span className="btntext text-[16px]">Validate Tax Code</span>
          </button>
          <span>
            <i className="fa-solid fa-right-long text-gray-700"></i>
          </span>
          {/* Validate  New TDS */}
          <button
            className="btnBorder yellow btn"
            onClick={() => handleProcessButtonClick("ValidateNewTds")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/financing.gif`}
              alt="Search Icon"
              className="h-7 mix-blend-multiply"
            />
            <span className="btntext text-[16px]">Validate New TDS</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ImportGH15;
