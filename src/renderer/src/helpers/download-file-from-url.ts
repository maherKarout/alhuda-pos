import { downloadUrlFile } from "./download-url-file";

export const downloadFile = async ({ imageUrl }: { imageUrl: string }) => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Network response was not ok.");

    // Convert the image to a blob
    const imageBlob = await response.blob();

    // Create a URL for the blob
    const imageURL = URL.createObjectURL(imageBlob);
    downloadUrlFile({ fileName: "id-image", url: imageURL });
    URL.revokeObjectURL(imageURL);
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
};
