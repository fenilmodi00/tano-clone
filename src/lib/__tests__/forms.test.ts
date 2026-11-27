import { describe, expect, it } from "vitest";
import {
  EMPTY_TALK_VALUES,
  TALK_CONSENT_ERROR,
  TALK_WEBSITE_ERROR,
  TALK_WORK_EMAIL_ERROR,
  errorsForStep,
  firstErrorField,
  isEmail,
  isWorkEmail,
  normaliseWebsite,
  validateTalk,
  type TalkErrors,
  type TalkFieldName,
  type TalkValues,
} from "@/lib/forms";

describe("isEmail", () => {
  const cases: Array<{ label: string; value: string; expected: boolean }> = [
    { label: "accepts a dotted address", value: "user@example.com", expected: true },
    { label: "accepts a tagged address", value: "user+tag@example.co.uk", expected: true },
    { label: "trims surrounding whitespace", value: "  user@example.com  ", expected: true },
    { label: "rejects an empty string", value: "", expected: false },
    { label: "rejects whitespace only", value: "   ", expected: false },
    { label: "rejects an address without a domain", value: "user@example", expected: false },
    { label: "rejects a missing local part", value: "@example.com", expected: false },
    { label: "rejects a missing top-level label", value: "user@example.", expected: false },
    { label: "rejects a space in the local part", value: "user name@example.com", expected: false },
    { label: "rejects a space in the domain", value: "user@exa mple.com", expected: false },
    { label: "rejects a bare word", value: "user", expected: false },
  ];

  it.each(cases)("$label", ({ value, expected }) => {
    expect(isEmail(value)).toBe(expected);
  });
});

describe("isWorkEmail", () => {
  const cases: Array<{ label: string; value: string; expected: boolean }> = [
    { label: "accepts a company domain", value: "user@example.com", expected: true },
    { label: "ignores address casing", value: "USER@EXAMPLE.COM", expected: true },
    {
      label: "accepts a multi-label company domain",
      value: "user@mail.example.co",
      expected: true,
    },
    { label: "ignores a trailing domain dot", value: "user@example.com.", expected: true },
    { label: "rejects gmail.com", value: "user@gmail.com", expected: false },
    { label: "rejects googlemail.com", value: "user@googlemail.com", expected: false },
    { label: "rejects yahoo.com", value: "user@yahoo.com", expected: false },
    { label: "rejects proton.me", value: "user@proton.me", expected: false },
    { label: "rejects outlook.com", value: "user@outlook.com", expected: false },
    { label: "rejects hotmail.co.uk", value: "user@hotmail.co.uk", expected: false },
    { label: "rejects live.co.uk", value: "user@live.co.uk", expected: false },
    { label: "rejects qq.com", value: "user@qq.com", expected: false },
    { label: "rejects outlook.de", value: "user@outlook.de", expected: false },
    { label: "rejects a value that is not an email", value: "user@example", expected: false },
    { label: "rejects an empty value", value: "", expected: false },
  ];

  it.each(cases)("$label", ({ value, expected }) => {
    expect(isWorkEmail(value)).toBe(expected);
  });
});

describe("normaliseWebsite", () => {
  const cases: Array<{ label: string; value: string; expected: string | null }> = [
    { label: "prefixes a bare domain", value: "acme.com", expected: "https://acme.com/" },
    { label: "trims surrounding whitespace", value: "  acme.com  ", expected: "https://acme.com/" },
    { label: "keeps an https URL", value: "https://acme.com", expected: "https://acme.com/" },
    {
      label: "keeps an http URL with path, query and hash",
      value: "http://acme.com/shop?ref=ad#top",
      expected: "http://acme.com/shop?ref=ad#top",
    },
    {
      label: "lowercases the host but keeps path casing",
      value: "HTTPS://ACME.COM/Shop",
      expected: "https://acme.com/Shop",
    },
    {
      label: "keeps an explicit port and path",
      value: "https://acme.com:8443/shop",
      expected: "https://acme.com:8443/shop",
    },
    {
      label: "prefixes a www domain",
      value: "www.acme.co.uk",
      expected: "https://www.acme.co.uk/",
    },
    { label: "rejects an empty string", value: "", expected: null },
    { label: "rejects whitespace only", value: "   ", expected: null },
    { label: "rejects a domain without a dot", value: "acme", expected: null },
    { label: "rejects embedded whitespace", value: "not a website", expected: null },
    { label: "rejects a non-http scheme", value: "ftp://acme.com", expected: null },
    { label: "rejects a javascript URL", value: "javascript:alert(1)", expected: null },
    { label: "rejects an IP address host", value: "https://127.0.0.1", expected: null },
  ];

  it.each(cases)("$label", ({ value, expected }) => {
    expect(normaliseWebsite(value)).toBe(expected);
  });
});

const validTalkValues: TalkValues = {
  name: "Ada Lovelace",
  email: "ada@analytical.co",
  phoneNumber: "+44 7700 900123",
  brandWebsite: "analytical.co",
  companyType: "Agency",
  monthlyAdSpendBand: "$35k to $75k",
  sellsPhysicalProducts: "Yes",
  creatorActivity: "None",
  role: "Founder",
  hearAboutUs: "Word of mouth",
  message: "We would like to talk.",
  consent: true,
};

describe("validateTalk", () => {
  it("accepts a complete form and ignores unvalidated free-text fields", () => {
    expect(validateTalk(validTalkValues)).toEqual({});
    expect(validateTalk({ ...validTalkValues, phoneNumber: "", message: "" })).toEqual({});
  });

  it("accepts values with surrounding whitespace", () => {
    expect(
      validateTalk({
        ...validTalkValues,
        name: "  Ada Lovelace  ",
        email: "  Ada@Analytical.CO  ",
        brandWebsite: "  analytical.co  ",
      }),
    ).toEqual({});
  });

  const invalidCases: Array<{
    label: string;
    patch: Partial<TalkValues>;
    field: keyof TalkErrors;
    message: string;
  }> = [
    {
      label: "rejects a missing name",
      patch: { name: "" },
      field: "name",
      message: "Enter your name",
    },
    {
      label: "rejects a whitespace-only name",
      patch: { name: "   " },
      field: "name",
      message: "Enter your name",
    },
    {
      label: "rejects a missing email",
      patch: { email: "" },
      field: "email",
      message: "Enter your work email",
    },
    {
      label: "rejects a malformed email before the work rule",
      patch: { email: "ada" },
      field: "email",
      message: "Enter a valid email address",
    },
    {
      label: "rejects a free-mail domain",
      patch: { email: "ada@gmail.com" },
      field: "email",
      message: TALK_WORK_EMAIL_ERROR,
    },
    {
      label: "rejects a free-mail domain regardless of casing",
      patch: { email: "Ada@GMAIL.COM" },
      field: "email",
      message: TALK_WORK_EMAIL_ERROR,
    },
    {
      label: "rejects a public prefix domain",
      patch: { email: "ada@outlook.com" },
      field: "email",
      message: TALK_WORK_EMAIL_ERROR,
    },
    {
      label: "rejects a missing website",
      patch: { brandWebsite: "" },
      field: "brandWebsite",
      message: "Enter your brand website",
    },
    {
      label: "rejects an unparseable website",
      patch: { brandWebsite: "not a website" },
      field: "brandWebsite",
      message: TALK_WEBSITE_ERROR,
    },
    {
      label: "rejects a non-http website",
      patch: { brandWebsite: "ftp://analytical.co" },
      field: "brandWebsite",
      message: TALK_WEBSITE_ERROR,
    },
    {
      label: "rejects an unknown company type",
      patch: { companyType: "Freelancer" },
      field: "companyType",
      message: "Choose your company type",
    },
    {
      label: "rejects an unknown spend band",
      patch: { monthlyAdSpendBand: "$2" },
      field: "monthlyAdSpendBand",
      message: "Choose your monthly ad spend",
    },
    {
      label: "rejects an unknown physical products answer",
      patch: { sellsPhysicalProducts: "Maybe" },
      field: "sellsPhysicalProducts",
      message: "Say whether you sell physical products online",
    },
    {
      label: "rejects an unknown creator activity",
      patch: { creatorActivity: "Sometimes" },
      field: "creatorActivity",
      message: "Choose your current creator activity",
    },
    {
      label: "rejects an unknown role",
      patch: { role: "Intern" },
      field: "role",
      message: "Choose your role",
    },
    {
      label: "rejects a missing referral source",
      patch: { hearAboutUs: "" },
      field: "hearAboutUs",
      message: "Please tell us where you heard about us.",
    },
    {
      label: "rejects a missing consent",
      patch: { consent: false },
      field: "consent",
      message: TALK_CONSENT_ERROR,
    },
  ];

  it.each(invalidCases)("$label", ({ patch, field, message }) => {
    expect(validateTalk({ ...validTalkValues, ...patch })).toEqual({ [field]: message });
  });

  it("reports every required field for an empty form", () => {
    expect(validateTalk(EMPTY_TALK_VALUES)).toEqual({
      name: "Enter your name",
      email: "Enter your work email",
      brandWebsite: "Enter your brand website",
      companyType: "Choose your company type",
      monthlyAdSpendBand: "Choose your monthly ad spend",
      sellsPhysicalProducts: "Say whether you sell physical products online",
      creatorActivity: "Choose your current creator activity",
      role: "Choose your role",
      hearAboutUs: "Please tell us where you heard about us.",
      consent: TALK_CONSENT_ERROR,
    });
  });
});

describe("errorsForStep", () => {
  const errors: TalkErrors = {
    name: "name error",
    email: "email error",
    brandWebsite: "website error",
    companyType: "company error",
    monthlyAdSpendBand: "spend error",
    sellsPhysicalProducts: "sells error",
    creatorActivity: "activity error",
    role: "role error",
    hearAboutUs: "source error",
    consent: "consent error",
  };

  it("keeps only step one fields", () => {
    expect(errorsForStep(errors, 1)).toEqual({
      name: "name error",
      email: "email error",
    });
  });

  it("keeps only step two fields", () => {
    expect(errorsForStep(errors, 2)).toEqual({
      brandWebsite: "website error",
      companyType: "company error",
      monthlyAdSpendBand: "spend error",
      sellsPhysicalProducts: "sells error",
      creatorActivity: "activity error",
      role: "role error",
      hearAboutUs: "source error",
      consent: "consent error",
    });
  });

  it("partitions the errors across both steps without dropping any", () => {
    expect({
      ...errorsForStep(errors, 1),
      ...errorsForStep(errors, 2),
    }).toEqual(errors);
  });

  it("returns an empty object when there are no errors", () => {
    expect(errorsForStep({}, 1)).toEqual({});
    expect(errorsForStep({}, 2)).toEqual({});
  });
});

describe("firstErrorField", () => {
  const cases: Array<{
    label: string;
    errors: TalkErrors;
    expected: TalkFieldName | "consent" | null;
  }> = [
    { label: "returns null for no errors", errors: {}, expected: null },
    { label: "returns the only error", errors: { consent: "x" }, expected: "consent" },
    { label: "prefers name over email", errors: { email: "x", name: "y" }, expected: "name" },
    {
      label: "prefers email over a later website error",
      errors: { brandWebsite: "x", email: "y" },
      expected: "email",
    },
    {
      label: "follows the declared order past the early fields",
      errors: { hearAboutUs: "x", role: "y" },
      expected: "role",
    },
    {
      label: "prefers brandWebsite over hearAboutUs",
      errors: { hearAboutUs: "x", brandWebsite: "y" },
      expected: "brandWebsite",
    },
    {
      label: "ignores fields absent from the error order",
      errors: { phoneNumber: "x", message: "y" },
      expected: null,
    },
    {
      label: "ignores empty-string errors",
      errors: { name: "" },
      expected: null,
    },
    {
      label: "returns the first of all errors",
      errors: {
        name: "name",
        email: "email",
        brandWebsite: "website",
        companyType: "company",
        monthlyAdSpendBand: "spend",
        sellsPhysicalProducts: "sells",
        creatorActivity: "activity",
        role: "role",
        hearAboutUs: "source",
        consent: "consent",
      },
      expected: "name",
    },
  ];

  it.each(cases)("$label", ({ errors, expected }) => {
    expect(firstErrorField(errors)).toBe(expected);
  });
});
