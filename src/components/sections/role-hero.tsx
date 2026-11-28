import Link from "next/link";
import { HeroGlow } from "@/components/sections/hero-glow";
import { ApplyDrawer } from "@/components/sections/apply-drawer";

export type RoleTagsProps = {
  department: string;
  location: string;
  employmentType: string;
  openingsLabel?: string;
};

/** The role-detail tag row shared by the three role heroes and the index cards. */
export function RoleTags({ department, location, employmentType, openingsLabel }: RoleTagsProps) {
  return (
    <ul aria-label="Role details" className="hp-role-tags">
      <li className="hp-role-tag tano-body-sm">
        <span aria-hidden="true" className="hp-role-tag-icon">
          <svg
            viewBox="0 0 14 14"
            width="100%"
            height="100%"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4.75 3.75C4.75 2.50736 5.75736 1.5 7 1.5C8.24264 1.5 9.25 2.50736 9.25 3.75C9.25 4.99264 8.24264 6 7 6C5.75736 6 4.75 4.99264 4.75 3.75ZM13.5 5.75C13.5 4.7835 12.7165 4 11.75 4C10.7835 4 10 4.7835 10 5.75C10 6.7165 10.7835 7.5 11.75 7.5C12.7165 7.5 13.5 6.7165 13.5 5.75ZM2 12C2 12.1753 2.03008 12.3436 2.08535 12.5H0.5C0.223858 12.5 0 12.2761 0 12V10.75C0 9.50736 1.00736 8.5 2.25 8.5C2.38607 8.5 2.51932 8.51208 2.64873 8.53522C2.23579 9.26264 2 10.1038 2 11V12ZM11 12C11 12.2761 10.7761 12.5 10.5 12.5H3.5C3.22386 12.5 3 12.2761 3 12V11C3 8.79086 4.79086 7 7 7C9.20914 7 11 8.79086 11 11V12ZM0.5 5.75C0.5 4.7835 1.2835 4 2.25 4C3.2165 4 4 4.7835 4 5.75C4 6.7165 3.2165 7.5 2.25 7.5C1.2835 7.5 0.5 6.7165 0.5 5.75ZM12 12C12 12.1753 11.9699 12.3436 11.9146 12.5H13.5C13.7761 12.5 14 12.2761 14 12V10.75C14 9.50736 12.9926 8.5 11.75 8.5C11.6139 8.5 11.4807 8.51208 11.3513 8.53522C11.7642 9.26264 12 10.1038 12 11V12Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
        {department}
      </li>
      <li className="hp-role-tag tano-body-sm">
        <span aria-hidden="true" className="hp-role-tag-icon">
          <svg
            viewBox="0 0 14 14"
            width="100%"
            height="100%"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M1 6c0-3.31371 2.68629-6 6-6 3.3137 0 6 2.68629 6 6 0 1.94724-1.1187 3.72988-2.2844 5.0701-1.17729 1.3536-2.47393 2.3373-2.97128 2.6943C7.52045 13.9251 7.25937 14 7 14s-.52045-.0749-.74432-.2356c-.49735-.357-1.79399-1.3407-2.97127-2.6943C2.11874 9.72987 1 7.94724 1 6Zm6 1.5c1.10457 0 2-.89543 2-2s-.89543-2-2-2-2 .89543-2 2 .89543 2 2 2Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
        {location}
      </li>
      <li className="hp-role-tag tano-body-sm">
        <span aria-hidden="true" className="hp-role-tag-icon">
          <svg
            viewBox="0 0 14 14"
            width="100%"
            height="100%"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M7 14c3.866 0 7-3.134 7-7 0-3.86599-3.134-7-7-7-3.86599 0-7 3.13401-7 7 0 3.866 3.13401 7 7 7Zm.625-10.5c0-.34518-.27982-.625-.625-.625s-.625.27982-.625.625V7c0 .34518.27982.625.625.625h2.5c.34518 0 .625-.27982.625-.625s-.27982-.625-.625-.625H7.625V3.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
        {employmentType}
      </li>
      {openingsLabel ? <li className="hp-role-tag tano-body-sm">{openingsLabel}</li> : null}
    </ul>
  );
}

export type RoleApplyButtonProps = {
  roleTitle: string;
};

/**
 * Apply action for a role page: opens the shared application drawer.
 */
export function RoleApplyButton({ roleTitle }: RoleApplyButtonProps) {
  return <ApplyDrawer roleTitle={roleTitle} />;
}

export type RoleClosingProps = {
  roleTitle: string;
  title?: string;
  body?: string;
};

/** Dark closing band repeated at the end of every role page. */
export function RoleClosing({
  roleTitle,
  title = "Sound like you?",
  body = "Tell us why you, and what you'd want to own. We read every application.",
}: RoleClosingProps) {
  return (
    <section
      aria-labelledby="role-close"
      className="hp-band"
      data-ground="dark"
      data-ground-dark
      data-padding="xl"
    >
      <div className="hp-container hp-rp-close">
        <h2 className="tano-display-xs" id="role-close">
          {title}
        </h2>
        <p className="tano-body-para-md hp-rp-soft">{body}</p>
        <div>
          <RoleApplyButton roleTitle={roleTitle} />
        </div>
      </div>
    </section>
  );
}

export type RoleHeroProps = {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  openingsLabel: string;
};

/** Role-page hero: back link, role tags, title and apply action. */
export function RoleHero({
  title,
  department,
  location,
  employmentType,
  openingsLabel,
}: RoleHeroProps) {
  return (
    <section
      aria-labelledby="role-title"
      className="hp-band hp-rp-hero"
      data-ground="dark"
      data-ground-dark
      data-padding="xl"
    >
      <HeroGlow />
      <div className="hp-container hp-rp-hero-copy">
        <Link className="hp-rp-back tano-body-mono-sm" href="/careers">
          <span aria-hidden="true" className="hp-rp-back-mark">
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
          All roles
        </Link>
        <RoleTags
          department={department}
          location={location}
          employmentType={employmentType}
          openingsLabel={openingsLabel}
        />
        <h1 className="tano-display-md" id="role-title">
          {title}
        </h1>
        <div>
          <RoleApplyButton roleTitle={title} />
        </div>
      </div>
    </section>
  );
}
