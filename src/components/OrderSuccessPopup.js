import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import styled from 'styled-components';

// Initialize jsPDF with autoTable
const doc = new jsPDF();

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 500px;
  width: 90%;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: #4caf50;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 40px;
`;

const Button = styled.button`
  background-color: #B8A082;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #8B7355;
  }
`;

const OrderSuccessPopup = ({ order, onClose }) => {
  const generateReceipt = () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();
    
    // Add logo or title
    pdf.setFontSize(20);
    pdf.text('Order Receipt', 105, 20, { align: 'center' });
    
    // Order details
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order?.orderId || 'N/A'}`, 14, 40);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 14, 50);
    pdf.text(`Status: ${order?.status || 'Completed'}`, 14, 60);
    
    // Table header
    const headers = [['Product', 'Quantity', 'Price (LKR)']];
    
    // Table rows
    const data = order?.items?.map(item => [
      item.name,
      item.quantity,
      item.price.toFixed(2)
    ]) || [];
    
    // Add table using the imported autoTable function
    autoTable(pdf, {
      head: headers,
      body: data,
      startY: 80,
      styles: { 
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle',
        halign: 'center',
      },
      headStyles: {
        fillColor: [184, 160, 130], // Match site theme
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 80 }
    });
    
    // Get the final Y position after the table
    const finalY = pdf.lastAutoTable.finalY || 100; // Fallback to 100 if not available
    
    // Add totals
    pdf.setFontSize(12);
    pdf.text(`Subtotal: LKR ${order?.subtotal?.toFixed(2) || '0.00'}`, 14, finalY + 10);
    pdf.text(`Shipping: LKR ${order?.shipping?.toFixed(2) || '0.00'}`, 14, finalY + 20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total: LKR ${order?.total?.toFixed(2) || '0.00'}`, 14, finalY + 35);
    
    // Save the PDF
    pdf.save(`Order_Receipt_${order?.orderId || 'N/A'}.pdf`);
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <SuccessIcon>✓</SuccessIcon>
        <h2>Order Placed Successfully!</h2>
        <p>Your order has been placed successfully. You can download your receipt below.</p>
        <p>Order ID: {order?.orderId || 'N/A'}</p>
        
        <div>
          <Button onClick={generateReceipt}>
            Download Order Receipt
          </Button>
          <Button onClick={onClose} style={{ backgroundColor: '#6c757d' }}>
            Continue Shopping
          </Button>
        </div>
      </PopupContent>
    </PopupOverlay>
  );
};

export default OrderSuccessPopup;
