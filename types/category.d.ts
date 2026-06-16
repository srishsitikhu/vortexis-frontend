export type Category = {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    products: {
        id: number;
        name: string;
    }[];
};
