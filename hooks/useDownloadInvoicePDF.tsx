// lib/useDownloadInvoicePDF.ts
import { showNotification } from "@/redux/NotificationSlice";
import { Order } from "@/types/order";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import { useDispatch } from "react-redux";

type pdfType = {
  lastAutoTable: {
    finalY: number;
  };
};

export const useDownloadInvoicePDF = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const dispatch = useDispatch();
  const formatDate = (date: Date | null | undefined) =>
    date
      ? new Date(date).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const downloadInvoicePDF = async (order: Order) => {
    if (!order) return;

    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");

      // Title
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Invoice #${order.id}`, 20, 20);

      let y = 30;

      // Order Items Table
      pdf.setFontSize(14).text("Order Items", 20, y);
      y += 6;

      autoTable(pdf, {
        startY: y,
        head: [["#", "Product", "Qty", "Price", "Total"]],
        body: order.orderItems.map((item, index) => [
          `${index + 1}`,
          item.product?.name ?? "Demo Product",
          item.quantity,
          `Nrs. ${item.price}`,
          `Nrs. ${(item.price * item.quantity).toFixed(2)}`,
        ]),
        styles: { font: "helvetica", fontSize: 10 },
        headStyles: { fillColor: [50, 50, 50], textColor: 255 },
        theme: "grid",
      });

      y = (pdf as unknown as pdfType).lastAutoTable.finalY + 10;

      // Totals
      pdf.setFontSize(10).setFont("helvetica", "normal");
      pdf.text(`Subtotal: Nrs. ${order.totalAmount.toFixed(2)}`, 20, y);
      y += 6;
      pdf.text(`Shipping: Nrs. 0`, 20, y);
      y += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text(`Total: Nrs. ${order.totalAmount.toFixed(2)}`, 20, y);
      y += 10;

      // Customer Details
      pdf.setFontSize(14).text("Customer Details", 20, y);
      y += 8;
      pdf.setFontSize(10).setFont("helvetica", "normal");
      pdf.text(`Name: ${order?.user.name}`, 20, y);
      y += 6;
      pdf.text(`Email: ${order?.user.email ?? "N/A"}`, 20, y);
      y += 6;
      pdf.text(`Phone: ${order?.user.phoneNumber ?? "N/A"}`, 20, y);
      y += 10;

      // Payment Details
      pdf.setFontSize(14).setFont("helvetica", "bold");
      pdf.text("Payment Details", 20, y);
      y += 8;
      pdf.setFontSize(10).setFont("helvetica", "normal");
      pdf.text(`Status: ${order.payment.paymentStatus}`, 20, y);
      y += 6;
      pdf.text(`Method: ${order.payment.paymentMethod}`, 20, y);
      y += 6;
      pdf.text(`Paid At: ${formatDate(order.payment.paidAt)}`, 20, y);

      // Save file
      pdf.save(`invoice-order-${order.id}.pdf`);
    } catch (err) {
      dispatch(
        showNotification({
          message: `Failed to generate PDF. ${err}`,
          type: "error",
        }),
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return { downloadInvoicePDF, isGeneratingPDF };
};
