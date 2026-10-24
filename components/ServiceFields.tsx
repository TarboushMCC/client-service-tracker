import { Field, inputClass } from "@/components/FormField";
import type { Service } from "@/lib/types";

export function ServiceFields({ service }: { service?: Service }) {
  return (
    <>
      <Field label="What are you providing?">
        <input
          name="description"
          required
          defaultValue={service?.description ?? ""}
          className={inputClass}
          placeholder="Monthly website maintenance"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Billing">
          <select name="billing_type" defaultValue={service?.billing_type ?? "monthly"} className={inputClass}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="lifetime">Lifetime</option>
            <option value="one_time">One-time</option>
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={service?.status ?? "active"} className={inputClass}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount">
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={service?.amount ?? ""}
            className={inputClass}
            placeholder="150.00"
          />
        </Field>
        <Field label="Currency">
          <input name="currency" defaultValue={service?.currency ?? "USD"} className={inputClass} placeholder="USD" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date">
          <input name="start_date" type="date" defaultValue={service?.start_date ?? ""} className={inputClass} />
        </Field>
        <Field label="Due / renewal date" hint="Next payment or renewal date, if any">
          <input name="due_date" type="date" defaultValue={service?.due_date ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Notes">
        <textarea name="notes" rows={3} defaultValue={service?.notes ?? ""} className={inputClass} />
      </Field>
    </>
  );
}
