import statusContext from "@/context/ModalsContext/statusContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { useContext } from "react";

const ErrorModal = () => {
  const { errorModal, setErrorModal, errorMessage } = useContext(statusContext);

  useLockBodyScroll(errorModal);

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
        errorModal ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-[20rem] transform rounded-3xl bg-white px-4 pt-10 pb-8 shadow-[inset_10px_10px_14px_3px_#ffffff,inset_-10px_-10px_14px_3px_#ffffff] transition-all duration-300 ease-out`}
      >
        <div>
          {/* Red Check Circle */}
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-red-100">
            <div className="mx-auto flex h-15 w-15 items-center justify-center rounded-full bg-red-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <i className="fa-solid fa-circle-xmark rounded-4xl bg-white text-5xl text-red-600"></i>
              </div>
            </div>
          </div>
          {/* Title */}
          <h2 className="mt-4 text-center text-2xl font-medium text-gray-800">
            Error
          </h2>
          {/* Message */}
          <p className="mt-2 text-center text-gray-500">
            {typeof errorMessage !== "object"
              ? errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
              : errorMessage}
          </p>
          {/* Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setErrorModal(false)}
              className="w-3/5 cursor-pointer rounded-3xl bg-[#d40008] px-11 py-2 font-medium text-white hover:bg-red-600"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
