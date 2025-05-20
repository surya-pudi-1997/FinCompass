import { TypographyProps as MUITypographyProps } from "@mui/material";

export interface TypographyProps extends Omit<MUITypographyProps, "component"> {
  /**
   * Controls text truncation with ellipsis
   * @default false
   */
  ellipsis?: boolean;

  /**
   * Maximum number of lines before truncating with ellipsis
   * Only works when ellipsis is true
   * @default 1
   */
  maxLines?: number;

  /**
   * Text decoration style
   */
  decoration?: "none" | "underline" | "line-through" | "overline";

  /**
   * If true, text will be selectable
   * @default true
   */
  selectable?: boolean;

  /**
   * Custom HTML element to render
   * @default 'p'
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * If true, text will be uppercase
   * @default false
   */
  uppercase?: boolean;

  /**
   * If true, text will be capitalized
   * @default false
   */
  capitalize?: boolean;
}
