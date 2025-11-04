import { parsedParams, refinedSearchParams } from "@/lib/utils";
import {
  addFileInFolder,
  addFolder,
  createDayFolder,
  createFolder,
  downloadFile,
  fileDeleted,
  fileList,
  generateZip,
  gotoFolder,
  gotoLastLocation,
  importFile,
  paginationListData,
  paginationWithSearchListData,
  processCancelled,
  searchOpenFolder,
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

  getFileList: async (formData) => {
    const refinedFormData = refinedSearchParams(formData);
    return await fileList(refinedFormData);
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

  getStartProcess: async (entity, params, processName) => {
    const data = parsedParams(params);
    const formData = {
      ...data,
      processName: processName,
    };
    return await startProcess(entity, formData);
  },

  getPagination: async (entity, pageNo) => {
    return await paginationListData(entity, pageNo - 1);
  },

  getPaginationWithSearch: async (entity, pageNo, searchParams) => {
    return await paginationWithSearchListData(entity, pageNo - 1, searchParams);
  },

  getDownloadFile: async (data) => {
    // Construct the file path with proper slashes
    const lastLocation = `${data.lastLocation}/${data.name}`;
    // Replace / with ^ (or any placeholder) since backend replaces ^ back to /
    const filePath = encodeURIComponent(lastLocation).replace(/%2F/g, "^");
    return await downloadFile(filePath);
  },

  getFileDeleted: async (selectedRowsData, lastLocation) => {
    // Construct the file path with proper slashes
    const formData = {
      entity: {
        deleteFileOrFolder: selectedRowsData,
      },
      lastLocation: lastLocation,
    };

    const formDataObj = JSON.stringify(formData);
    return await fileDeleted(formDataObj);
  },

  getProcessCancel: async (processId) => {
    return await processCancelled(processId);
  },

  getGenerateZip: async (selectedRowsData) => {
    const lastLocation = `${selectedRowsData[0]?.lastLocation}`;
    const formData = {
      entity: {
        downloadFileOrFolder: selectedRowsData[0],
      },
      lastLocation: lastLocation,
    };
    const formDataObj = JSON.stringify(formData);
    return await generateZip(formDataObj);
  },

  getCreateDayFolder: async (formData) => {
    return await createDayFolder(formData);
  },

  getImportFile: async (selectedDocument, subpanel, parameters) => {
    const param = parsedParams(parameters);
    if (!selectedDocument) {
      throw new Error("Please select a document before importing.");
    }
    return await importFile(selectedDocument, subpanel, param);
  },

  getSearchOpenFolder: async (lastLocation, fileListData) => {
    const lastIndexFile = fileListData[fileListData.length - 1];
    return await searchOpenFolder(lastLocation, lastIndexFile);
  },
};

export default common;
