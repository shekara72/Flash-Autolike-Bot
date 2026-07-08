import { jsPDF } from "jspdf";

export function downloadInvoicePDF(order: any, plan: any, profile: any, gstNumber?: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const bgDark = [11, 11, 15];        // #0B0B0F Matte deep charcoal background
  const containerDark = [22, 22, 31]; // #16161F Card Slate container background
  const accentPink = [255, 46, 147];   // #FF2E93 Solid Pink
  const textWhite = [255, 255, 255];
  const textMuted = [160, 160, 171];   // Muted gray for labels

  // 1. Draw solid dark background for the entire page
  doc.setFillColor(bgDark[0], bgDark[1], bgDark[2]);
  doc.rect(0, 0, 210, 297, "F");

  // 2. Header & Brand Title
  doc.setFillColor(accentPink[0], accentPink[1], accentPink[2]);
  doc.rect(0, 0, 210, 15, "F");

  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FLASH AUTOLIKE BOT - INVOICE RECEIPT", 20, 10);

  // 3. Invoice Meta Info Box (Slate Panel)
  doc.setFillColor(containerDark[0], containerDark[1], containerDark[2]);
  doc.rect(20, 25, 170, 32, "F");
  doc.setDrawColor(255, 255, 255, 0.06);
  doc.rect(20, 25, 170, 32, "S");

  doc.setTextColor(accentPink[0], accentPink[1], accentPink[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE DETAILS", 25, 33);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Receipt ID: INV-${order.id.slice(0, 8).toUpperCase()}`, 25, 41);
  doc.text(`Transaction Hash: ${order.razorpay_payment_id || order.utr_number || "Manual_UPI"}`, 25, 46);
  doc.text(`Payment Status: Verified & Completed`, 25, 51);

  // Date on the right
  doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 115, 41);
  doc.text(`Method: ${order.payment_method.toUpperCase()}`, 115, 46);

  // 4. Billed To Panel (Slate Panel)
  doc.setFillColor(containerDark[0], containerDark[1], containerDark[2]);
  doc.rect(20, 62, 170, 28, "F");
  doc.rect(20, 62, 170, 28, "S");

  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILLED TO:", 25, 69);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`User Free Fire UID: ${profile.uid}`, 25, 76);
  doc.text(`Nickname: ${profile.nickname || "N/A"}`, 25, 81);
  doc.text(`Account Region: ${profile.region || "India"}`, 25, 86);

  if (gstNumber) {
    doc.text(`GSTIN: ${gstNumber.toUpperCase()}`, 115, 76);
  }

  // 5. Product / Plan Table
  doc.setFillColor(containerDark[0], containerDark[1], containerDark[2]);
  doc.rect(20, 96, 170, 8, "F");
  doc.rect(20, 96, 170, 8, "S");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text("Plan Description", 25, 101.5);
  doc.text("Active Duration", 100, 101.5);
  doc.text("Qty", 140, 101.5);
  doc.text("Amount", 170, 101.5);

  // Row Details
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`${plan.name} - Autolike Bot Delivery Campaign`, 25, 112);
  doc.text(`${plan.duration_days} Days`, 100, 112);
  doc.text("1", 140, 112);
  doc.text(`INR ${order.amount}`, 170, 112);

  // Divider
  doc.setDrawColor(255, 255, 255, 0.08);
  doc.line(20, 118, 190, 118);

  // 6. Pricing Summary calculations
  const amount = Number(order.amount);
  let subtotal = amount;
  let tax = 0;

  if (gstNumber) {
    subtotal = Math.round((amount / 1.18) * 100) / 100;
    tax = Math.round((amount - subtotal) * 100) / 100;
  }

  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  
  if (gstNumber) {
    doc.text("Subtotal:", 130, 126);
    doc.text(`INR ${subtotal.toFixed(2)}`, 170, 126);

    doc.text("GST (18%):", 130, 132);
    doc.text(`INR ${tax.toFixed(2)}`, 170, 132);
  }

  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentPink[0], accentPink[1], accentPink[2]);
  doc.text("Total Paid:", 130, 138);
  doc.text(`INR ${amount.toFixed(2)}`, 170, 138);

  // 7. Footer Notes (Dark Box)
  doc.setFillColor(containerDark[0], containerDark[1], containerDark[2]);
  doc.rect(20, 155, 170, 24, "F");
  doc.rect(20, 155, 170, 24, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("System Terms & Conditions:", 25, 161);
  doc.text("This invoice receipt is programmatically compiled upon verified payments. Order activation begins", 25, 166);
  doc.text("instantly after admin or gateway validation. For delivery inquiries, contact @FL4SH_AUTOLIKE_BOT.", 25, 171);

  // Save the PDF
  doc.save(`invoice-${order.id.slice(0, 8).toUpperCase()}.pdf`);
}
