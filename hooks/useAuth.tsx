"use client";

import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/lib/api/user";

const useAuth = () => {
    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useQuery<User>({
        queryKey: ["users", "me"],
        queryFn: fetchMe,
    });

    return { user, isUserLoading, isUserError };
};

export { useAuth };
