import Link from "next/link";
import { getAllClientsWithServices } from "@/lib/data";
import { formatMoney, monthlyValue } from "@/lib/format";
import { Plus, Building2 } from "lucide-react";

export default async function ClientsPage() {
  const clients = getAllClientsWithServices();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Clients</h1>
          <p className="text-muted mt-1">Everyone you're currently working with.</p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} />
          New client
        </Link>
      </header>

      {clients.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl px-6 py-16 text-center text-muted">
          No clients yet. Add your first one to start tracking services.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => {
            const active = c.services.filter((s) => s.status === "active");
            const value = active.reduce((sum, s) => sum + monthlyValue(s.amount, s.billing_type), 0);
            return (
              <Link
                key={c.id}
                href={`/clients/${c.id}`}
                className="bg-surface border border-border rounded-2xl p-5 hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    {c.company && (
                      <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                        <Building2 size={12} />
                        {c.company}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">
                    {active.length} active service{active.length === 1 ? "" : "s"}
                  </span>
                  {value > 0 && <span className="font-medium">{formatMoney(value, "USD")}/mo</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
