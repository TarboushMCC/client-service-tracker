import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientWithServices } from "@/lib/data";
import { formatMoney, formatDate, daysUntil, monthlyValue, billingLabels } from "@/lib/format";
import { StatusBadge, BillingBadge, DueBadge } from "@/components/Badges";
import { ArrowLeft, Pencil, Mail, Phone, Building2, Plus } from "lucide-react";
import { deleteService } from "@/app/actions";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Trash2 } from "lucide-react";

export default async function ClientDetailPage({ params }: PageProps<"/clients/[id]">) {
  const { id } = await params;
  const client = getClientWithServices(id);
  if (!client) notFound();

  const active = client.services.filter((s) => s.status === "active");
  const monthlyTotal = active.reduce((sum, s) => sum + monthlyValue(s.amount, s.billing_type), 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={14} />
        Back to clients
      </Link>

      <header className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">{client.name}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted">
            {client.company && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={14} />
                {client.company}
              </span>
            )}
            {client.email && (
              <a href={`mailto:${client.email}`} className="inline-flex items-center gap-1.5 hover:text-accent">
                <Mail size={14} />
                {client.email}
              </a>
            )}
            {client.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={14} />
                {client.phone}
              </span>
            )}
          </div>
          {client.notes && <p className="text-sm text-muted mt-3 max-w-lg">{client.notes}</p>}
        </div>
        <Link
          href={`/clients/${id}/edit`}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-surface-muted shrink-0"
        >
          <Pencil size={14} />
          Edit
        </Link>
      </header>

      {active.length > 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-muted">Recurring value:</span>
          <span className="font-medium">{formatMoney(monthlyTotal, "USD")}/mo</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium">Services</h2>
        <Link
          href={`/clients/${id}/services/new`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:opacity-90"
        >
          <Plus size={14} />
          Add service
        </Link>
      </div>

      {client.services.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl px-6 py-12 text-center text-muted text-sm">
          No services yet. Add what you're providing for {client.name}.
        </div>
      ) : (
        <div className="space-y-3">
          {client.services.map((s) => {
            const days = daysUntil(s.due_date);
            return (
              <div key={s.id} className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <BillingBadge type={s.billing_type} />
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="font-medium">{s.description}</div>
                    {s.notes && <p className="text-sm text-muted mt-1">{s.notes}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-serif text-lg font-semibold">{formatMoney(s.amount, s.currency)}</div>
                    <div className="text-xs text-muted">{billingLabels[s.billing_type]}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm">
                  <div className="flex items-center gap-6 text-muted">
                    <span>
                      Start <span className="text-foreground">{formatDate(s.start_date)}</span>
                    </span>
                    <span>
                      Due <span className="text-foreground">{formatDate(s.due_date)}</span>
                    </span>
                    {s.status === "active" && <DueBadge days={days} />}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/clients/${id}/services/${s.id}/edit`} className="text-muted hover:text-accent">
                      <Pencil size={14} />
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteService(s.id, id);
                      }}
                    >
                      <ConfirmButton
                        type="submit"
                        confirmMessage={`Delete "${s.description}"?`}
                        className="text-muted hover:text-danger"
                      >
                        <Trash2 size={14} />
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
