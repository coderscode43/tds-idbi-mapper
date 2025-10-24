import { useState } from "react";
import StatusContext from "./statusContext";

const StatusProvider = ({ children }) => {
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState(null);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [overrideModal, setOverrideModal] = useState(false);
  const [overrideMessage, setOverrideMessage] = useState("");

  const showSuccess = (message, redirectPath = null) => {
    setSuccessMessage(message);
    setRedirectPath(redirectPath);
    setSuccessModal(true);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setErrorModal(true);
  };

  const showOverride = (message) => {
    setOverrideMessage(message);
    setOverrideModal(true);
  };

  return (
    <StatusContext.Provider
      value={{
        successModal,
        setSuccessModal,
        successMessage,

        errorModal,
        setErrorModal,
        errorMessage,

        overrideModal,
        setOverrideModal,
        overrideMessage,

        showSuccess,
        showError,
        showOverride,
        redirectPath, // Expose redirectPath
        setRedirectPath, // Expose setter if needed
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export default StatusProvider;
