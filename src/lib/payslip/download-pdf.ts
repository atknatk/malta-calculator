/**
 * Bordro belgesini ([data-payslip-document]) A4 PDF olarak indirir (istemci).
 * Hata olursa tarayıcının yazdırma penceresine düşer.
 */
export function buildPayslipFilename(
  payslipNumber?: string,
  employeeName?: string,
  /** Dosya adı öneki, ör. "DRAFT" ya da "VOID" */
  prefix?: string,
): string {
  if (!payslipNumber) return "Payslip.pdf";
  const name = employeeName ? `-${employeeName.replace(/\s+/g, "_")}` : "";
  return `${prefix ? `${prefix}-` : ""}Payslip-${payslipNumber}${name}.pdf`;
}

export async function downloadPayslipPdf(filename: string): Promise<void> {
  try {
    // Dynamic import for html2pdf (client-side only)
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.querySelector(
      "[data-payslip-document]",
    ) as HTMLElement | null;
    if (!element) {
      window.print();
      return;
    }

    // No margins since document has internal padding
    const opt = {
      margin: 0,
      filename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        // A4 width at 96 DPI = 794px, ensures consistent rendering
        windowWidth: 794,
        windowHeight: 1123,
      },
      jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
      },
    };

    // Belge A4 yüksekliğinde; yuvarlama farkı html2pdf'in boş ikinci sayfa
    // açmasına yol açıyordu. Bordro her zaman tek sayfa: taşma sayfaları
    // silinir ve görüntü sayfaya sığacak şekilde yeniden çizilir.
    const worker = html2pdf().set(opt).from(element).toPdf();
    const pdf = await worker.get("pdf");
    const canvas = (await worker.get("canvas")) as HTMLCanvasElement;

    while (pdf.getNumberOfPages() > 1) {
      pdf.deletePage(pdf.getNumberOfPages());
    }
    pdf.setPage(1);
    const pageWidth: number = pdf.internal.pageSize.getWidth();
    const pageHeight: number = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height,
    );
    const width = canvas.width * ratio;
    const height = canvas.height * ratio;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.98),
      "JPEG",
      (pageWidth - width) / 2,
      0,
      width,
      height,
    );
    pdf.save(filename);
  } catch (error) {
    console.error("PDF generation failed:", error);
    window.print();
  }
}

/**
 * Yayınlanmış bordronun R2'deki PDF'ini indirir. Sunucu PDF'i veremezse
 * (henüz üretilemedi vb.) belge tarayıcıda çizilir.
 */
export async function downloadStoredPayslipPdf(
  pdfUrl: string,
  fallbackFilename: string,
): Promise<void> {
  try {
    const separator = pdfUrl.includes("?") ? "&" : "?";
    const response = await fetch(`${pdfUrl}${separator}json=1`);
    if (response.ok) {
      const { url } = (await response.json()) as { url?: string };
      if (url) {
        window.location.href = url;
        return;
      }
    }
  } catch (error) {
    console.error("Stored PDF download failed:", error);
  }
  await downloadPayslipPdf(fallbackFilename);
}
