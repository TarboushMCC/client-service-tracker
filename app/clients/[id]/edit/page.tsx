import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getClient } from "@/lib/data";
import { updateClient, deleteClient } from "@/app/actions";
import { Field, inputClass } from "@/components/FormField";
import { ConfirmButton } from "@/components/ConfirmButton";
import { ArrowLeft, Trash2 } from "lucide-react";

export default async function EditClientPage({ params }: PageProps<"/clients/[id]/edit">) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateClient(id, formData);
    redirect(`/clients/${id}`);
  }

  async function removeAction() {
    "use server";
    await deleteClient(id);
    redirect(`/clients`);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <Link href={`/clients/${id}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={14} />
        Back to client
      </Link>

      <h1 className="font-serif text-2xl font-semibold tracking-tight mb-6">Edit client</h1>

      <form action={action} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <Field label="Name">
          <input name="name" required defaultValue={client.name} className={inputClass} />
        </Field>
        <Field label="Company">
          <input name="company" defaultValue={client.company ?? ""} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input name="email" type="email" defaultValue={client.email ?? ""} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input name="phone" defaultValue={client.phone ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Notes">
          <textarea name="notes" rows={3} defaultValue={client.notes ?? ""} className={inputClass} />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href={`/clients/${id}`}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-surface-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </form>

      <form action={removeAction} className="mt-4">
        <ConfirmButton
          type="submit"
          confirmMessage={`Delete ${client.name} and all of their services? This can't be undone.`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-danger/30 text-danger hover:bg-danger-soft"
        >
          <Trash2 size={14} />
          Delete client and all their services
        </ConfirmButton>
      </form>
    </div>
  );
}
