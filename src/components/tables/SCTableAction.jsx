import StickyScrollbarWrapper from "../component/StickyScrollbarWrapper";

const SCTableAction = ({ tableHead, tableData, onKillClick }) => {
  return (
    <div className="relative">
      <div
        className="w-full overflow-clip rounded-[10px] border border-gray-300"
        style={{ boxShadow: "rgb(136, 136, 136) 0px 5px 12px" }}
      >
        <StickyScrollbarWrapper>
          <table className="w-full border-separate border-spacing-0 text-[14px]">
            <thead className="stick sticky top-0 z-1 bg-[#017c39] whitespace-nowrap text-white">
              <tr>
                {tableHead.map(({ label }, index) => (
                  <th key={index} className="border border-[#dddddd] p-2">
                    <div className="block min-w-[100px] resize-x overflow-auto">
                      {label}
                    </div>
                  </th>
                ))}
                <th className="border border-[#dddddd] p-2">
                  <div className="block min-w-[100px] resize-x overflow-auto">
                    Action
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableHead.length + 1}
                    className="p-4 text-center text-[16px] font-semibold text-red-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                tableData.map((data, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer text-center hover:bg-gray-100"
                  >
                    {tableHead.map(({ key }, colIndex) => (
                      <td
                        key={colIndex}
                        className="max-w-[200px] min-w-[100px] overflow-hidden border border-[#dddddd] p-2 text-ellipsis whitespace-nowrap"
                        title={data[key] ?? "-"}
                      >
                        {/* {key === "pan"
                          ? maskPAN(data[key], encryptPan)
                          : (data[key] ?? "-")} */}
                      </td>
                    ))}
                    {/* <td className="max-w-[200px] min-w-[100px] overflow-hidden border border-[#dddddd] p-2 text-ellipsis whitespace-nowrap">
                      <i
                        className="fa fa-close"
                        onClick={() => onKillClick(data)}
                      ></i>
                    </td> */}
                    <td
                      className="border border-[#dddddd] p-2 text-center"
                      title="Kill request"
                    >
                      {(data.status === "Pending" ||
                        data.status === "Queued") && (
                        <button
                          onClick={() => onKillClick(data)}
                          className="text-[#942323]"
                          aria-label="Kill request"
                        >
                          <i
                            className="fa fa-close text-[18px] font-extrabold"
                            aria-hidden="true"
                            // onclick={() => onClick(data)}
                          ></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </StickyScrollbarWrapper>
      </div>
    </div>
  );
};

export default SCTableAction;
