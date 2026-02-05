export function dataURLtoFile(dataURL: string) {
  // Extract the MIME type from the data URL
  const mimeTypeMatch = dataURL.match(/^data:(.*?);base64,/);
  const mimeType =
    (mimeTypeMatch && mimeTypeMatch[1]) || "application/octet-stream";

  // Decode the base64 data
  const base64 = dataURL.split(",")[1];
  const binaryString = atob(base64);

  // Create a Uint8Array from the binary data
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the Uint8Array
  const blob = new Blob([byteArray], { type: mimeType });

  // Create a File with a temporary name
  const temporaryFilename = "image" + Date.now();
  return new File(
    [blob],
    temporaryFilename + `.${(mimeType as string).split("/")[1]}`,
    { type: mimeType }
  );
}
