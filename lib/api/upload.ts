import axios from 'axios';
import { baseURL } from '../axiosinstance';

export const uploadImages = async (images: File[]) => {
    const formData = new FormData();
    images.forEach(file => formData.append('files', file));

    const { data } = await axios.post(`${baseURL}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data.paths;
};