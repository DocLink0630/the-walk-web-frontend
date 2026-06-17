export type InquiryStatus = "NEW" | "IN_PROGRESS" | "CONFIRMED" | "CLOSED";

export interface InquiryItem {
  id: string;
  modelUserId: string;
  modelName: string;
  modelType: string;
  category?: string | null;
  priceRate?: string | null;
}

export interface Inquiry {
  id: string;
  clientUserId: string;
  clientEmail?: string;
  clientName?: string;
  phone: string;
  eventDate?: string | null;
  message: string;
  status: InquiryStatus;
  items: InquiryItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedInquiriesResponse {
  data: Inquiry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateInquiryPayload {
  phone: string;
  eventDate?: string;
  message?: string;
  items: {
    modelUserId: string;
    modelName: string;
    modelType: string;
    category?: string;
    priceRate?: string;
  }[];
}
