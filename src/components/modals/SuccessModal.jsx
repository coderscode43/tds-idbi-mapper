import statusContext from "@/context/ModalsContext/statusContext";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { useContext } from "react";

const SuccessModal = () => {
  const { successModal, setSuccessModal, successMessage } =
    useContext(statusContext);

  useLockBodyScroll(successModal);

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
        successModal ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-[20rem] transform rounded-3xl bg-white px-4 pt-10 pb-8 shadow-[inset_10px_10px_14px_3px_#ffffff,inset_-10px_-10px_14px_3px_#ffffff] transition-all duration-300 ease-out`}
      >
        <div>
          {/* Green Check Circle */}
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-green-100">
            <div className="mx-auto flex h-15 w-15 items-center justify-center rounded-full bg-green-200">
              <i className="fa-solid fa-circle-check rounded-full bg-white text-5xl text-[#00c847]"></i>
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-4 text-center text-2xl font-medium text-gray-800">
            Success!
          </h2>

          {/* Message */}
          <p className="mt-2 text-center text-gray-500">
            {successMessage || "Successfully Completed"}
          </p>

          {/* Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setSuccessModal(false)}
              className="w-3/5 cursor-pointer rounded-3xl bg-green-500/95 px-11 py-2 font-medium text-white hover:bg-green-600"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
