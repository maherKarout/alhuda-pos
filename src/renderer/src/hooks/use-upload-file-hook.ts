import { useState, ChangeEvent } from "react";
import axios, { AxiosProgressEvent, AxiosResponse } from "axios";
import { authAxios } from "src/config/axios";
import { endPoints } from "src/shared/end-points";
import { baseUrl } from "src/env/base-url";
interface UploadResponse {
  // Define the structure of the response object according to your API response
  id: string;
  fileUrl: string;
}
export enum excelFileKeys {
  medicine = "medicine",
  pharmacy = "pharmacy",
  lines = "line",
}

const useFileUpload = (key: excelFileKeys) => {
  const [progress, setProgress] = useState<number>(0);
  const [response, setResponse] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File) => {
    setProgress(0);
    setResponse(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const uploadPercentage = Math.round(
            (progressEvent.loaded * 100) / (progressEvent?.total ?? 1)
          );
          setProgress(uploadPercentage);
        },
      };

      const res: AxiosResponse<UploadResponse> =
        await authAxios.post<UploadResponse>(
          baseUrl + endPoints.uploadFileEndPoint().pathname + "/" + key,
          formData,
          config
        );
      return res.data;
    } catch (err: any) {
      return err;
    }
  };

  return { progress, uploadFile, setProgress };
};

export default useFileUpload;
