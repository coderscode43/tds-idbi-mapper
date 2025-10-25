import common from "@/common/common";
import FilterSelect from "@/components/component/FilterSelect";
import staticDataContext from "@/context/staticDataContext";
import { useContext } from "react";

const SettingPage = () => {
  const {
    Quarter,
    crtQuarter,
    crtMonth,
    Month,
    crtFy,
    financialYear,
    typeOfFile,
    workingFileBasePath,
  } = useContext(staticDataContext);

  return (
    <div className="space-y-5">
      <h1 className="mb-4 text-[25px] font-bold">Setting</h1>

      <div className="flex items-end justify-between gap-4">
        <div className="flex w-full gap-5">
          <FilterSelect
            label="Financial Year"
            name="financialYear"
            options={financialYear}
            value={crtFy}
            // onChange={handleSearchParamChange}
          />
          <FilterSelect
            label="Month"
            name="month"
            options={Month}
            value={crtMonth?.toUpperCase()}
            // onChange={handleSearchParamChange}
          />
          <FilterSelect
            label="Quarter"
            name="quarter"
            options={Quarter}
            value={crtQuarter}
            // onChange={handleSearchParamChange}
          />
          <FilterSelect
            label="Type of file"
            name="typeOfFile"
            options={typeOfFile}
            value={typeOfFile}
            onChange={common.handleSearchInputChange}
          />
        </div>
      </div>
      {/* Working File Folder */}
      <div className="w-full">
        <label className="font-semibold text-[var(--primary-color)]">
          Working File Folder
        </label>
        <input
          disabled
          type="text"
          name="branchName"
          id="branchName"
          value={workingFileBasePath}
          className="mt-2 block w-full cursor-not-allowed rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm/6 text-gray-900 file:mr-3 file:cursor-pointer focus:outline-none"
        />
      </div>
    </div>
  );
};

export default SettingPage;
