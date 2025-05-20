import { ChipProps as MUIChipProps } from "@mui/material";
import { ReactElement } from "react";

export type ChipStatus = "default" | "success" | "warning" | "error" | "info";
export type ChipSize = "small" | "medium";
export type ChipShape = "rounded" | "square";

export interface ChipProps
  extends Omit<MUIChipProps, "size" | "variant" | "icon" | "deleteIcon"> {
  /**
   * The size of the chip
   * @default 'medium'
   */
  size?: ChipSize;

  /**
   * The status color of the chip
   * @default 'default'
   */
  status?: ChipStatus;

  /**
   * The shape of the chip
   * @default 'rounded'
   */
  shape?: ChipShape;

  /**
   * If true, the chip will be outlined
   * @default false
   */
  outlined?: boolean;

  /**
   * Icon to be displayed at the start of the chip
   */
  leftIcon?: ReactElement;

  /**
   * Icon to be displayed at the end of the chip
   */
  rightIcon?: ReactElement;

  /**
   * If true, the text will be uppercase
   * @default false
   */
  uppercase?: boolean;

  /**
   * If true, the chip will be clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * If true, adds a delete action to the chip
   * @default false
   */
  deletable?: boolean;

  /**
   * Callback fired when the delete icon is clicked
   */
  onDelete?: () => void;

  /**
   * Custom tooltip text
   */
  tooltip?: string;
}
