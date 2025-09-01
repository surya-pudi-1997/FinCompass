export type AssetStatus = "Active" | "Sold";
export type AssetType = "Real Estate" | "Vehicle" | "Stock" | "Bond" | "Other";

export interface CreateAssetDto {
  name: string;
  type: AssetType;
  bought_from?: string;
  sold_to?: string;
  bought_value: number;
  sold_value?: number;
  expense?: number;
  income?: number;
  status: AssetStatus;
  is_existing?: boolean;
  bought_transaction?: string;
}

export interface UpdateAssetDto {
  name?: string;
  type?: AssetType;
  bought_value?: number;
  sold_value?: number;
  bought_from?: string;
  sold_to?: string;
  expense?: number;
  income?: number;
  is_existing?: boolean;
  status?: AssetStatus;
  bought_transaction?: string;
}

export interface Asset extends CreateAssetDto {
  id: string;
  userId: string;
  createdAt: Date;
}
