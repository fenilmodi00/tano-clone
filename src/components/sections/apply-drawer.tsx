"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export type ApplyDrawerProps = {
  roleTitle: string;
};

/**
 * Role application drawer. The trigger opens a native modal `<dialog>`; the
 * form is a local demo only and is deliberately not bound by the talk-form
 * enhancer, hence its own `wire-apply-form` class.
 */
export function ApplyDrawer({ roleTitle }: ApplyDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const uid = useId().replaceAll(":", "");
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const openDrawer = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    setOpen(true);
    setStatus("");
  };

  const closeDrawer = () => {
    dialogRef.current?.close();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setStatus("Check the highlighted fields.");
      return;
    }
    setStatus("Application received. We'll be in touch.");
    form.reset();
  };

  return (
    <>
      <Button type="button" aria-haspopup="dialog" onClick={openDrawer}>
        Apply for this role
      </Button>
      <dialog
        ref={dialogRef}
        className="wire-drawer"
        data-phase={open ? "open" : "closed"}
        aria-labelledby={`${uid}-title`}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDrawer();
        }}
        onClose={() => setOpen(false)}
      >
        <div className="wire-drawer-sheet">
          <div className="wire-drawer-rule">
            <div className="wire-spectrum-rule" aria-hidden="true" />
          </div>
          <button
            className="wire-drawer-close"
            type="button"
            aria-label="Close"
            onClick={closeDrawer}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="wire-drawer-scroll">
            <div className="wire-contact-card">
              <div className="wire-contact-head">
                <p className="tano-body-mono-sm wire-ink-soft">Apply</p>
                <h2 className="tano-heading-md" id={`${uid}-title`}>
                  {roleTitle}
                </h2>
              </div>
              <form className="wire-apply-form" noValidate onSubmit={handleSubmit}>
                <div className="wire-contact-fields">
                  <div className="wire-contact-field" data-span="half">
                    <label htmlFor={`${uid}-name`}>Full name *</label>
                    <div className="wire-contact-control">
                      <input
                        id={`${uid}-name`}
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Jane Doe"
                      />
                    </div>
                  </div>
                  <div className="wire-contact-field" data-span="half">
                    <label htmlFor={`${uid}-email`}>Email *</label>
                    <div className="wire-contact-control">
                      <input
                        id={`${uid}-email`}
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div className="wire-contact-field" data-span="wide">
                    <label htmlFor={`${uid}-linkedin`}>LinkedIn profile *</label>
                    <div className="wire-contact-control">
                      <input
                        id={`${uid}-linkedin`}
                        type="text"
                        required
                        placeholder="https://linkedin.com/in/…"
                      />
                    </div>
                  </div>
                  <div className="wire-contact-field" data-span="wide">
                    <label htmlFor={`${uid}-cv-file`}>CV / resume (PDF)</label>
                    <input
                      id={`${uid}-cv-file`}
                      className="hp-apply-file"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                  </div>
                  <div className="wire-contact-field" data-span="wide">
                    <label htmlFor={`${uid}-cv`}>…or paste a link</label>
                    <input
                      id={`${uid}-cv`}
                      type="url"
                      placeholder="Link to CV (Drive, PDF, site)"
                    />
                  </div>
                  <div className="wire-contact-field" data-span="wide">
                    <label htmlFor={`${uid}-note`}>Why Tano?</label>
                    <textarea
                      id={`${uid}-note`}
                      placeholder="A few lines on why you, and what you'd want to own."
                    />
                  </div>
                </div>
                <p role="status" className="wire-visually-hidden">
                  {status}
                </p>
                <div className="wire-contact-actions">
                  <Button type="submit">Submit application</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
