import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonMaterial = "surface" | "glass";

type ButtonAppearance = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  material?: ButtonMaterial;
  icon?: boolean;
};

const chevron = (
  <span className="tano-button__icon tano-button__icon--chevron" aria-hidden="true">
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.1"
      viewBox="0 0 8 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.6 1.4 6.2 6l-4.6 4.6" />
    </svg>
  </span>
);

function ButtonShell({ icon = true, children }: { icon?: boolean; children: ReactNode }) {
  return (
    <>
      <span className="tano-button__glow" aria-hidden="true" />
      <span className="tano-button__edge" aria-hidden="true" />
      <span className="tano-button__fill" aria-hidden="true" />
      <span className="tano-button__label">
        {children}
        {icon ? chevron : null}
      </span>
    </>
  );
}

const appearanceProps = ({
  variant = "primary",
  size = "md",
  material = "surface",
}: ButtonAppearance) => ({
  "data-variant": variant,
  "data-size": size,
  "data-material": material,
});

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonAppearance & {
    href: string;
    label: ReactNode;
  };

/** Anchor styled as the source design-system button, routed through next/link. */
export function ButtonLink({
  href,
  label,
  variant,
  size,
  material,
  icon,
  className = "tano-button",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={className}
      href={href}
      {...appearanceProps({ variant, size, material })}
      {...props}
    >
      <ButtonShell icon={icon}>{label}</ButtonShell>
    </Link>
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonAppearance & {
    children: ReactNode;
  };

/** Button counterpart for form submits and client actions. */
export function Button({
  children,
  variant,
  size,
  material,
  icon,
  className = "tano-button",
  ...props
}: ButtonProps) {
  return (
    <button className={className} {...appearanceProps({ variant, size, material })} {...props}>
      <ButtonShell icon={icon}>{children}</ButtonShell>
    </button>
  );
}
