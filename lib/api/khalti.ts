import { KhaltiPaymentPayload } from '@/types/khalti';
import { axiosInstance } from '../axiosinstance';

export const initiateKhalti = async (dataToSend: KhaltiPaymentPayload) => {
  const { data } = await axiosInstance.post('/khalti/initiate', dataToSend);
  return data.data;
};
