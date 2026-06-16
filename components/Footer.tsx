"use client";

import React from "react";
import Link from "next/link";
import { IoMdSend } from "react-icons/io";
import { useAuth } from "@/hooks/useAuth";

const Footer = () => {
  const { user } = useAuth();

  return (
    <div className="px-6 py-4 laptop:px-20 laptop:py-10 bg-neutral-900 flex flex-col">
      <div className="grid grid-cols-2 laptop:grid-cols-4 text-neutral-200 gap-10 laptop:gap-20 mx-auto">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl tablet:text-3xl font-semibold">Vortexis</h1>
          <h1 className="text-sm tablet:text-base">Subscribe</h1>
          <h1 className="text-sm tablet:text-base">
            Get 10% off your first order
          </h1>
          <div className="relative">
            <input
              className="border-1 px-4 py-2 pr-8 tablet:pr-12 w-full text-sm tablet:text-base"
              type="text"
              placeholder="Enter your email"
            />
            <IoMdSend className="absolute right-3 top-2 cursor-pointer text-base tablet:text-2xl" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-lg tablet:text-2xl font-semibold">Support</h1>
          <ul className="space-y-2 text-sm tablet:text-base">
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Bhaktapur%2C%20Nepal"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Bhaktapur,
                <br />
                Nepal
              </a>
            </li>
            <li>
              <a href="mailto:vortexis@gmail.com" className="hover:underline">
                vortexis@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+990158888899999" className="hover:underline">
                +99015-88888-9999
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-1">
          <h1 className="text-lg tablet:text-2xl font-semibold">Account</h1>
          <ul className="space-y-2 text-sm tablet:text-base">
            {user ? (
              <li>
                <Link href="/my-profile" className="hover:underline">
                  My Account
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/auth/login" className="hover:underline">
                  Login / Register
                </Link>
              </li>
            )}
            <li>
              <Link href="/cart" className="hover:underline">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/wishlists" className="hover:underline">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:underline">
                Shop
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-1">
          <h1 className="text-lg tablet:text-2xl font-semibold">Quick Link</h1>
          <ul className="space-y-2 text-sm tablet:text-base">
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms Of Use
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-neutral-600 mt-8 self-center">
        Copyright 2025. All right reserved
      </div>
    </div>
  );
};

export default Footer;
