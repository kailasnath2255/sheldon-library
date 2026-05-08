import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportElementToPdf = async (
  element: HTMLElement,
  filename: string
) => {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 40;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 20;

  pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 40;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 20;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 40;
  }

  pdf.save(filename);
};

export const triggerHtmlDownload = (html: string, filename: string) => {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const triggerBase64Download = (
  base64: string,
  filename: string,
  mimeType: string
) => {
  const a = document.createElement("a");
  a.href = `data:${mimeType};base64,${base64}`;
  a.download = filename;
  a.click();
};
