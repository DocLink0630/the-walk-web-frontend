"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { BookingItem, TalentProfile } from "@/types/talents";

interface BookingContextType {
  bookingCart: BookingItem[];
  addToCart: (talent: TalentProfile) => void;
  removeFromCart: (talentId: string) => void;
  clearCart: () => void;
  isInCart: (talentId: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingCart, setBookingCart] = useState<BookingItem[]>([]);

  const addToCart = (talent: TalentProfile) => {
    if (!bookingCart.find((item) => item.talent.id === talent.id)) {
      setBookingCart([...bookingCart, { talent }]);
    }
  };

  const removeFromCart = (talentId: string) => {
    setBookingCart(bookingCart.filter((item) => item.talent.id !== talentId));
  };

  const clearCart = () => {
    setBookingCart([]);
  };

  const isInCart = (talentId: string) => {
    return bookingCart.some((item) => item.talent.id === talentId);
  };

  return (
    <BookingContext.Provider
      value={{ bookingCart, addToCart, removeFromCart, clearCart, isInCart }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
