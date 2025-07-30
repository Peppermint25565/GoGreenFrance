import { Timestamp } from "firebase/firestore";

export type RequestStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";

export interface Request {
  id?: string;
  clientId: string;
  clientName: string;
  providerId?: string;
  providerName?: string;
  title: string;
  category: string;
  description: string;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  surface: number;
  urgency: "low" | "medium" | "high";
  isExpress: boolean;
  ecoOptions: {
    certificateRequested: boolean;
    ecoFriendlyMethods: boolean;
  };
  priceOriginal: number;
  priceFinal?: number;
  photos?: string[];
  status: RequestStatus;
  createdAt: Timestamp;
  clientRate?: number,
  providerRate?: number
}

export interface PriceAdjustment {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  originalPrice: number;
  newPrice: number;
  justification: string;
  photos?: string[];
  videos?: string[];
  timestamp: any;
  status: "pending" | "accepted" | "rejected";
}