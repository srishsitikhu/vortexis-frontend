export type Review = {
    id: number
    userId: number
    user: {
        id: number
        name: string
    }
    productId: number
    rating: number
    comment: string
    createdAt: string
}