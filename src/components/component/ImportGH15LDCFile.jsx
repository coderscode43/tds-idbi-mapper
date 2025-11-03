import common from "@/common/common";
import statusContext from "@/context/ModalsContext/statusContext";
import { errorMessage } from "@/lib/utils";
import { useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const ImportGH15LDCFile = ({ entity, subPanel }) => {
  const { params } = useParams();
  const { showSuccess, showError } = useContext(statusContext);
  const fileInputRef = useRef({}); // store refs for each input

  const [selectedDocument, setSelectedDocuments] = useState("");

  const handleProcessButtonClick = async (processName) => {
    try {
      const response = await common.getStartProcess(
        entity,
        params,
        processName
      );
      showSuccess(response.data.successMsg);
    } catch (error) {
      showError(
        `Cannot start process ${processName.replace(/(?!^)([A-Z])/g, " $1")}: ${errorMessage(error)}`
      );
      console.error(error);
    }
  };

  const handleImport = async (title) => {
    let updatedSubPanel = [...subPanel, title];
    try {
      const response = await common.getImportFile(
        selectedDocument,
        updatedSubPanel,
        params
      );
      setSelectedDocuments({});
      showSuccess(response.data.message);
      // Reset the specific file input
      if (fileInputRef.current[title]) {
        fileInputRef.current[title].value = "";
      }
    } catch (error) {
      showError(`Cannot start ${subPanel} process: ${errorMessage(error)}`);
      console.error(error);
      setSelectedDocuments({});
    }
  };

  return (
    <>
      {/* Import File Section */}
      <div className="flex gap-5 rounded-md border border-gray-100 shadow-lg">
        {["15GH File", "LDC File"].map((title) => (
          <div
            key={title}
            className="w-full flex-col items-end gap-5 p-5 focus:outline-none"
          >
            <h4 className="mb-4 text-[17px] font-semibold">Import {title}</h4>
            <div>
              <label className="font-medium text-[var(--primary-color)]">
                Select Folder
              </label>
              <input
                type="file"
                name={title}
                ref={(el) => (fileInputRef.current[title] = el)}
                id={title}
                onChange={(e) => setSelectedDocuments(e.target.files[0])}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm/6 text-gray-900 file:mr-3 file:cursor-pointer focus:outline-none"
              />
            </div>
            <button
              className="btnBorder lightCyan btn mt-3"
              onClick={() => handleImport(title)}
            >
              <img
                className="h-[30px] w-[35px] mix-blend-multiply"
                src={`${import.meta.env.BASE_URL}images/gificons/importFile.gif`}
                alt="Import"
              />
              <span>Import File</span>
            </button>
          </div>
        ))}
      </div>

      {/* Buttons Section  */}
      <div className="mt-5 rounded-md border border-gray-100 shadow-md">
        <div className="flex items-center-safe justify-between gap-2 p-5">
          {/* GL Reconciliation Button  */}
          <button
            className="btnBorder DarkGreen btn"
            onClick={() => handleProcessButtonClick("GenerateReport")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/calculator.gif`}
              alt="Export to Excel Button"
              className="h-[30px] mix-blend-multiply"
            />
            <span className="w-full text-[16px]">GL Reconciliation</span>
          </button>
          <span>
            <i className="fa-solid fa-right-long text-gray-700"></i>
          </span>
          {/* Generate TTUM Report Button */}
          <button
            className="btnBorder Green btn"
            onClick={() => handleProcessButtonClick("GenerateReport")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/generateexcelfile.gif`}
              alt="Export to Excel Button"
              className="h-[30px] mix-blend-multiply"
            />
            <span className="w-full text-[16px]">Generate TTUM Report</span>
          </button>
          <span>
            <i className="fa-solid fa-right-long text-gray-700"></i>
          </span>
          {/* Generate Other OA & OE Excel */}
          <button
            className="btnBorder DarkGreen btn"
            onClick={() => handleProcessButtonClick("GenerateReport")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/GenerateExcel.gif`}
              alt="Launch Icon"
              className="h-[30px] w-[35px] mix-blend-multiply"
            />
            <span className="btntext text-[16px]">
              Generate Other OA & OE Excel
            </span>
          </button>
        </div>
        <div className="flex items-center-safe justify-between gap-2 p-5">
          {/* Generate Customer ID & PAN List  */}
          <button
            className="btnBorder Green btn"
            onClick={() => handleProcessButtonClick("GenerateReport")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/process.gif`}
              alt="Launch Icon"
              className="h-[30px] w-[35px] mix-blend-multiply"
            />
            <span className="btntext text-[16px]">
              Generate Customer ID & PAN List
            </span>
          </button>
          <span>
            <i className="fa-solid fa-right-long text-gray-700"></i>
          </span>
          {/*  Validate & Generate */}
          <button
            className="btnBorder DarkGreen btn"
            onClick={() =>
              handleProcessButtonClick("ValidateDataAndSegregateData")
            }
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/ValidateExcel.gif`}
              alt="Search Icon"
              className="h-7 mix-blend-multiply"
            />
            <span className="btntext text-[16px]">
              Validate & Generate Format File
            </span>
          </button>
          <span>
            <i className="fa-solid fa-right-long text-gray-700"></i>
          </span>
          {/* Validate & Generate  */}
          <button
            className="btnBorder yellow btn"
            onClick={() => handleProcessButtonClick("GenerateFormatFile")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/gificons/launchTemplate.gif`}
              alt="Launch Icon"
              className="h-[30px] w-[35px] mix-blend-multiply"
            />
            <span className="btntext text-[16px]">Generate Format File</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ImportGH15LDCFile;
