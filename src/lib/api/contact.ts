import type { ContactRequest, ContactResponse } from "@/types/api";
import { contactResponseSchema } from "@/lib/schemas/api";

const base =
  typeof process.env.NEXT_PUBLIC_API_BASE === "string"
    ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "")
    : "";

function randomRef(): string {
  const slice = () => Math.random().toString(36).slice(2, 8);
  return `inq-${slice()}${slice()}`;
}

export async function submitContact(
  propertyId: string,
  body: ContactRequest,
): Promise<ContactResponse> {
  if (base.length > 0) {
    const res = await fetch(`${base}/properties/${propertyId}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data: unknown = await res.json();
    if (!res.ok) {
      const err =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error: unknown }).error === "string"
          ? (data as { error: string }).error
          : `Contact failed (${res.status})`;
      throw new Error(err);
    }
    return contactResponseSchema.parse(data);
  }

  await new Promise((r) => setTimeout(r, 450));
  return contactResponseSchema.parse({
    ok: true as const,
    referenceId: randomRef(),
  });
}
