import { authAxios } from "src/config/axios";
import { baseUrl } from "src/env/base-url";
import { endPoints } from "src/shared/end-points";
import { dataURLtoFile } from "./data-uRLto-file";
export const uploadKeys = {
  operator: "operator",
};
export const uploadFileToServer = async (image: any, key: string) => {
  let imageFile;
  if (!image) return undefined;
  else if (typeof image === "string") {
    if (isBase64BinaryString(image)) {
      imageFile = dataURLtoFile(image);
    } else return undefined;
  } else imageFile = image;
  const dataToSend = new FormData();

  dataToSend.append("file", imageFile);
  const data = await authAxios.post(
    `${baseUrl}${endPoints.uploadFileEndPoint().pathname}/${key}`,
    dataToSend
  );
  return data?.data?.id ?? "failed";
};
function isBase64BinaryString(inputString: string) {
  // Regular expression to match base64 encoding
  const base64Pattern = /^data:[\w\/\+\-]+;base64,([A-Za-z0-9+/]+={0,2})$/;

  // Check if the input string matches the base64 pattern
  return base64Pattern.test(inputString);
}
