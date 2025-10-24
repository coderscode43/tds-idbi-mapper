import staticDataContext from "@/context/staticDataContext";
import React from "react";
import { useContext } from "react";

const SettingPage = () => {
  const { Quarter, Tan, Section } = useContext(staticDataContext);
  return (
    <>
      <div className="space-y-5">
        <h1 className="mb-4 text-[25px] font-bold">Setting</h1>

        <div className="flex flex-col gap-8 rounded-2xl border border-gray-200 p-5">
          <div className="w-full md:w-1/4">
            <label className="font-semibold text-[var(--primary-color)]">
              Quarter
            </label>
            <select
              name="quarter"
              id="quarter"
              className="mt-1 block h-[38px] w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm/6 text-gray-900 focus:outline-none"
              // value={searchParams.quarter}
              // onChange={(e) =>
              //   common.handleSearchInputChange(e, setSearchParams)
              // }
            >
              <option value="">Select Quarter</option>
              {Quarter &&
                Quarter.length > 0 &&
                Quarter.map((quarter, index) => {
                  return (
                    <option key={index} value={quarter}>
                      {quarter}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingPage;
