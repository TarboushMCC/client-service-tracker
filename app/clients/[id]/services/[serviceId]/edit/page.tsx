import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getClient, getServicesForClient } from "@/lib/data";
import { updateService, deleteService } from "@/app/actions";
import { ServiceFields } from "@/components/ServiceFields";
import { ConfirmButton } from "@/components/ConfirmButton";
import { ArrowLeft, Trash2 } from "lucide-react";

export default async function EditServicePage({
  params,
}: PageProps<"/clients/[id]/services/[serviceId]/edit">) {
  const { id, serviceId } = await params;
  const client = getClient(id);
  if (!client) notFound();
  const service = getServicesForClient(id).find((s) => s.id === serviceId);
  if (!service) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateService(serviceId, id, formData);
    redirect(`/clients/${id}`);
  }

  async function removeAction() {
    "use server";
    await deleteService(serviceId, id);
    redirect(`/clients/${id}`);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <Link href={`/clients/${id}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={14} />
        Back to {client.name}
      </Link>

      <h1 className="font-serif text-2xl font-semibold tracking-tight mb-6">Edit service</h1>

      <form action={action} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <ServiceFields service={service} />
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
          confirmMessage={`Delete "${service.description}"?`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-danger/30 text-danger hover:bg-danger-soft"
        >
          <Trash2 size={14} />
          Delete service
        </ConfirmButton>
      </form>
    </div>
  );
}
