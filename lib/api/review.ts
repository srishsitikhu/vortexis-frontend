import { ReviewCreate, ReviewUpdate } from "@/schema/review.schema"
import { axiosInstance } from "../axiosinstance"

export const fetchReviewsByProduct = async (id: number) => {
    const { data } = await axiosInstance.get(`/reviews/product/${id}`)
    return data.data
}

export const addReview = async (dataToSend: ReviewCreate) => {
    const { data } = await axiosInstance.post(`/reviews`, dataToSend)
    return data.data
}

export const updateReview = async ({ id, dataToSend }: { id: number, dataToSend: ReviewUpdate }) => {
    const { data } = await axiosInstance.patch(`/reviews/${id}`, dataToSend)
    return data.data
}

export const deleteReview = async (id: number) => {
    const { data } = await axiosInstance.delete(`/reviews/product/${id}`)
    return data.data
}