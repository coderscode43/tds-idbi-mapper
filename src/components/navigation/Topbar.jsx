// import { useContext } from "react";
import DropdownMenu from "../component/DropdownMenu";
// import staticDataContext from "@/context/staticDataContext";

const TopBar = ({ isSidebarOpen, setSideBarOpen }) => {
  // const { ClientName, ClientPAN } = useContext(staticDataContext);

  return (
    <div className="sticky top-0 z-10">
      <header className="bg-white" style={{ boxShadow: "black 0px 0px 15px" }}>
        <div className="mx-10 flex h-[50px] items-center justify-between">
          <div className="flex items-center gap-10">
            <button onClick={() => setSideBarOpen((prev) => !prev)}>
              <span className="relative block h-5 w-5">
                <i
                  className={`fa-solid fa-bars absolute top-0 left-0 cursor-pointer text-black transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "scale-75 rotate-90 opacity-0"
                      : "scale-100 rotate-0 opacity-100"
                  }`}
                ></i>
                <i
                  className={`fa-solid fa-xmark absolute top-0 left-0 cursor-pointer text-black transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "scale-100 rotate-0 opacity-100"
                      : "scale-75 -rotate-90 opacity-0"
                  }`}
                ></i>
              </span>
            </button>
            <div>
              <img
                className="h-8 cursor-pointer object-contain"
                src={`${import.meta.env.BASE_URL}images/IDBI-Bank-logo.png`}
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
            <button
              // disabled={selectFolder.length === 0}
              className="btnBorder Violet btn"
              onClick={() =>
                window.open("http://localhost:8080/TDSProcessWeb", "_blank")
              }
            >
              <img
                src={`${import.meta.env.BASE_URL}images/gificons/database.gif`}
                alt="TDS Process Web"
                className="h-7 mix-blend-multiply"
              />
              <span className="btntext text-[16px]">TDS Process Web</span>
            </button>
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
