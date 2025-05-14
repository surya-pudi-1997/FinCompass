export type AssetStatus = "Active" | "Sold";
export type AssetType = "Real Estate" | "Vehicle" | "Stock" | "Bond" | "Other";

export interface CreateAssetDto {
  name: string;
  type: AssetType;
  bought_value: number;
  sold_value?: number;
  expense?: number;
  income?: number;
  status: AssetStatus;
}

export interface UpdateAssetDto {
  name?: string;
  type?: AssetType;
  bought_value?: number;
  sold_value?: number;
  expense?: number;
  income?: number;
  status?: AssetStatus;
}

export interface Asset extends CreateAssetDto {
  id: string;
  userId: string;
  createdAt: Date;
}
