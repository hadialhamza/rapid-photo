"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: React.ReactNode | React.ElementType;
}

const DefaultArrow = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      icon,
      ...props
    },
    ref,
  ) => {
    const isAnimatedVariant = variant === "default" || variant === "secondary";

    const variants = {
      default: "bg-background text-primary border-primary",
      destructive:
        "bg-error text-white hover:bg-error/90 shadow-sm border-transparent",
      outline:
        "border border-border bg-transparent hover:bg-surface text-foreground",
      secondary: "bg-background text-secondary border-secondary",
      ghost:
        "hover:bg-surface text-muted hover:text-foreground border-transparent",
      link: "text-primary underline-offset-4 hover:underline border-transparent",
    };

    const sizes = {
      default: "h-12 px-6 py-3",
      sm: "h-9 rounded-full px-3",
      lg: "h-14 rounded-full px-8",
      icon: "h-10 w-10",
    };

    const baseStyles =
      "relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer overflow-hidden border-2 group active:scale-95 active:duration-75";

    if (isAnimatedVariant) {
      const circleColor = variant === "default" ? "bg-primary" : "bg-secondary";
      const iconColorClass =
        variant === "default" ? "text-primary" : "text-secondary";

      const renderIcon = (extraClasses: string) => {
        if (React.isValidElement(icon)) {
          const element = icon as React.ReactElement<{ className?: string }>;
          return React.cloneElement(element, {
            className: cn(element.props.className, extraClasses),
          });
        }
        if (icon) {
          const IconComponent = icon as React.ElementType;
          return <IconComponent className={extraClasses} />;
        }
        return <DefaultArrow className={extraClasses} />;
      };

      return (
        <motion.button
          ref={ref}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            "hover:shadow-[0_0_0_12px_transparent] hover:border-transparent",
            className,
          )}
          {...props}
        >
          {renderIcon(
            cn(
              "absolute w-6 h-6 z-10 transition-all duration-500 ease-out",
              "-left-1/4 group-hover:left-4",
              iconColorClass,
              "group-hover:text-primary-foreground",
            ),
          )}

          {/* Text Content */}
          <span className="relative z-10 -translate-x-3 transition-transform duration-500 ease-out group-hover:translate-x-3 group-hover:text-primary-foreground font-semibold flex items-center gap-2 px-2">
            {children as React.ReactNode}
          </span>

          {/* Expanding Background Circle */}
          <span
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full opacity-0 transition-all duration-300 ease-out",
              "group-hover:w-full group-hover:h-75 group-hover:opacity-100",
              circleColor,
            )}
          />

          {/* Right Arrow (visible initially, goes right on hover) */}
          {renderIcon(
            cn(
              "absolute w-6 h-6 z-10 transition-all duration-500 ease-out",
              "right-4 group-hover:-right-1/4",
              iconColorClass,
            ),
          )}
        </motion.button>
      );
    }

    // Standard button for non-animated variants (outline, ghost, etc.)
    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          "rounded-full border-transparent hover:shadow-md",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export { Button };
