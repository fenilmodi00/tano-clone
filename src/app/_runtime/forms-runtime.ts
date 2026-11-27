/** Owner: Forms. Mounts DOM behaviour and returns its cleanup. */
import {
  CREATOR_CONSENT_ERROR,
  CREATOR_INVALID_EMAIL,
  CREATOR_SENT_MESSAGE,
  CREATOR_SENT_NOTE,
  EMPTY_TALK_VALUES,
  TALK_ERROR_ORDER,
  TALK_SENT_BODY,
  TALK_SENT_HEADING,
  TALK_SENT_NOTE,
  DRAWER_OPEN_EVENT,
  errorsForStep,
  firstErrorField,
  isEmail,
  talkErrorId,
  validateTalk,
  type TalkValues,
} from "@/lib/forms";

type Cleanup = () => void;

const boundForms = new WeakMap<HTMLFormElement, Cleanup>();

function collectTalkValues(form: HTMLFormElement): TalkValues {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? "").trim();
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"]');
  return {
    ...EMPTY_TALK_VALUES,
    name: text("name"),
    email: text("email"),
    phoneNumber: text("phoneNumber"),
    brandWebsite: text("brandWebsite"),
    companyType: text("companyType"),
    monthlyAdSpendBand: text("monthlyAdSpendBand"),
    sellsPhysicalProducts: text("sellsPhysicalProducts"),
    creatorActivity: text("creatorActivity"),
    role: text("role"),
    hearAboutUs: text("hearAboutUs"),
    message: text("message"),
    consent: Boolean(consent?.checked),
  };
}

function fieldElement(form: HTMLFormElement, field: string): HTMLElement | null {
  return form.querySelector<HTMLElement>(`[name="${field}"]`);
}

function errorHost(form: HTMLFormElement, field: string): HTMLElement | null {
  if (field === "consent") return form.querySelector<HTMLElement>(".wire-contact-closing");
  const wrapper = form.querySelector<HTMLElement>(`.wire-contact-field[data-field="${field}"]`);
  return (
    wrapper?.querySelector<HTMLElement>(".wire-contact-control") ??
    fieldElement(form, field)?.parentElement ??
    null
  );
}

function clearFieldError(form: HTMLFormElement, field: string) {
  const host = errorHost(form, field);
  host
    ?.querySelector<HTMLParagraphElement>(`p.wire-contact-error[data-error-for="${field}"]`)
    ?.remove();
  const input = fieldElement(form, field);
  if (!input) return;
  input.removeAttribute("aria-invalid");
  const original = input.dataset.formsDescribedby;
  if (original) input.setAttribute("aria-describedby", original);
  else input.removeAttribute("aria-describedby");
  delete input.dataset.formsDescribedby;
}

function setTalkFieldError(form: HTMLFormElement, field: string, message: string) {
  clearFieldError(form, field);
  if (!message) return;
  const host = errorHost(form, field);
  const input = fieldElement(form, field);
  if (!host || !input) return;
  const id = talkErrorId(form.id, field);
  const error = document.createElement("p");
  error.className = "wire-contact-error";
  error.id = id;
  error.dataset.errorFor = field;
  error.textContent = message;
  host.append(error);
  input.setAttribute("aria-invalid", "true");
  const original = input.getAttribute("aria-describedby") ?? "";
  if (!input.dataset.formsDescribedby) input.dataset.formsDescribedby = original;
  input.setAttribute("aria-describedby", original ? `${original} ${id}` : id);
}

function clearAllTalkErrors(form: HTMLFormElement) {
  for (const field of [...TALK_ERROR_ORDER, "phoneNumber", "message"]) clearFieldError(form, field);
}

function makeBackButton(onBack: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tano-button rv-in";
  button.dataset.variant = "secondary";
  button.dataset.size = "md";
  button.dataset.material = "surface";
  button.dataset.formsBack = "";
  button.innerHTML = [
    '<span class="tano-button__glow" aria-hidden="true"></span>',
    '<span class="tano-button__edge" aria-hidden="true"></span>',
    '<span class="tano-button__fill" aria-hidden="true"></span>',
    '<span class="tano-button__label">Back</span>',
  ].join("");
  button.addEventListener("click", onBack);
  return button;
}

function showTalkSuccess(
  form: HTMLFormElement,
  card: HTMLElement | null,
  status: HTMLElement | null,
) {
  if (form.dataset.formsSent === "true") return;
  form.dataset.formsSent = "true";
  form.hidden = true;
  form.style.display = "none";
  if (status) status.textContent = TALK_SENT_HEADING;
  if (card) card.dataset.state = "sent";

  const panel = document.createElement("div");
  panel.className = "wire-contact-success";
  panel.dataset.formsSuccess = "";
  panel.tabIndex = -1;
  panel.style.outline = "none";
  panel.setAttribute("role", "status");
  const heading = document.createElement("h2");
  heading.className = "tano-heading-sm rv-in";
  heading.textContent = TALK_SENT_HEADING;
  const body = document.createElement("p");
  body.className = "tano-body-md rv-in";
  body.textContent = TALK_SENT_BODY;
  const note = document.createElement("p");
  note.className = "tano-body-sm wire-ink-soft rv-in";
  note.textContent = TALK_SENT_NOTE;
  panel.append(heading, body, note);
  (card ?? form.parentElement)?.append(panel);
  window.requestAnimationFrame(() => panel.focus());
}

function resetPlaceholderSelects(form: HTMLFormElement) {
  // React hydration selects the first enabled option even when the SSR markup
  // marked the disabled placeholder as selected. Restore the source's empty
  // state so required selects (company type, ad spend, …) stay unanswered.
  for (const select of form.querySelectorAll<HTMLSelectElement>("select[name][required]")) {
    const placeholder = Array.from(select.options).find((option) => option.value === "");
    if (!placeholder) continue;
    const wrapper = select.closest<HTMLElement>(".wire-contact-select");
    if (wrapper?.hasAttribute("data-empty") && select.value !== "") select.value = "";
    if (select.value === "") wrapper?.setAttribute("data-empty", "true");
    else wrapper?.removeAttribute("data-empty");
  }
}

function enhanceTalkForm(form: HTMLFormElement): Cleanup {
  const existing = boundForms.get(form);
  if (existing) return existing;

  form.dataset.formsBound = "talk";
  resetPlaceholderSelects(form);
  const card = form.closest<HTMLElement>(".wire-contact-card");
  const status = form.querySelector<HTMLElement>('p[role="status"]');
  const submit = (): HTMLButtonElement | null =>
    form.querySelector<HTMLButtonElement>('.wire-contact-submit button[type="submit"]');
  const labelTextNode = (): Text | null => {
    const label = form.querySelector<HTMLElement>(".wire-contact-submit .tano-button__label");
    if (!label) return null;
    return (
      [...label.childNodes].find((node): node is Text => node.nodeType === Node.TEXT_NODE) ?? null
    );
  };

  const twoStep = Boolean(form.querySelector('[name="brandWebsite"]'));
  const initialLabel = labelTextNode()?.textContent ?? "Continue";
  let step: 1 | 2 = twoStep && card?.dataset.currentStep === "2" ? 2 : 1;
  let submitting = false;
  let sent = false;
  let timer = 0;

  const setStatus = (text: string) => {
    if (status) status.textContent = text;
  };

  const setLabel = (text: string) => {
    const node = labelTextNode();
    if (node) node.textContent = text;
  };

  const setBusy = (busy: boolean) => {
    const button = submit();
    if (!button) return;
    button.disabled = busy;
    if (busy) button.setAttribute("data-disabled", "");
    else button.removeAttribute("data-disabled");
  };

  const backButton = makeBackButton(() => applyStep(1, true));
  let backMounted = false;

  function applyStep(next: 1 | 2, moveFocus: boolean, announce = true) {
    if (!twoStep) return;
    step = next;
    if (card) card.dataset.currentStep = String(next);
    const actions = form.querySelector<HTMLElement>(".wire-contact-actions");
    if (next === 2 && actions) {
      if (!backMounted) {
        actions.insertBefore(backButton, actions.firstChild);
        backMounted = true;
      }
    } else if (backMounted) {
      backButton.remove();
      backMounted = false;
    }
    setLabel(next === 2 ? "Get started" : "Continue");
    if (announce) setStatus(`Step ${next} of 2`);
    if (moveFocus) {
      const first = next === 1 ? "name" : "brandWebsite";
      window.requestAnimationFrame(() => fieldElement(form, first)?.focus());
    }
  }

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (submitting || sent) return;
    const values = collectTalkValues(form);
    const allErrors = validateTalk(values);
    const scoped = twoStep && step === 1 ? errorsForStep(allErrors, 1) : allErrors;
    clearAllTalkErrors(form);
    if (Object.keys(scoped).length > 0) {
      for (const [field, message] of Object.entries(scoped)) {
        if (message) setTalkFieldError(form, field, message);
      }
      setStatus("Check the highlighted fields.");
      const first = firstErrorField(scoped);
      if (first) window.requestAnimationFrame(() => fieldElement(form, first)?.focus());
      return;
    }
    if (twoStep && step === 1) {
      applyStep(2, true);
      return;
    }
    submitting = true;
    form.setAttribute("aria-busy", "true");
    setBusy(true);
    setLabel("Sending…");
    setStatus("Sending…");
    timer = window.setTimeout(() => {
      submitting = false;
      sent = true;
      form.removeAttribute("aria-busy");
      setBusy(false);
      setLabel(twoStep ? "Get started" : initialLabel);
      showTalkSuccess(form, card, status);
    }, 450);
  };

  const onChange = (event: Event) => {
    const target = event.target;
    if (!(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ))
      return;
    if (sent) return;
    const name = target.name;
    if (!name || name === "countryCode") return;
    if (target instanceof HTMLSelectElement) {
      const wrapper = target.closest<HTMLElement>(".wire-contact-select");
      if (wrapper) {
        if (target.value) wrapper.removeAttribute("data-empty");
        else wrapper.setAttribute("data-empty", "");
      }
    }
    clearFieldError(form, name);
    if (status?.textContent === "Check the highlighted fields.") setStatus("");
  };

  form.addEventListener("submit", onSubmit);
  form.addEventListener("input", onChange);
  form.addEventListener("change", onChange);
  applyStep(step, false, false);

  const cleanup = () => {
    if (timer) window.clearTimeout(timer);
    form.removeEventListener("submit", onSubmit);
    form.removeEventListener("input", onChange);
    form.removeEventListener("change", onChange);
    clearAllTalkErrors(form);
    (card ?? form.parentElement)?.querySelector<HTMLElement>("[data-forms-success]")?.remove();
    form.querySelector<HTMLElement>("[data-forms-back]")?.remove();
    form.hidden = false;
    form.style.display = "";
    delete form.dataset.formsSent;
    delete form.dataset.formsBound;
    form.removeAttribute("aria-busy");
    if (card) delete card.dataset.state;
    setBusy(false);
    setLabel(initialLabel);
    boundForms.delete(form);
  };
  boundForms.set(form, cleanup);
  return cleanup;
}

function enhanceCreatorForm(form: HTMLFormElement): Cleanup {
  const existing = boundForms.get(form);
  if (existing) return existing;

  form.dataset.formsBound = "creator";
  const input = form.querySelector<HTMLInputElement>('input[name="email"]');
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"]');
  const status =
    form.querySelector<HTMLElement>(".hp-cl-status") ??
    form.querySelector<HTMLElement>('[role="status"]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  if (status && !status.id) status.id = `${form.id || "creator-signup"}-status`;
  const statusId = status?.id ?? "";
  const inputOriginal = input?.getAttribute("aria-describedby") ?? "";
  const consentOriginal = consent?.getAttribute("aria-describedby") ?? "";
  let invalid = false;
  let unconsented = false;
  let sending = false;
  let sent = false;
  let timer = 0;

  const setStatus = (text: string, tone: "error" | null = null) => {
    if (!status) return;
    status.textContent = text;
    if (tone === "error") status.dataset.tone = "error";
    else delete status.dataset.tone;
  };

  const setInvalid = (on: boolean) => {
    invalid = on;
    if (!input) return;
    if (on) {
      input.setAttribute("aria-invalid", "true");
      if (statusId) input.setAttribute("aria-describedby", statusId);
    } else {
      input.removeAttribute("aria-invalid");
      if (inputOriginal) input.setAttribute("aria-describedby", inputOriginal);
      else input.removeAttribute("aria-describedby");
    }
  };

  const setConsentInvalid = (on: boolean) => {
    unconsented = on;
    if (!consent) return;
    if (on) {
      consent.setAttribute("aria-invalid", "true");
      if (statusId) consent.setAttribute("aria-describedby", statusId);
    } else {
      consent.removeAttribute("aria-invalid");
      if (consentOriginal) consent.setAttribute("aria-describedby", consentOriginal);
      else consent.removeAttribute("aria-describedby");
    }
  };

  const setBusy = (busy: boolean) => {
    if (!button) return;
    button.disabled = busy;
    if (busy) button.setAttribute("data-disabled", "");
    else button.removeAttribute("data-disabled");
  };

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (sending || sent) return;
    const email = input?.value.trim() ?? "";
    if (!isEmail(email)) {
      setConsentInvalid(false);
      setInvalid(true);
      setStatus(CREATOR_INVALID_EMAIL, "error");
      input?.focus();
      return;
    }
    if (!consent?.checked) {
      setInvalid(false);
      setConsentInvalid(true);
      setStatus(CREATOR_CONSENT_ERROR, "error");
      consent?.focus();
      return;
    }
    setInvalid(false);
    setConsentInvalid(false);
    sending = true;
    form.setAttribute("aria-busy", "true");
    setBusy(true);
    setStatus("Signing you up");
    timer = window.setTimeout(() => {
      sending = false;
      sent = true;
      form.removeAttribute("aria-busy");
      form.dataset.state = "sent";
      if (input) input.disabled = true;
      if (consent) consent.disabled = true;
      setBusy(true);
      setStatus(CREATOR_SENT_MESSAGE);
      if (status && !form.querySelector("[data-forms-demo]")) {
        const note = document.createElement("p");
        note.className = "wire-forms-demo-note";
        note.dataset.formsDemo = "";
        note.textContent = CREATOR_SENT_NOTE;
        status.insertAdjacentElement("afterend", note);
      }
    }, 450);
  };

  const onInput = (event: Event) => {
    if (sent) return;
    if (event.target === input) {
      if (invalid) {
        setInvalid(false);
        setStatus("");
      }
    }
  };

  const onChange = (event: Event) => {
    if (sent) return;
    if (event.target === consent && unconsented) {
      setConsentInvalid(false);
      setStatus("");
    }
    if (event.target === input && invalid) {
      setInvalid(false);
      setStatus("");
    }
  };

  form.addEventListener("submit", onSubmit);
  input?.addEventListener("input", onInput);
  input?.addEventListener("change", onChange);
  consent?.addEventListener("change", onChange);

  const cleanup = () => {
    if (timer) window.clearTimeout(timer);
    form.removeEventListener("submit", onSubmit);
    input?.removeEventListener("input", onInput);
    input?.removeEventListener("change", onChange);
    consent?.removeEventListener("change", onChange);
    if (input) {
      input.disabled = false;
      input.removeAttribute("aria-invalid");
    }
    if (consent) {
      consent.disabled = false;
      consent.removeAttribute("aria-invalid");
    }
    form.querySelector("[data-forms-demo]")?.remove();
    setBusy(false);
    setStatus("");
    delete form.dataset.state;
    form.removeAttribute("aria-busy");
    delete form.dataset.formsBound;
    boundForms.delete(form);
  };
  boundForms.set(form, cleanup);
  return cleanup;
}

function enhanceForm(form: HTMLFormElement): Cleanup | null {
  if (form.classList.contains("wire-contact-form")) return enhanceTalkForm(form);
  if (form.classList.contains("hp-cl-form")) return enhanceCreatorForm(form);
  return null;
}

function scanForms(root: ParentNode, track?: (cleanup: Cleanup) => void) {
  const bind = (form: HTMLFormElement) => {
    const cleanup = enhanceForm(form);
    if (cleanup) track?.(cleanup);
  };
  if (root instanceof HTMLFormElement) bind(root);
  for (const form of root.querySelectorAll<HTMLFormElement>(".wire-contact-form, .hp-cl-form")) {
    bind(form);
  }
}

function setupMobileMenu(): Cleanup {
  const panel = document.querySelector<HTMLElement>("#tano-mobile-menu");
  const toggle = document.querySelector<HTMLButtonElement>(
    'button[aria-controls="tano-mobile-menu"]',
  );
  if (!panel) return () => {};

  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Menu");
  panel.tabIndex = -1;

  const links = Array.from(panel.querySelectorAll<HTMLElement>(".wire-nav-link"));
  links.forEach((link, index) => link.style.setProperty("--i", String(index)));

  let open = panel.dataset.open === "true";
  let inerted: Array<{ element: Element; hadInert: boolean }> = [];
  let ownedOverflow: string | null = null;
  let escapeClose = false;
  const chrome =
    panel.closest<HTMLElement>(".wire-chrome") ??
    document.querySelector<HTMLElement>(".wire-chrome");

  const setClosedInert = (closed: boolean) => {
    if (closed) panel.setAttribute("inert", "");
    else panel.removeAttribute("inert");
  };

  const isVisible = (element: HTMLElement) =>
    element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";

  const panelFocusables = () =>
    Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(isVisible);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      escapeClose = true;
      return;
    }
    if (event.key !== "Tab" || !open) return;
    const items: HTMLElement[] = [];
    if (toggle) items.push(toggle);
    items.push(...panelFocusables());
    if (items.length === 0) return;
    const active = document.activeElement as HTMLElement | null;
    if (!active || !items.includes(active) || active === panel) {
      event.preventDefault();
      const dialogItems = panelFocusables();
      (event.shiftKey ? dialogItems[dialogItems.length - 1] : dialogItems[0])?.focus();
      return;
    }
    const index = items.indexOf(active);
    if (event.shiftKey && index === 0) {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (!event.shiftKey && index === items.length - 1) {
      event.preventDefault();
      items[0].focus();
    }
  };

  const lockScroll = () => {
    if (document.body.style.overflow === "hidden") return;
    ownedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    if (ownedOverflow === null) return;
    document.body.style.overflow = ownedOverflow;
    ownedOverflow = null;
  };

  const inertOutside = () => {
    const root = document.querySelector<HTMLElement>(".tano") ?? document.body;
    const chrome =
      panel.closest<HTMLElement>(".wire-chrome") ??
      document.querySelector<HTMLElement>(".wire-chrome");
    const outside: Element[] = [];
    for (const child of Array.from(root.children)) {
      if (child === chrome || child.contains(panel) || panel.contains(child)) continue;
      outside.push(child);
    }
    if (chrome) {
      for (const child of Array.from(chrome.children)) {
        if (child === panel || child.contains(toggle) || child.contains(panel)) continue;
        outside.push(child);
      }
    }
    for (const selector of [
      ".wire-nav-mark",
      ".wire-nav-links",
      ".wire-nav-end",
      ".hp-announce",
      ".wire-announce",
    ]) {
      for (const element of Array.from(document.querySelectorAll(selector))) outside.push(element);
    }
    for (const element of outside) {
      if (element === panel || element.contains(panel) || panel.contains(element)) continue;
      if (element.hasAttribute("inert")) continue;
      element.setAttribute("inert", "");
      inerted.push({ element, hadInert: false });
    }
  };

  const restoreOutside = () => {
    for (const { element, hadInert } of inerted) {
      if (!hadInert) element.removeAttribute("inert");
    }
    inerted = [];
  };

  const openMenu = () => {
    links.forEach((link, index) => link.style.setProperty("--i", String(index)));
    panel.removeAttribute("inert");
    document.documentElement.dataset.formsMenu = "open";
    // Keep the sheet above fixed announcement/cookie surfaces even if the
    // ported CSS chunk is stale; forms.css carries the same values.
    panel.style.zIndex = "55";
    if (chrome) chrome.style.zIndex = "60";
    lockScroll();
    inertOutside();
    document.addEventListener("keydown", onKeyDown, true);
    const keyboard = toggle?.matches(":focus-visible") ?? false;
    window.requestAnimationFrame(() => {
      const first = panel.querySelector<HTMLElement>(".wire-nav-link");
      if (keyboard && first) first.focus();
      else panel.focus({ preventScroll: true });
    });
  };

  const closeMenu = () => {
    document.removeEventListener("keydown", onKeyDown, true);
    const focusWasInside = panel.contains(document.activeElement);
    restoreOutside();
    setClosedInert(true);
    panel.style.zIndex = "";
    if (chrome) chrome.style.zIndex = "";
    delete document.documentElement.dataset.formsMenu;
    unlockScroll();
    if ((escapeClose || focusWasInside) && toggle)
      window.requestAnimationFrame(() => toggle.focus());
    escapeClose = false;
  };

  const sync = () => {
    const nextOpen = panel.dataset.open === "true";
    if (nextOpen === open) return;
    open = nextOpen;
    if (open) openMenu();
    else closeMenu();
  };

  const observer = new MutationObserver(sync);
  observer.observe(panel, { attributes: true, attributeFilter: ["data-open"] });

  const desktop = window.matchMedia("(min-width: 900px)");
  const onBreakpoint = () => {
    if (desktop.matches && panel.dataset.open === "true") toggle?.click();
  };
  desktop.addEventListener("change", onBreakpoint);

  setClosedInert(!open);
  if (open) openMenu();

  return () => {
    observer.disconnect();
    desktop.removeEventListener("change", onBreakpoint);
    document.removeEventListener("keydown", onKeyDown, true);
    restoreOutside();
    panel.style.zIndex = "";
    if (chrome) chrome.style.zIndex = "";
    delete document.documentElement.dataset.formsMenu;
    unlockScroll();
  };
}

export function mountForms(): Cleanup {
  const cleanups: Cleanup[] = [];
  const enhanced = new Set<Cleanup>();

  scanForms(document, (cleanup) => enhanced.add(cleanup));

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "childList") {
        for (const node of Array.from(record.removedNodes)) {
          if (!(node instanceof Element)) continue;
          const forms = node.matches(".wire-contact-form, .hp-cl-form")
            ? [node as HTMLFormElement]
            : Array.from(node.querySelectorAll<HTMLFormElement>(".wire-contact-form, .hp-cl-form"));
          for (const form of forms) {
            const cleanup = boundForms.get(form);
            if (!cleanup) continue;
            cleanup();
            enhanced.delete(cleanup);
          }
        }
        for (const node of Array.from(record.addedNodes)) {
          if (!(node instanceof Element)) continue;
          if (
            !node.matches(".wire-contact-form, .hp-cl-form, dialog.wire-drawer") &&
            !node.querySelector(".wire-contact-form, .hp-cl-form")
          ) {
            continue;
          }
          scanForms(node, (cleanup) => enhanced.add(cleanup));
        }
      } else if (record.type === "attributes") {
        const target = record.target;
        if (!(target instanceof Element)) continue;
        if (target.matches("dialog.wire-drawer, .wire-contact-form, .hp-cl-form, [data-drawer]")) {
          scanForms(target, (cleanup) => enhanced.add(cleanup));
        }
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["open", "data-phase", "data-open"],
  });

  // Published contract for the drawer shell owner: dispatch this after the
  // dialog (and its form) is inserted. The observer above is the fallback.
  const onDrawerOpen = (event: Event) => {
    const detail = (
      event as CustomEvent<{ dialog?: ParentNode; form?: HTMLFormElement } | undefined>
    ).detail;
    const scope = detail?.form ?? detail?.dialog ?? document;
    scanForms(scope, (cleanup) => enhanced.add(cleanup));
  };
  document.addEventListener(DRAWER_OPEN_EVENT, onDrawerOpen);

  const menuCleanup = setupMobileMenu();
  cleanups.push(() => {
    document.removeEventListener(DRAWER_OPEN_EVENT, onDrawerOpen);
    observer.disconnect();
    for (const cleanup of enhanced) cleanup();
    menuCleanup();
  });

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}

export function mountFormsRuntime(): (() => void) | void {
  if (typeof window === "undefined") return;
  return mountForms();
}
