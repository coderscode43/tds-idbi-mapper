import common from "@/common/common";
import StickyScrollbarWrapper from "../component/StickyScrollbarWrapper";

const DynamicTable = ({
  tableHead,
  tableData,
  autoResize,
  setFileListData,
}) => {
  const [lastLocation] = tableData;

  return (
    <div className="relative w-full">
      <div className="w-full overflow-clip rounded-md border border-gray-200">
        <StickyScrollbarWrapper>
          <table className="w-full text-[14px]">
            <thead
              className="bg-[var(--secondary-color)]"
              style={{
                zIndex: "9",
                position: "sticky",
                top: "56px",
              }}
            >
              <tr>
                {tableHead?.map(({ label }, index) => (
                  <th
                    key={index}
                    className={`z-0 border-r-[1.5px] border-l-[1.5px] bg-[var(--secondary-color)] p-2 whitespace-nowrap text-white ${
                      index === 0
                        ? "border-l-[var(--secondary-color)]" // left border on first th
                        : "border-l-gray-300"
                    } ${
                      index === tableHead.length - 1
                        ? "border-r-[var(--secondary-color)]" // right border on last th
                        : "border-r-gray-300"
                    } `}
                  >
                    <div className="block min-w-[70px] resize-x overflow-auto">
                      {label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!lastLocation ||
              (Object.keys(lastLocation).length === 1 &&
                Object.keys(lastLocation)[0] === "lastLocation") ? (
                <tr>
                  <td
                    colSpan={tableHead.length}
                    className="p-4 text-center text-[16px] font-semibold text-red-500"
                  >
                    No Files Added
                  </td>
                </tr>
              ) : (
                tableData?.map((data, index) => {
                  return (
                    <tr
                      key={index}
                      className={
                        "cursor-pointer bg-white text-center hover:bg-gray-100"
                      }
                      onDoubleClick={async () => {
                        const response = await common.getGotoFolder(data);
                        setFileListData(response?.data?.entities || []);
                      }}
                    >
                      {tableHead?.map(({ key }, colIndex) => (
                        <td
                          key={colIndex}
                          className={`border-[1.5px] border-gray-300 p-2 text-ellipsis whitespace-nowrap ${
                            autoResize
                              ? "w-auto"
                              : "max-w-[110px] min-w-[20px] overflow-hidden"
                          } `}
                        >
                          {key === "select" ? (
                            <input type="checkbox" name="select" id="select" />
                          ) : key === "action" ? (
                            <a href={data[key]} download>
                              <i className="fa-solid fa-download"></i>
                            </a>
                          ) : key === "size" && data[key] === 0 ? null : (
                            data[key]
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </StickyScrollbarWrapper>
      </div>
    </div>
  );
};

export default DynamicTable;
