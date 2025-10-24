import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? "/";
axios.defaults.withCredentials = true;

// Pagination Functionality
export const paginationListData = async () =>
  // entity, pageNo
  {
    // try {
    //   const response = await axios.get(
    //     `${API_BASE_URL}${entity}/list/get/${pageNo}/100`
    //   );
    return [];
    // } catch (error) {
    //   console.error("Error in fetching entities:", error);
    // }
  };

export const paginationWithSearchListData = async (
  entity,
  pageNo,
  resultPerPage,
  refinedSearchParams
) => {
  const response = await axios.get(
    `api${entity}/list/processCount/${pageNo}/${resultPerPage}`,
    {
      params: {
        processData: refinedSearchParams,
      },
    }
  );
  return response;
};

export const fileList = async (entity, formData) => {
  const response = await axios.get(`api${entity}/getFileList`, {
    params: {
      formData: formData,
    },
  });
  return response;
};

export const addFolder = async (formDataObj) => {
  const response = await axios.post(
    `apiWorkingFile/importFolderToPath`,
    formDataObj,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const addFileInFolder = async (formDataObj) => {
  const response = await axios.post(
    `apiWorkingFile/addFileInFolder`,
    formDataObj,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const createFolder = async (formDataObj) => {
  const response = await axios.get(`apiWorkingFile/createFolder`, formDataObj);
  return response;
};
