import common from "@/common/common";
import StickyScrollbarWrapper from "../component/StickyScrollbarWrapper";

const DynamicTableCheckBoxAction = ({
  tableHead,
  tableData,
  setFileListData,
  handleDownload,
  selectedRows,
  onRowSelect,
}) => {
  const [lastLocation] = tableData;

  return (
    <div className="relative w-full">
      <div className="w-full overflow-clip rounded-md border border-gray-200">
        <StickyScrollbarWrapper>
          <div className="custom-scrollbar max-h-[200px] overflow-y-auto">
            <table className="w-full text-[14px]">
              <thead
                className="bg-[var(--secondary-color)]"
                style={{ zIndex: "9", position: "sticky", top: "0px" }}
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
                        // go inside the specific folder
                        onDoubleClick={async () => {
                          const response = await common.getGotoFolder(data);
                          setFileListData(response?.data?.entities || []);
                        }}
                      >
                        {tableHead?.map(({ key, formatter }, colIndex) => (
                          <td
                            key={colIndex}
                            className="w-auto border-[1.5px] border-gray-300 p-2 text-ellipsis whitespace-nowrap"
                          >
                            {/* checkbox select logic */}
                            {key === "select" ? (
                              <input
                                type="checkbox"
                                name="select"
                                id="select"
                                checked={selectedRows.includes(data)}
                                onChange={() => onRowSelect(data)}
                              />
                            ) : key === "action" &&
                              data.fileType !== "File folder" ? (
                              // download button Icon shown if the the filetype if filefolder
                              <i
                                className="fa-solid fa-download cursor-pointer text-lg"
                                onClick={() => handleDownload(data)}
                              ></i>
                            ) : formatter ? (
                              formatter(data[key])
                            ) : (
                              (data[key] ?? " ")
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </StickyScrollbarWrapper>
      </div>
    </div>
  );
};

export default DynamicTableCheckBoxAction;
