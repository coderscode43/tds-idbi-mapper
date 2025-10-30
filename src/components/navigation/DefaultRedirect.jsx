import { refinedSearchParams } from "@/lib/utils";
import staticDataContext from "@/context/staticDataContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const DefaultRedirect = () => {
  const { ClientPAN, crtFy, crtMonth, crtQuarter, typeOfFile, crtDay } =
    useContext(staticDataContext);

  // Wait until all context values are available
  const isDataReady = crtFy && crtMonth && crtQuarter;

  if (!isDataReady) {
    return null; // Or a loading spinner
  }

  let panelName = "Daily Remitance";
  let pageName = "Import Deductee";
  const searchObj = {
    pan: ClientPAN,
    fy: crtFy,
    month: crtMonth,
    quarter: crtQuarter,
    typeOfFile:
      pageName === pageName ? (typeOfFile ? typeOfFile[0] : typeOfFile) : null,
    day: panelName === "Daily Remitance" ? crtDay : null,
    panelName: panelName,
    pageName: pageName,
  };

  const refinedParams = refinedSearchParams(searchObj);

  // Navigate to Import Deductee with the computed params
  return (
    <Navigate to={`/home/listSearch/importDeductee/${refinedParams}`} replace />
  );
};

export default DefaultRedirect;
