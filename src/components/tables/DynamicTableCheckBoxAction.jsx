import common from "@/common/common";
import StickyScrollbarWrapper from "../component/StickyScrollbarWrapper";
import TableLoadingSkeleton from "../component/TableLoadingSkeleton";

const DynamicTableCheckBoxAction = ({
  tableHead,
  tableData,
  setFileListData,
  handleDownload,
  selectedRows,
  setSelectedRows,
  setSelectedRowsData,
  loading = false,
  setLastLocation,
}) => {
  const [lastLocation] = tableData;

  // Skeleton loader rows count (adjust as needed)
  const skeletonRows = 5;

  const isAllSelected =
    tableData.length > 0 && selectedRows.length === tableData.length;

  // Toggle all rows
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(tableData.map((_, index) => index));
      setSelectedRowsData(
        tableData.map((row) => ({
          ...row,
          selected: true,
        }))
      );
    } else {
      setSelectedRows([]); // to clear the checkbox selection
      setSelectedRowsData([]); // to clear the checkbox selection
    }
  };

  // Toggle individual row
  const handleSelectRow = (index, data) => {
    const rowKey = data.name + data.lastLocation; // Unique key for each row

    setSelectedRows((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );

    setSelectedRowsData((prevData) => {
      const isAlreadySelected = prevData.some(
        (row) => row.name + row.lastLocation === rowKey
      );

      if (isAlreadySelected) {
        return prevData.filter((row) => row.name + row.lastLocation !== rowKey);
      } else {
        return [...prevData, data];
      }
    });
  };

  // Inject a checkbox into table head
  const enhancedTableHead = [
    {
      label: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={isAllSelected}
        />
      ),
      key: "__checkbox__",
    },
    ...tableHead,
  ];

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
                  {enhancedTableHead.map(({ label }, index) => (
                    <th
                      key={index}
                      className={`z-0 border-r-[1.5px] border-l-[1.5px] bg-[var(--secondary-color)] p-2 whitespace-nowrap text-white ${
                        index === enhancedTableHead.length - 1
                          ? "border-[var(--secondary-color)]"
                          : "border-gray-300"
                      }${
                        index === tableHead.length - 1
                          ? "border-l-[var(--secondary-color)]" // left border on first th
                          : "border-l-gray-300"
                      }${
                        index === tableHead.length - 1
                          ? "border-r-[var(--secondary-color)]" // right border on last th
                          : "border-r-gray-300"
                      }`}
                    >
                      <div className="block min-w-[70px] resize-x overflow-auto">
                        {label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <TableLoadingSkeleton
                    columns={tableHead.length}
                    rows={skeletonRows}
                  />
                ) : !lastLocation ||
                  (Object.keys(lastLocation).length === 1 &&
                    Object.keys(lastLocation)[0] === "lastLocation") ? (
                  <tr>
                    <td
                      colSpan={enhancedTableHead.length}
                      className="p-4 text-center text-[16px] font-semibold text-red-500"
                    >
                      No Files Added
                    </td>
                  </tr>
                ) : (
                  tableData?.map((data, index) => {
                    const isChecked = selectedRows.includes(index);
                    return (
                      <tr
                        key={index}
                        className={`cursor-pointer bg-white text-center hover:bg-gray-100 ${isChecked ? "bg-blue-100" : ""}`}
                        onDoubleClick={async () => {
                          const response = await common.getGotoFolder(data);
                          setFileListData(response?.data?.entities || []);
                          setLastLocation(
                            response?.data?.entities[0]?.lastLocation
                          );
                          setSelectedRows([]); // to clear the checkbox selection
                          setSelectedRowsData([]); // to clear the checkbox selection
                        }}
                      >
                        {/* Checkbox cell */}
                        <td className="border-[1.5px] border-gray-300 p-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRow(index, data)}
                          />
                        </td>

                        {tableHead?.map(({ key, formatter }, colIndex) => (
                          <td
                            key={colIndex}
                            className="w-auto border-[1.5px] border-gray-300 p-2 text-ellipsis whitespace-nowrap"
                          >
                            {key === "action" &&
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
