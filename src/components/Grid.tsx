import React, { ReactNode, CSSProperties } from "react";

interface ColProps {
  children: ReactNode;
  span?: number;
  start?: number;
  verticalStretch?: boolean;
  className?: string;
  smallMobileMargin?: boolean;
  noBottomMargin?: boolean;
}

export const Col: React.FC<ColProps> = ({
  children,
  span = 12,
  start = 1,
  verticalStretch,
  className = "",
  smallMobileMargin,
  noBottomMargin,
}) => {
  const classes = [
    "grid-col",
    className,
    verticalStretch && "vertical-stretch",
    smallMobileMargin && "small-mobile-margin",
    noBottomMargin && "no-bottom-margin",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{ gridColumn: `${start} / span ${span}` }}
    >
      {children}
    </div>
  );
};

interface GridProps {
  children: ReactNode;
  className?: string;
  columns?: number;
  reverseOrder?: boolean;
  padding?: "top" | "bottom" | "both";
  singleColumn?: boolean;
  feature?: "small" | "large";
  verticalCenter?: boolean;
  verticalEnd?: boolean;
  verticalSpaceBetween?: boolean;
  orderFix?: boolean;
  style?: CSSProperties;
}

const Grid: React.FC<GridProps> = ({
  children,
  className = "",
  columns,
  reverseOrder,
  padding,
  singleColumn,
  feature,
  verticalCenter,
  verticalEnd,
  verticalSpaceBetween,
  orderFix,
  style,
}) => {
  const classes = [
    "grid-container",
    className,
    columns === 1 && "one-column",
    columns === 2 && "two-columns",
    columns === 3 && "three-columns",
    columns === 4 && "four-columns",
    columns === 5 && "five-columns",
    reverseOrder && "reverse-order",
    (padding === "top" || padding === "both") && "grid-padding-top",
    (padding === "bottom" || padding === "both") && "grid-padding-bottom",
    singleColumn && "single-column",
    feature === "small" && "feature-small",
    feature === "large" && "feature-large",
    verticalCenter && "vertical-center",
    verticalSpaceBetween && "vertical-space-between",
    verticalEnd && "vertical-end",
    orderFix && "order-fix",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};

export default Grid; 