"use client";

import { useState, type FormEvent } from "react";
import { contactRequestSchema } from "@/lib/schemas/property";
import { submitContact } from "@/lib/api/contact";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { ZodError } from "zod";

type ContactFormProps = {
  propertyId: string;
};

function formatZodError(error: ZodError): string {
  return error.errors.map((e) => e.message).join(" · ");
}

export function ContactForm({ propertyId }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    const parsed = contactRequestSchema.safeParse({ name, email, message });
    if (!parsed.success) {
      setErrorMessage(formatZodError(parsed.error));
      setSubmitStatus("error");
      return;
    }
    setSubmitStatus("submitting");
    try {
      const res = await submitContact(propertyId, parsed.data);
      setReferenceId(res.referenceId);
      setSubmitStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  const fieldBase =
    "mt-1 w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none ring-secondary/30 placeholder:text-on-surface-variant/50 transition focus:ring-2";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/90 p-6 shadow-sm backdrop-blur-sm md:p-8"
    >
      <div className="mb-6 flex items-center gap-2">
        <MaterialIcon name="mail" className="text-xl text-secondary" aria-hidden />
        <h3 className="text-label-sm font-semibold uppercase tracking-wide text-primary/50">
          Message the seller
        </h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="text-caption uppercase tracking-wide text-on-surface-variant">
            Name
          </span>
          <input
            className={fieldBase}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="text-caption uppercase tracking-wide text-on-surface-variant">
            Email
          </span>
          <input
            type="email"
            className={fieldBase}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-caption uppercase tracking-wide text-on-surface-variant">
          Message
        </span>
        <textarea
          className={`${fieldBase} min-h-[120px] resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      {errorMessage ? (
        <p className="mt-4 text-caption text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {submitStatus === "success" && referenceId ? (
        <p className="mt-4 text-caption text-secondary" role="status">
          Sent successfully. Reference: {referenceId}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitStatus === "submitting"}
        className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-[16px] font-semibold text-on-primary shadow-lg transition hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
      >
        {submitStatus === "submitting" ? "Sending…" : "Send inquiry"}
        <MaterialIcon name="send" className="text-xl group-hover:-translate-y-px" />
      </button>
    </form>
  );
}
