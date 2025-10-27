import common from "@/common/common";
import FilterSelect from "@/components/component/FilterSelect";
import TabSectionWithDrawal from "@/components/component/TabSectionWithDrawal";
import staticDataContext from "@/context/staticDataContext";
import { refinedSearchParams } from "@/lib/utils";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const WithDrawal = () => {
  const navigate = useNavigate();
  const { params } = useParams();
  // Data from context
  const {
    crtFy,
    crtMonth,
    crtQuarter,
    Quarter,
    Month,
    ClientPAN,
    dayList,
    crtDay,
  } = useContext(staticDataContext);

  const [searchParams, setSearchParams] = useState({
    fy: "",
    month: "",
    quarter: "",
    typeOfFile: "",
    panelName: params?.panelName || "",
  });

  const handleSearchParamChange = (e) => {
    const { name, value } = e.target;

    const updatedSearchParams = {
      ...searchParams,
      [name]: value,
    };

    setSearchParams(updatedSearchParams);

    const searchObj = {
      pan: ClientPAN,
      fy: updatedSearchParams.fy || crtFy,
      month: updatedSearchParams.month || crtMonth,
      quarter: updatedSearchParams.quarter || crtQuarter,
      typeOfFile: updatedSearchParams.dayList || crtDay,
      panelName: updatedSearchParams.panelName || "ImportRawFiles",
      pageName: "Import Deductee",
    };

    if (updatedSearchParams.typeOfFile) {
      delete searchObj.typeOfFile;
    }

    const refinedParams = refinedSearchParams(searchObj);

    // Navigate to the updated URL
    navigate(`/home/listSearch/importDeducteeDetails/${refinedParams}`);
  };

  return (
    <>
      <div className="space-y-5">
        <h1 className="mb-4 text-[25px] font-bold">WithDrawal</h1>
        <div className="space-y-6 rounded-md border border-gray-100 p-5 shadow-lg">
          <div className="flex w-full gap-5">
            <FilterSelect
              label="Financial Year"
              name="fy"
              options={[crtFy]}
              value={searchParams.fy || crtFy}
              onChange={handleSearchParamChange}
            />
            <FilterSelect
              label="Month"
              name="month"
              options={Month}
              value={searchParams.month || crtMonth?.toUpperCase()}
              onChange={handleSearchParamChange}
            />
            <FilterSelect
              label="Quarter"
              name="quarter"
              options={Quarter}
              value={searchParams.quarter || crtQuarter}
              onChange={handleSearchParamChange}
            />
            <FilterSelect
              label="Date"
              name="typeOfFile"
              options={dayList}
              value={searchParams.dayList || crtDay}
              onChange={common.handleSearchInputChange}
            />
          </div>
          <div className="flex justify-end gap-5">
            <button
              // disabled={selectFolder.length === 0}
              className="btnBorder Violet btn"
            >
              <img
                src={"/images/gificons/add.gif"}
                alt="Add Date Folder"
                className="h-7 mix-blend-multiply"
              />
              <span className="btntext text-[16px]">Add Date Folder</span>
            </button>
            <button className="btnBorder lightYellow btn">
              <img
                src={"/images/gificons/openfile.gif"}
                alt="Add Bulk Token"
                className="h-7 mix-blend-multiply"
              />
              <span className="btntext text-[16px]">
                Open Additional Details
              </span>
            </button>
          </div>
        </div>
        <TabSectionWithDrawal
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </div>
    </>
  );
};

export default WithDrawal;
