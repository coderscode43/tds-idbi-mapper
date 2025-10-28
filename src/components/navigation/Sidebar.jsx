import staticDataContext from "@/context/staticDataContext";
import { refinedSearchParams } from "@/lib/utils";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import DynamicModal from "../component/DynamicModal";

const navItems = [
  {
    id: "importDeducteeDetails",
    label: "Import Deductee",
    page: "importDeducteeDetails",
    iconClass: "fa-solid fa-file-import",
  },
  {
    id: "withDrawal",
    label: "WithDrawal",
    page: "withDrawal",
    iconClass: "fa-solid fa-money-check-dollar",
  },
  {
    id: "settings",
    label: "Settings",
    page: "settings",
    iconClass: "fa-solid fa-gear",
  },
];

const Sidebar = ({ sideBarOpen }) => {
  const { crtFy, crtMonth, crtQuarter } = useContext(staticDataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const searchObj = {
    fy: crtFy,
    month: crtMonth,
    quarter: crtQuarter,
  };
  const refinedParams = refinedSearchParams(searchObj);

  return (
    <>
      <div className="fixed top-16 z-10 h-screen">
        <nav
          className={`${sideBarOpen ? "w-55" : "w-[47.5px]"} group transition-width flex h-[91%] w-16 flex-col overflow-hidden rounded-r-lg border border-l-0 border-gray-500 bg-[#edf2fa] p-2.5 text-black shadow-[3px_0px_0px_0px_#72a83a] duration-700 ease-in-out hover:w-55`}
          style={{ transitionProperty: "width" }}
        >
          {/* Scrollable nav items */}
          <div className="hide-scrollbar flex-1 overflow-y-auto">
            <ul className="space-y-1 text-[17px]">
              {navItems?.map(({ id, label, page, iconClass, textIcon }) => {
                return (
                  <li key={id}>
                    <NavLink
                      to={
                        id !== "settings"
                          ? `/home/listSearch/${page}/${refinedParams}`
                          : `/home/list/${page}`
                      }
                      className={({ isActive }) =>
                        [
                          "relative flex cursor-pointer items-center justify-between py-2 font-medium whitespace-nowrap text-black transition-all after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left",
                          isActive
                            ? "after:scale-x-100 after:bg-[#72a83a] after:transition-transform after:duration-300"
                            : "after:scale-x-0 after:bg-[#72a83a] after:transition-transform after:duration-300 hover:after:scale-x-100",
                        ].join(" ")
                      }
                    >
                      <div
                        className={`w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:w-auto group-hover:opacity-100 ${sideBarOpen ? "ml-2 w-auto opacity-100" : " "}`}
                        style={{
                          transitionProperty: "opacity, width, margin-left",
                        }}
                      >
                        {label}
                      </div>
                      <div>
                        {iconClass ? (
                          <i
                            className={`${iconClass} w-[26px] text-center`}
                          ></i>
                        ) : (
                          <span className="text-md text-center font-semibold">
                            {textIcon}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>

      {/* Render the modal only when open */}
      {isModalOpen && (
        <DynamicModal
          title="Are you sure?"
          description="Do you want to logout !!!"
          isModalOpen={() => setIsModalOpen(true)}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default Sidebar;
