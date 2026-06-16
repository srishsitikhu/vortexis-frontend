export type KhaltiPaymentPayload = {
  return_url: string;
  website_url: string;
  amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
  amount_breakdown: {
    label: string;
    amount: number;
  }[];
  product_details: {
    identity: string;
    name: string;
    total_price: number;
    quantity: number;
    unit_price: number;
  }[];
  merchant_username: string;
  merchant_extra: string;
};
