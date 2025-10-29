import common from "@/common/common";
import statusContext from "@/context/ModalsContext/statusContext";
import staticDataContext from "@/context/staticDataContext";
import { errorMessage } from "@/lib/utils";
import { useContext } from "react";
import { useParams } from "react-router-dom";

const ImportNewAccount = () => {
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
      {/* Import File Section */}
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
            className="h-[35px] w-[35px] mix-blend-multiply"
            src={"/images/gificons/importFile.gif"}
            alt="Import"
          />
          <span>Import File</span>
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
              src={"/images/gificons/challandetails.gif"}
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
              src={"/images/gificons/agreement.gif"}
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
              src={"/images/gificons/change.gif"}
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
              src={"/images/gificons/financing.gif"}
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

export default ImportNewAccount;
