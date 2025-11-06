import FilterSelect from "@/components/component/FilterSelect";
import staticDataContext from "@/context/staticDataContext";
import { useContext } from "react";

const SettingPage = () => {
  const {
    crtQuarter,
    crtMonth,
    crtFy,
    monthList,
    financialYear,
    typeOfFile,
    workingFileBasePath,
  } = useContext(staticDataContext);

  // Filter months based on selected quarter
  const quarterToUse = crtQuarter;
  const filteredMonths = monthList?.[quarterToUse] || [];

  return (
    <div className="space-y-5">
      <h1 className="mb-4 text-[25px] font-bold">Setting</h1>

      <div className="flex items-end justify-between gap-4">
        <div className="flex w-full gap-5">
          <FilterSelect
            label="Financial Year"
            name="fy"
            options={financialYear}
            value={crtFy}
            // onChange={value}
          />
          <FilterSelect
            label="Month"
            name="month"
            options={filteredMonths}
            value={crtMonth}
            // onChange={value}
          />

          <FilterSelect
            label="Quarter"
            name="quarter"
            options={Object.keys(monthList || {})}
            value={crtQuarter}
            // onChange={value}
          />
          <FilterSelect
            label="Type of file"
            name="typeOfFile"
            options={typeOfFile}
            value={typeOfFile?.[0] ?? ""}
            // onChange={value}
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
