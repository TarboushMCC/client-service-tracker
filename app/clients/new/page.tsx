import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/actions";
import { Field, inputClass } from "@/components/FormField";
import { ArrowLeft } from "lucide-react";

export default function NewClientPage() {
  async function action(formData: FormData) {
    "use server";
    const id = await createClient(formData);
    redirect(`/clients/${id}`);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={14} />
        Back to clients
      </Link>

      <h1 className="font-serif text-2xl font-semibold tracking-tight mb-6">New client</h1>

      <form action={action} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <Field label="Name">
          <input name="name" required className={inputClass} placeholder="Jane Doe" />
        </Field>
        <Field label="Company">
          <input name="company" className={inputClass} placeholder="Acme Inc." />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input name="email" type="email" className={inputClass} placeholder="jane@acme.com" />
          </Field>
          <Field label="Phone">
            <input name="phone" className={inputClass} placeholder="+1 555 0100" />
          </Field>
        </div>
        <Field label="Notes">
          <textarea name="notes" rows={3} className={inputClass} placeholder="Anything worth remembering" />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/clients"
            className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-surface-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:opacity-90"
          >
            Save client
          </button>
        </div>
      </form>
    </div>
  );
}
