import StickyScrollbarWrapper from "../component/StickyScrollbarWrapper";
import TableLoadingSkeleton from "../component/TableLoadingSkeleton";

const DynamicTable = ({ tableHead, tableData }) => {
  // Skeleton loader rows count (adjust as needed)


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
                {tableHead.map(({ label }, index) => (
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
              {tableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableHead.length}
                    className="p-4 text-center text-[16px] font-semibold text-red-500"
                  >
                    No Data Found
                  </td>
                </tr>
              ) : (
                tableData.map((data, index) => {
                  return (
                    <tr key={index} className={`cursor-pointer text-center`}>
                      {tableHead.map(({ key, formatter }, colIndex) => (
                        <td
                          key={colIndex}
                          className={`w-auto border-[1.5px] border-gray-300 p-2 text-ellipsis whitespace-nowrap`}
                        >
                          {key === "CHALLAN_MISMATCH"
                            ? data[key] === "1"
                              ? "True"
                              : data[key] === "0"
                                ? "False"
                                : " -- "
                            : formatter
                              ? formatter(data[key])
                              : (data[key] ?? " ")}
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
