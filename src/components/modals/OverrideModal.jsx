import { useContext } from "react";
import statusContext from "@/context/statusContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

const OverrideModal = () => {
  const { overrideModal, setOverrideModal, overrideMessage } =
    useContext(statusContext);

  useLockBodyScroll(overrideModal);

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
        overrideModal ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="relative w-full max-w-[20rem] rounded-2xl bg-white px-4 pt-8 pb-6 shadow-xl transition-all">
        {/* Header with image */}
        <div className="flex flex-col items-center justify-center gap-2">
          <i className="fa-solid fa-circle-xmark text-5xl text-red-600"></i>
          <p className="text-2xl font-medium">Error</p>
        </div>

        {/* Error message */}
        <div className="relative pt-3 pb-6 text-center text-gray-600">
          {typeof errorMessage !== "object"
            ? overrideMessage.charAt(0).toUpperCase() + overrideMessage.slice(1)
            : overrideMessage}
        </div>

        {/* Footer */}
        <div className="flex w-full justify-center rounded-b-md">
          <button
            onClick={() => {
              setOverrideModal(false);
            }}
            className="mx-2 w-full cursor-pointer rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
          >
            No
          </button>

          <button
            onClick={() => {
              setOverrideModal(false);
            }}
            className="mx-2 w-full cursor-pointer rounded-lg bg-[#d40008] py-2 font-medium text-white hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverrideModal;
