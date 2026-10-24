import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getClient } from "@/lib/data";
import { createService } from "@/app/actions";
import { ServiceFields } from "@/components/ServiceFields";
import { ArrowLeft } from "lucide-react";

export default async function NewServicePage({ params }: PageProps<"/clients/[id]/services/new">) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  async function action(formData: FormData) {
    "use server";
    await createService(id, formData);
    redirect(`/clients/${id}`);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <Link href={`/clients/${id}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={14} />
        Back to {client.name}
      </Link>

      <h1 className="font-serif text-2xl font-semibold tracking-tight mb-6">Add service</h1>

      <form action={action} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <ServiceFields />
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
            Save service
          </button>
        </div>
      </form>
    </div>
  );
}
