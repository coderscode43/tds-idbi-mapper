import DropdownMenu from "../component/DropdownMenu";
import { TooltipWrapper } from "../component/Tooltip";

const TopBar = ({ handleSideBar }) => {
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
              R J SONI and Associates - ABCDE1234A
            </h1>
          </div> */}
          <div className="flex items-center justify-center gap-5">
            <div>
              <TooltipWrapper tooltipText={"Refresh"}>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="cursor-pointer rounded-md bg-[#12a4ed] px-2 py-1.5 text-sm text-white"
                >
                  Refresh
                </button>
              </TooltipWrapper>
            </div>
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
