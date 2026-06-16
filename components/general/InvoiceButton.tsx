import { useDownloadInvoicePDF } from '@/hooks/useDownloadInvoicePDF';
import { Button } from './Button';
import { Order } from '@/types/order';

const InvoiceButton = ({ order }: { order: Order }) => {
  const { downloadInvoicePDF, isGeneratingPDF } = useDownloadInvoicePDF();

  return (
    <Button
      disabled={isGeneratingPDF}
      onClick={() => downloadInvoicePDF(order)}
      text={isGeneratingPDF ? 'Generating...' : 'Download Invoice'}
    />
  );
};

export { InvoiceButton };
