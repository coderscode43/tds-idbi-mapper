// import { useContext } from "react";
import DropdownMenu from "../component/DropdownMenu";
// import staticDataContext from "@/context/staticDataContext";

const TopBar = ({ handleSideBar }) => {
  // const { ClientName, ClientPAN } = useContext(staticDataContext);

  return (
    <div className="sticky top-0 z-10">
      <header className="bg-white" style={{ boxShadow: "black 0px 0px 15px" }}>
        <div className="mx-10 flex h-[50px] items-center justify-between">
          <div className="flex items-center gap-10">
            <button onClick={handleSideBar} aria-label="Toggle sidebar">
              <i className="fa-solid fa-bars cursor-pointer text-gray-400"></i>
            </button>
            <div>
              <img
                className="h-8 cursor-pointer object-contain"
                src="/images/IDBI-Bank-logo.png"
                alt="IDBI Logo"
              />
            </div>
          </div>
          {/* <div className="mr-[90px]">
            <h1 className="text-xl font-bold text-[var(--primary-color)]">
              {ClientName} - {ClientPAN}
            </h1>
          </div> */}
          <div className="flex items-center justify-center gap-5">
            <div>
              <DropdownMenu />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default TopBar;
