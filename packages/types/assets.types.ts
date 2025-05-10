export enum AssetTypeEnum {
  RealEstate = "Real Estate",
  Vehicle = "Vehicle",
  Investment = "Investment",
  Other = "Other",
}

export enum AssetStatusEnum {
  Active = "Active",
  Sold = "Sold",
}

export type AssetType = keyof typeof AssetTypeEnum;
export type AssetStatus = keyof typeof AssetStatusEnum;

export interface CreateAssetDto {
  name: string;
  type: AssetType;
  value: number;
  status: AssetStatus;
}

export interface UpdateAssetDto extends Partial<CreateAssetDto> {}
