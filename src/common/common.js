import {
  addFileInFolder,
  addFolder,
  createFolder,
  downloadFile,
  fileDeleted,
  fileList,
  gotoFolder,
  gotoLastLocation,
  paginationListData,
  paginationWithSearchListData,
  processCancelled,
  startProcess,
} from "@/service/apiService";

const common = {
  handleSearchInputChange: (e, setSearchParams) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  },

  getSearchListData: async (entity, pageNo, resultPerPage, searchParams) => {
    return await paginationWithSearchListData(
      entity,
      pageNo,
      resultPerPage,
      searchParams
    );
  },

  getFileList: async (entity, formData) => {
    return await fileList(entity, formData);
  },

  getAddFolder: async (formDataObj) => {
    return await addFolder(formDataObj);
  },

  getAddFileInFolder: async (formDataObj) => {
    return await addFileInFolder(formDataObj);
  },

  getCreateFolder: async (params, fileListData, folderName) => {
    const parsedParams = params ? JSON.parse(params) : {};
    const formData = {
      ...parsedParams,
      OverideFile: "",
    };

    const lastLocation = fileListData[0]?.lastLocation || "/";

    return await createFolder(formData, lastLocation, folderName);
  },

  getGotoFolder: async (fileData) => {
    const lastLocation = fileData?.lastLocation;

    return await gotoFolder(lastLocation, fileData);
  },

  getGotoLastLocation: async (lastLocation, lastPart) => {
    return await gotoLastLocation(lastLocation, lastPart);
  },

  getStartProcess: async (entity, formData) => {
    return await startProcess(entity, formData);
  },

  getPagination: async (entity, pageNo) => {
    return await paginationListData(entity, pageNo - 1);
  },

  getPaginationWithSearch: async (entity, pageNo, searchParams) => {
    return await paginationWithSearchListData(entity, pageNo - 1, searchParams);
  },

  getDownloadFile: async (filePath) => {
    return await downloadFile(filePath);
  },

  getFileDeleted: async (formDataObj) => {
    return await fileDeleted(formDataObj);
  },
  getProcessCancel: async (processId) => {
    return await processCancelled(processId);
  },
};

export default common;
