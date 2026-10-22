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
      pagebreak: { mode: "avoid-all" as const },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("PDF generation failed:", error);
    window.print();
  }
}
