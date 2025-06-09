import React, { ReactNode, CSSProperties } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
  padding?: "top" | "bottom" | "both";
  backgroundGradient?: boolean;
  backgroundGradientWhite?: boolean;
  backgroundGradientHeader?: boolean;
  backgroundImage?: string | ReactNode;
  backgroundAlt?: string;
  backgroundImageSrc?: ReactNode;
  backgroundVideo?: ReactNode;
  mobileBackgroundVideo?: boolean;
  backgroundColor?: string;
  mobileNoBackgroundImage?: boolean;
  mobileBackgroundImage?: boolean;
  mobileNoBackgroundVideo?: boolean;
  header?: boolean;
  headerBlog?: boolean;
  childrenBefore?: ReactNode;
  childrenAfter?: ReactNode;
  noInner?: boolean;
  innerMargin?: "bottom";
  divide?: "rightToLeft" | "rightToLeftTop" | "leftToRight" | "leftToRightTop" | "leftToRightBottom";
  divider?: ReactNode;
  lightOnDark?: boolean;
  darkOnLight?: boolean;
  showcase?: boolean;
  hero?: boolean;
  roundedBottomRight?: boolean;
  fullHeight?: boolean | "desktop";
  verticalCenter?: boolean;
  verticalEnd?: boolean;
  sticky?: boolean;
  dynamic?: CSSProperties;
  heroContent?: boolean;
  spaceBetween?: boolean;
  flexFix?: boolean;
  dataSection?: string;
  largePaddingTop?: boolean;
}

const Section: React.FC<SectionProps> = ({
  className = "",
  id,
  style,
  padding,
  backgroundGradient,
  backgroundGradientWhite,
  backgroundGradientHeader,
  backgroundImage,
  backgroundAlt,
  backgroundImageSrc,
  backgroundVideo,
  mobileBackgroundVideo,
  backgroundColor,
  mobileNoBackgroundImage,
  mobileBackgroundImage,
  mobileNoBackgroundVideo,
  header,
  headerBlog,
  children,
  childrenBefore,
  childrenAfter,
  noInner,
  innerMargin,
  divide,
  divider,
  lightOnDark,
  darkOnLight,
  showcase,
  hero,
  roundedBottomRight,
  fullHeight,
  verticalCenter,
  verticalEnd,
  sticky,
  dynamic,
  heroContent,
  spaceBetween,
  flexFix,
  dataSection,
  largePaddingTop,
}) => {
  // Helper function to capitalize background colors
  const capitalise = (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1);

  const classes = [
    "section",
    className,
    (padding === "top" || padding === "both") && "section-padding-top",
    (padding === "bottom" || padding === "both") && "section-padding-bottom",
    largePaddingTop && "section-large-padding-top",
    backgroundGradient && "section-background-gradient",
    backgroundImage && "section-background-image",
    backgroundGradientWhite && "section-background-gradient-white",
    backgroundGradientHeader && "section-background-gradient-header",
    mobileNoBackgroundImage && "section-mobile-no-background-image",
    mobileBackgroundImage && "section-mobile-background-image",
    mobileBackgroundVideo && "section-mobile-background-video",
    mobileNoBackgroundVideo && "section-mobile-no-background-video",
    header && "section-header",
    headerBlog && "section-header-blog",
    innerMargin === "bottom" && "section-inner-margin-bottom",
    lightOnDark && "lightOnDark",
    darkOnLight && "darkOnLight",
    showcase && "section-showcase",
    hero && "section-hero",
    roundedBottomRight && "section-rounded-bottom-right",
    fullHeight && fullHeight !== "desktop" && "section-full-height",
    fullHeight === "desktop" && "section-full-height-desktop",
    verticalCenter && "section-vertical-center",
    verticalEnd && "section-vertical-end",
    sticky && "section-sticky",
    divide === "rightToLeft" && "section-divide-right-to-left",
    divide === "rightToLeftTop" && "section-divide-right-to-left-top",
    divide === "leftToRight" && "section-divide-left-to-right",
    divide === "leftToRightTop" && "section-divide-left-to-right-top",
    divide === "leftToRightBottom" && "section-divide-left-to-right-bottom",
    backgroundColor && `background${capitalise(backgroundColor)}`,
    heroContent && "section-hero-content",
    spaceBetween && "section-space-between",
  ]
    .filter(Boolean)
    .join(" ");

  const internal = (
    <>
      {divider && divider}
      {childrenBefore}

      {noInner ? (
        children
      ) : sticky ? (
        <div className="section-inner">
          <div className="section-sticky-inner">{children}</div>
        </div>
      ) : (
        <div className={`section-inner ${flexFix ? "section-flex-fix" : ""}`}>
          {children}
        </div>
      )}
      
      {backgroundImage && typeof backgroundImage === "string" ? (
        <div style={dynamic} className="section-background-image-wrapper">
          <img src={backgroundImage} alt={backgroundAlt || ""} />
        </div>
      ) : backgroundImage && (
        <div style={dynamic} className="section-background-image-wrapper">
          {backgroundImage}
        </div>
      )}
      
      {backgroundImageSrc && (
        <div style={dynamic} className="section-background-image-wrapper">
          {backgroundImageSrc}
        </div>
      )}
      
      {childrenAfter}
      
      {backgroundVideo && (
        <div className="section-background-video" style={dynamic}>
          {backgroundVideo}
        </div>
      )}
    </>
  );

  const Element = header ? "header" : "section";

  return (
    <Element 
      className={classes} 
      style={style} 
      id={id} 
      data-section={dataSection}
    >
      {internal}
    </Element>
  );
};

export default Section; 