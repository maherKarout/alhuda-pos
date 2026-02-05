export const downloadUrlFile = ({
  fileName,
  url,
}: {
  fileName: string;
  url: string;
}) => {
  // Create a temporary link element and trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName; // You can name the download as you like
  document.body.appendChild(link); // Append to the document
  link.click();

  // Clean up by revoking the Object URL and removing the link element
  document.body.removeChild(link);
};
