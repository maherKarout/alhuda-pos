export const printPdfBlob = async (pdfBlob: any) => {
  if (!pdfBlob) {
    console.error('PDF Blob data is missing.')
    return
  }

  // 1. Create a temporary URL for the Blob
  const url = URL.createObjectURL(pdfBlob)

  // 2. Open the PDF in a new window/tab
  const printWindow = window.open(url, '_blank')

  if (printWindow) {
    // 3. Wait for the content to load, then trigger the print dialog
    printWindow.onload = () => {
      // Use a slight timeout for robust printing, ensuring the PDF viewer is ready
      setTimeout(() => {
        printWindow.print()

        // Clean up the temporary URL to free memory immediately
        URL.revokeObjectURL(url)

        // Note: Do NOT close the printWindow here, as it will interrupt the print dialog
      }, 500)
    }
  } else {
    // This happens if the user has pop-up blockers enabled
    alert('Pop-up blocker prevented the print dialog. Please allow pop-ups.')
  }
}
