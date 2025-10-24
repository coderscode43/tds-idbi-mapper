import {
  addFileInFolder,
  addFolder,
  createFolder,
  fileList,
  paginationListData,
  paginationWithSearchListData,
} from "@/service/apiService";

const common = {
  handleSearchInputChange: (e, setSearchParams) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  },

  getRefinedSearchParams: (searchParams) => {
    const refinedSearchParams = (obj) =>
      Object.fromEntries(
        Object.entries(obj)
          .map(([key, value]) => {
            // Trim whitespace if value is a string
            if (typeof value === "string") {
              value = value.trim();
            }
            return [key, value];
          })
          .filter(
            (entry) =>
              entry[1] !== "" && entry[1] !== null && entry[1] !== undefined
          )
          .map(([key, value]) => {
            // If value matches YYYY-MM-DD format, convert to ISO string
            if (
              typeof value === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(value)
            ) {
              return [key, new Date(value).toISOString()];
            }
            return [key, value];
          })
      );

    return JSON.stringify(refinedSearchParams(searchParams));
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

  getAddFolder: async (params, fileListData, selectedFolder) => {
    const parsedParams = params ? JSON.parse(params) : {};
    const formData = {
      ...parsedParams,
      OverideFile: "",
    };

    const lastLocation = fileListData[0]?.lastLocation || "/";
    const fileBlob = [...selectedFolder];

    const formDataObj = new FormData();
    formDataObj.append("formData", JSON.stringify(formData));
    formDataObj.append("blob", fileBlob);
    formDataObj.append("lastLocation", lastLocation);

    Array.from(selectedFolder).forEach((file) => {
      if (!file) throw new Error("File is undefined");
      formDataObj.append("blob", file);
      formDataObj.append("filePath", file.webkitRelativePath);
    });

    return await addFolder(formDataObj);
  },

  getAddFileInFolder: async (params, fileListData, selectedDocument) => {
    const parsedParams = params ? JSON.parse(params) : {};
    const formData = {
      ...parsedParams,
      OverideFile: "",
    };

    const lastLocation = fileListData[0]?.lastLocation || "/";
    const fileBlob = [...selectedDocument];

    const formDataObj = new FormData();
    formDataObj.append("formData", JSON.stringify(formData));
    formDataObj.append("lastLocation", lastLocation);

    Array.from(fileBlob).forEach((file) => {
      if (!file) throw new Error("File is undefined");
      formDataObj.append("blob", file);
    });

    return await addFileInFolder(formDataObj);
  },

  getCreateFolder: async (params, fileListData, folderName) => {
    const parsedParams = params ? JSON.parse(params) : {};
    const formData = {
      ...parsedParams,
      OverideFile: "",
    };

    const lastLocation = fileListData[0]?.lastLocation || "/";

    const formDataObj = new FormData();
    formDataObj.append("formData", formData);
    formDataObj.append("lastLocation", lastLocation);
    formDataObj.append("name", folderName);

    return await createFolder(formDataObj);
  },

  getPagination: async (entity, pageNo) => {
    return await paginationListData(entity, pageNo - 1);
  },

  getPaginationWithSearch: async (entity, pageNo, searchParams) => {
    return await paginationWithSearchListData(entity, pageNo - 1, searchParams);
  },
};

export default common;
