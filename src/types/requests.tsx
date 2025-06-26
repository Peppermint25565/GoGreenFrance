export type RequestStatus = "open" | "accepted" | "completed" | "cancelled";

export interface Request {
  id: string;
  clientId: string;
  providerId?: string;      // défini après acceptation
  service: string;          // ex. "tonte", "élagage", ...
  address: string;
  lat: number;
  lng: number;
  description: string;
  surface: number;
  urgency: number;          // 1–5
  photos: string[];         // URLs Firebase Storage
  priceOriginal: number;    // estimation client
  priceFinal: number;       // devient définitif après acceptation
  status: RequestStatus;
  createdAt: number;        // Date.now()
}

export type AdjustmentStatus = "pending" | "accepted" | "rejected";

export interface PriceAdjustment {
  id: string;
  requestId: string;
  clientId: string;         // redondant mais pratique
  providerId: string;
  newPrice: number;
  justification: string;
  photos: string[];         // URLs
  status: AdjustmentStatus;
  createdAt: number;
}
