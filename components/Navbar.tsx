import React, { useEffect, useRef, useState } from "react";
import {
  CircleUser,
  Hamburger,
  Heart,
  Search,
  ShoppingCartIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosinstance";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchProductSuggestions, ProductSuggestion } from "@/lib/api/product";
import { fetchCartItems } from "@/lib/api/cart";
import Link from "next/link";
// import Image from "next/image"; // Uncomment if using <Image />

const Navbar = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    pathname === path
      ? "border-b-2 border-blue-500 text-blue-500"
      : "border-b-2 border-transparent";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setModalOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setModalOpen(false);
    try {
      await axiosInstance.post("/users/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      queryClient.removeQueries({ queryKey: ["users", "me"], exact: true });
      queryClient.removeQueries({ queryKey: ["cartItems"], exact: false });
      queryClient.removeQueries({ queryKey: ["wishlistItems"], exact: false });
      queryClient.removeQueries({ queryKey: ["orders"], exact: false });
      router.push("/");
      router.refresh();
    }
  };

  const runSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      router.push("/products");
      setSearchOpen(false);
      return;
    }
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
  };

  const getImageUrl = (url?: string | null) => {
    if (!url) return undefined;
    if (url.startsWith("/uploads")) {
      return `${process.env.NEXT_PUBLIC_STATIC_URL}${url}`;
    }
    return url;
  };

  const searchQuery = debouncedSearchTerm.trim();
  const { data: searchResults = [], isFetching: searchFetching } = useQuery<
    ProductSuggestion[]
  >({
    queryKey: ["product-search", searchQuery],
    queryFn: () => fetchProductSuggestions(searchQuery, 6),
    enabled: searchOpen && searchQuery.length >= 2,
    staleTime: 10_000,
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cartItems"],
    queryFn: fetchCartItems,
    enabled: Boolean(user?.id),
  });

  const cartCount = user
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <div className="mx-auto w-[1580px] flex gap-6 text-lg justify-between">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Hamburger className="laptop:hidden" />
          <h1 className="font-bold cursor-pointer">Vortexis</h1>
        </Link>
      </div>

      <div className="hidden laptop:flex items-center gap-10">
        {[
          { label: "Home", path: "/" },
          { label: "Products", path: "/products" },
          { label: "About", path: "/about" },
          { label: "Contact", path: "/contact" },
        ].map(({ label, path }) => (
          <h1
            key={path}
            onClick={() => router.push(path)}
            className={`cursor-pointer pb-1 transition-all duration-300 ease-in-out ${isActive(
              path,
            )}`}
          >
            {label}
          </h1>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden laptop:flex items-center gap-6">
          <div ref={searchRef} className="relative">
            <input
              type="text"
              placeholder="Search ..."
              className="border-2 h-8 border-neutral-300 hover:border-neutral-600 active:border-neutral-600 py-2 px-4 pr-10 rounded-lg"
              value={searchTerm}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  runSearch();
                }
              }}
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={runSearch}
            />

            {searchOpen && searchQuery.length >= 2 && (
              <div className="absolute z-[200] mt-2 w-full text-neutral-800 bg-neutral-50 shadow-xl border border-neutral-300 rounded-lg overflow-hidden">
                {searchFetching ? (
                  <div className="px-4 py-2 text-sm">Loading...</div>
                ) : searchResults.length ? (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-neutral-200"
                      onClick={() => {
                        router.push(`/products/${p.id}`);
                        setSearchOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {getImageUrl(p.imageUrl) ? (
                          <img
                            src={getImageUrl(p.imageUrl)}
                            alt={p.name}
                            className="size-8 rounded object-cover border border-neutral-200"
                          />
                        ) : (
                          <div className="size-8 rounded bg-neutral-200 border border-neutral-200" />
                        )}
                        <span className="truncate">{p.name}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-neutral-600">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
          <Heart
            onClick={() => router.push("/wishlists")}
            className="cursor-pointer"
            size={22}
          />
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="relative cursor-pointer"
          >
            <ShoppingCartIcon size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-red-500 px-1 text-center text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div
          ref={dropdownRef}
          onClick={() => {
            setModalOpen(!modalOpen);
          }}
          className="cursor-pointer w-6 h-6 relative"
        >
          {user ? (
            <img
              src={getImageUrl(user.avatarUrl) ?? "/xboxLogo.png"}
              alt="Avatar"
              className="block h-full w-full rounded-full object-cover"
            />
          ) : (
            // Or use next/image if you prefer:
            // <Image src="/xboxLogo.png" alt="Avatar" width={28} height={28} className="rounded-full object-cover" />
            <CircleUser />
          )}

          {modalOpen && (
            <div className="absolute z-[200] top-9 right-0 text-neutral-800 bg-neutral-50 shadow-xl border rounded-md py-2 flex items-center justify-center">
              {user ? (
                <div className="flex flex-col min-w-[150px] items-center gap-1">
                  <div>Hi, {user.name}</div>
                  <span onClick={() => router.push("/my-profile")}>
                    My Profile
                  </span>
                  <span onClick={() => router.push("/my-orders")}>
                    My Order
                  </span>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer hover:text-neutral-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <span
                    className="hover:bg-neutral-200 px-4 py-2 rounded"
                    onClick={() => router.push("/auth/register")}
                  >
                    Register
                  </span>
                  <span
                    className="hover:bg-neutral-200 px-4 py-2 rounded"
                    onClick={() => router.push("/auth/login")}
                  >
                    Login
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
