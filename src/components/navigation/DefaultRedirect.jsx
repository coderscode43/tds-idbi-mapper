import { refinedSearchParams } from "@/lib/utils";
import staticDataContext from "@/context/staticDataContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const DefaultRedirect = () => {
  const { ClientPAN, crtFy, crtMonth, crtQuarter } =
    useContext(staticDataContext);

  // Wait until all context values are available
  const isDataReady = crtFy && crtMonth && crtQuarter;

  if (!isDataReady) {
    return null; // Or a loading spinner
  }

  const searchObj = {
    pan: ClientPAN,
    fy: crtFy,
    month: crtMonth,
    quarter: crtQuarter,
    panelName: "importRawFiles",
    pageName: "Import Deductee",
  };

  const refinedParams = refinedSearchParams(searchObj);

  // Navigate to importDeducteeDetails with the computed params
  return (
    <Navigate
      to={`/home/listSearch/importDeducteeDetails/${refinedParams}`}
      replace
    />
  );
};

export default DefaultRedirect;
