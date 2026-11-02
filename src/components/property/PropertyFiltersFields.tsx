import type { PropertyFilters } from "@/types/property";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type PropertyFiltersFieldsProps = {
  pending: PropertyFilters;
  cityOptions: string[];
  onChange: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => void;
  /** Optional id prefix for labels (sidebar vs modal) */
  fieldIdPrefix?: string;
};

export function PropertyFiltersFields({
  pending,
  cityOptions,
  onChange,
  fieldIdPrefix = "filter",
}: PropertyFiltersFieldsProps) {
  const p = (suffix: string) =>
    fieldIdPrefix.length ? `${fieldIdPrefix}-${suffix}` : suffix;

  return (
    <div className="space-y-8 pb-4">
      <div className="space-y-3">
        <label
          htmlFor={p("location")}
          className="flex items-center gap-2 text-label-sm font-medium uppercase tracking-wider text-primary"
        >
          <MaterialIcon name="location_on" className="text-lg" />
          Location
        </label>
        <select
          id={p("location")}
          className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none ring-primary transition focus:ring-2"
          value={pending.city ?? ""}
          onChange={(e) =>
            onChange("city", e.target.value.length ? e.target.value : undefined)
          }
        >
          <option value="">Any city</option>
          {cityOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label htmlFor={p("query")} className="sr-only">
          Search text
        </label>
        <input
          id={p("query")}
          type="search"
          className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none ring-primary transition placeholder:text-on-surface-variant/60 focus:ring-2"
          placeholder="Search title, address, features…"
          value={pending.query ?? ""}
          onChange={(e) =>
            onChange("query", e.target.value.length ? e.target.value : undefined)
          }
        />
      </div>

      <div className="space-y-3">
        <span className="flex items-center gap-2 text-label-sm font-medium uppercase tracking-wider text-primary">
          <MaterialIcon name="payments" className="text-lg" />
          Price range
        </span>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex-1">
            <label
              htmlFor={p("min")}
              className="text-[10px] uppercase text-on-surface-variant"
            >
              Min
            </label>
            <input
              id={p("min")}
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border-none bg-surface-container-low px-3 py-2 font-medium text-body-md text-on-surface outline-none ring-primary transition focus:ring-2"
              placeholder="Any"
              value={pending.minPrice ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") {
                  onChange("minPrice", undefined);
                  return;
                }
                const n = Number(v);
                onChange("minPrice", Number.isFinite(n) ? n : undefined);
              }}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor={p("max")}
              className="text-[10px] uppercase text-on-surface-variant"
            >
              Max
            </label>
            <input
              id={p("max")}
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border-none bg-surface-container-low px-3 py-2 font-medium text-body-md text-on-surface outline-none ring-primary transition focus:ring-2"
              placeholder="Any"
              value={pending.maxPrice ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") {
                  onChange("maxPrice", undefined);
                  return;
                }
                const n = Number(v);
                onChange("maxPrice", Number.isFinite(n) ? n : undefined);
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label
          htmlFor={p("beds")}
          className="flex items-center gap-2 text-label-sm font-medium uppercase tracking-wider text-primary"
        >
          <MaterialIcon name="bed" className="text-lg" />
          Minimum beds
        </label>
        <input
          id={p("beds")}
          inputMode="numeric"
          className="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none ring-primary transition focus:ring-2"
          placeholder="Any"
          value={pending.minBeds ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") {
              onChange("minBeds", undefined);
              return;
            }
            const n = Number(v);
            onChange("minBeds", Number.isFinite(n) ? n : undefined);
          }}
        />
      </div>
    </div>
  );
}
