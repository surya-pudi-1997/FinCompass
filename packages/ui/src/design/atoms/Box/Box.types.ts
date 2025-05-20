import { BoxProps as MUIBoxProps } from "@mui/material";
import { ReactNode } from "react";

export interface BoxProps extends Omit<MUIBoxProps, "component"> {
  /**
   * The content of the Box component.
   */
  children?: ReactNode;

  /**
   * The HTML element used for the root node.
   * @default 'div'
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Additional className to be applied to the Box.
   */
  className?: string;

  /**
   * different predefined styles for the Box component.
   */
  variant?:
    | "flex-fixed"
    | "flex-grow"
    | "vertical-centered"
    | "horizontal-centered"
    | "vertical-centered-full-width"
    | "horizontal-centered-full-width";
}
