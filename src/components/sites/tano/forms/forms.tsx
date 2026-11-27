/**
 * Forms workstream — shared validation for the talk-to-us and creator signup
 * forms. `use-forms.ts` enhances the captured server-rendered markup in place,
 * including the copy that the talk-to-us drawer mounts on demand.
 *
 * Nothing here calls a backend: a valid submit becomes a clearly labelled
 * local success state.
 */

export const TANO_DRAWER_OPEN_EVENT = "tano:drawer-open";

export const TALK_CONSENT_ERROR = "Agree to the privacy policy to send this";
export const TALK_WORK_EMAIL_ERROR = "Please use a work email.";
export const TALK_WEBSITE_ERROR = "Enter a website address, like yourbrand.com";
export const TALK_SENT_HEADING = "Thanks — your details look good.";
export const TALK_SENT_BODY =
  "This is a local demo, so nothing was sent and no booking was created.";
export const TALK_SENT_NOTE = "On the live site this step opens the booking calendar.";
export const CREATOR_SENT_MESSAGE =
  "You’re on the list. We’ll be in touch when a programme fits.";
export const CREATOR_SENT_NOTE = "Local demo — nothing was sent.";
export const CREATOR_CONSENT_ERROR = TALK_CONSENT_ERROR;
export const CREATOR_INVALID_EMAIL = "Enter a valid email address";

export type TalkFieldName =
  | "name"
  | "email"
  | "phoneNumber"
  | "brandWebsite"
  | "companyType"
  | "monthlyAdSpendBand"
  | "sellsPhysicalProducts"
  | "creatorActivity"
  | "role"
  | "hearAboutUs"
  | "message";

export type TalkValues = Record<TalkFieldName, string> & { consent: boolean };
export type TalkErrors = Partial<Record<TalkFieldName | "consent", string>>;

export const TALK_FIELD_STEP: Record<TalkFieldName | "consent", 1 | 2> = {
  name: 1,
  email: 1,
  phoneNumber: 1,
  brandWebsite: 2,
  companyType: 2,
  monthlyAdSpendBand: 2,
  sellsPhysicalProducts: 2,
  creatorActivity: 2,
  role: 2,
  hearAboutUs: 2,
  message: 2,
  consent: 2,
};

/** Focus/error order copied from the source form's validation order. */
export const TALK_ERROR_ORDER: Array<TalkFieldName | "consent"> = [
  "name",
  "email",
  "brandWebsite",
  "companyType",
  "monthlyAdSpendBand",
  "sellsPhysicalProducts",
  "creatorActivity",
  "role",
  "hearAboutUs",
  "consent",
];

export const TALK_OPTIONS = {
  companyType: ["DTC or consumer brand", "Agency", "SaaS or tech", "Creator", "Student", "Other"],
  monthlyAdSpendBand: ["Under $35k", "$35k to $75k", "$75k to $150k", "$150k to $300k", "$300k to $1M", "$1M+"],
  sellsPhysicalProducts: ["Yes", "No"],
  creatorActivity: ["None", "Gifting only", "Paid creators", "Affiliate programme"],
  role: ["Founder", "Growth", "Ecommerce or Performance", "Influencer or Social", "Other"],
  hearAboutUs: [
    "Google Web Search",
    "Google AI Overview",
    "Instagram",
    "TikTok",
    "LinkedIn",
    "AI assistant (ChatGPT, Claude, etc.)",
    "Word of mouth",
    "Event / conference",
    "Other",
  ],
} as const;

export const EMPTY_TALK_VALUES: TalkValues = {
  name: "",
  email: "",
  phoneNumber: "",
  brandWebsite: "",
  companyType: "",
  monthlyAdSpendBand: "",
  sellsPhysicalProducts: "",
  creatorActivity: "",
  role: "",
  hearAboutUs: "",
  message: "",
  consent: false,
};

const PUBLIC_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "rocketmail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "gmx.de",
  "gmx.net",
  "mail.ru",
  "inbox.ru",
  "list.ru",
  "bk.ru",
  "163.com",
  "126.com",
  "yeah.net",
  "yandex.com",
  "yandex.ru",
  "mail.com",
  "tutanota.com",
  "tutamail.com",
  "fastmail.com",
  "zoho.com",
];

const PUBLIC_EMAIL_PREFIXES = ["qq", "outlook", "hotmail", "live"];
const PUBLIC_EMAIL_SECOND_LEVELS = ["co", "com", "net", "org", "ne", "or", "ac"];

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Source rule: reject free-mail providers so enquiries use a work address. */
export function isWorkEmail(value: string): boolean {
  const address = value.trim().toLowerCase();
  if (!isEmail(address)) return false;
  const at = address.lastIndexOf("@");
  if (at < 0) return false;
  const domain = address
    .slice(at + 1)
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
  if (!domain) return false;
  if (PUBLIC_EMAIL_DOMAINS.includes(domain)) return false;
  const [first, ...rest] = domain.split(".");
  if (!first || !PUBLIC_EMAIL_PREFIXES.includes(first)) return true;
  if (rest.length === 1) return !/^[a-z]{2,}$/.test(rest[0]);
  if (rest.length === 2) {
    return !(PUBLIC_EMAIL_SECOND_LEVELS.includes(rest[0]) && /^[a-z]{2}$/.test(rest[1]));
  }
  return true;
}

/** Source URL normaliser: bare domains get https://, non-http(s) is rejected. */
export function normaliseWebsite(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;
  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!/^[a-z\d-]+(\.[a-z\d-]+)+$/i.test(url.hostname)) return null;
    if (!/[a-z]{2,}$/i.test(url.hostname)) return null;
    return url.toString().slice(0, 500);
  } catch {
    return null;
  }
}

export function validateTalk(values: TalkValues): TalkErrors {
  const errors: TalkErrors = {};
  const name = values.name.trim().slice(0, 200);
  if (!name) errors.name = "Enter your name";

  const email = values.email.trim().slice(0, 320);
  if (!email) errors.email = "Enter your work email";
  else if (!isEmail(email)) errors.email = "Enter a valid email address";
  else if (!isWorkEmail(email)) errors.email = TALK_WORK_EMAIL_ERROR;

  const website = values.brandWebsite.trim();
  if (!website) errors.brandWebsite = "Enter your brand website";
  else if (normaliseWebsite(website) === null) errors.brandWebsite = TALK_WEBSITE_ERROR;

  const companyType = values.companyType.trim();
  if (!companyType || !TALK_OPTIONS.companyType.includes(companyType as (typeof TALK_OPTIONS.companyType)[number])) {
    errors.companyType = "Choose your company type";
  }

  const spend = values.monthlyAdSpendBand.trim();
  if (!spend || !TALK_OPTIONS.monthlyAdSpendBand.includes(spend as (typeof TALK_OPTIONS.monthlyAdSpendBand)[number])) {
    errors.monthlyAdSpendBand = "Choose your monthly ad spend";
  }

  const sells = values.sellsPhysicalProducts.trim();
  if (!sells || !TALK_OPTIONS.sellsPhysicalProducts.includes(sells as (typeof TALK_OPTIONS.sellsPhysicalProducts)[number])) {
    errors.sellsPhysicalProducts = "Say whether you sell physical products online";
  }

  const activity = values.creatorActivity.trim();
  if (!activity || !TALK_OPTIONS.creatorActivity.includes(activity as (typeof TALK_OPTIONS.creatorActivity)[number])) {
    errors.creatorActivity = "Choose your current creator activity";
  }

  const role = values.role.trim();
  if (!role || !TALK_OPTIONS.role.includes(role as (typeof TALK_OPTIONS.role)[number])) {
    errors.role = "Choose your role";
  }

  const heard = values.hearAboutUs.trim();
  if (!heard || !TALK_OPTIONS.hearAboutUs.includes(heard as (typeof TALK_OPTIONS.hearAboutUs)[number])) {
    errors.hearAboutUs = "Please tell us where you heard about us.";
  }

  if (!values.consent) errors.consent = TALK_CONSENT_ERROR;
  return errors;
}

export function errorsForStep(errors: TalkErrors, step: 1 | 2): TalkErrors {
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => TALK_FIELD_STEP[field as TalkFieldName | "consent"] === step),
  ) as TalkErrors;
}

export function firstErrorField(errors: TalkErrors): TalkFieldName | "consent" | null {
  return TALK_ERROR_ORDER.find((field) => errors[field]) ?? null;
}

/** DOM-side error id for a field; keeps ids unique per form instance. */
export function talkErrorId(formId: string, field: string): string {
  return `${formId || "talk-to-us"}-${field}-error`;
}
