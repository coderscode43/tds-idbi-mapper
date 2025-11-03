import statusContext from "@/context/ModalsContext/statusContext";
import { useState } from "react";
import { useContext } from "react";
import ErrorMessage from "../component/ErrorMessage";
import { errorMessage, monthMaxDays } from "@/lib/utils";
import common from "@/common/common";

const AddDayFolderModal = ({
  setShowAddDayFolder,
  parsedParams,
  setDayList,
}) => {
  const { showError, showSuccess } = useContext(statusContext);

  const [day, setDay] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Only allow numbers
    if (/^\d*$/.test(value)) {
      const maxDay = monthMaxDays[parsedParams.month] || 31;

      if (value === "" || parseInt(value) <= maxDay) {
        setDay(value);
        setErrors({});
      } else {
        setErrors({ selectedRows: `Invalid day for ${parsedParams.month}` });
      }
    } else {
      setErrors({ selectedRows: "Please enter only numbers" });
    }
  };

  const validate = () => {
    if (!day || day.length === 0) {
      setErrors({ selectedRows: "Please enter a day" });
      return false;
    }
    const formattedDay = day.padStart(2, "0"); // always 2 digits

    const numericDay = parseInt(formattedDay, 10);
    const maxDay = monthMaxDays[parsedParams.month] || 31;

    if (numericDay < 1 || numericDay > maxDay) {
      setErrors({ selectedRows: `Invalid day for ${parsedParams.month}` });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleAddDayFolder = async () => {
    if (!validate()) return;

    const formattedDay = day.padStart(2, "0"); // always 2 digits

    // Construct your request payload
    const formData = {
      ...parsedParams,
      day: formattedDay,
    };
    console.log("Sending data:", formData); // debug log before hitting API

    try {
      const response = await common.getCreateDayFolder(formData);
      setDayList(response?.data?.entities)
      showSuccess(response?.data?.successMsg || "Folder created successfully!");
      setShowAddDayFolder(false);
    } catch (error) {
      showError(errorMessage(error));
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
          {/* Modal Header */}
          <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-blue-100 px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Add Day Folder
            </h2>
            <button
              onClick={() => setShowAddDayFolder(false)}
              className="cursor-pointer text-xl text-gray-500 transition hover:text-red-500"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-col">
            <div className="flex items-center justify-center px-6 py-5">
              <label className="block p-2 font-medium text-gray-700">
                Enter date :
              </label>
              <input
                type="text"
                id="day"
                name="day"
                value={day || ""}
                maxLength={2} // user can only type 2 digits
                placeholder="DD" // show that only 2 digits are allowed
                onChange={handleInputChange}
                className="w-2/5 rounded-md border border-gray-200 py-1 text-center text-sm"
              />
            </div>
            <div className="flex justify-evenly">
              {errors && errors.selectedRows && (
                <ErrorMessage error={errors.selectedRows} />
              )}
            </div>
          </div>
          {/* Modal Footer */}
          <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-blue-100 px-6 py-4">
            <button
              onClick={() => setShowAddDayFolder(false)}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              <i className="fa-solid fa-xmark"></i> <span>Cancel</span>
            </button>
            <button
              onClick={() => handleAddDayFolder()}
              //   disabled={!selectedFolder}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              <i className="fa-solid fa-folder-plus"></i>
              <span>Add Folder</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDayFolderModal;
