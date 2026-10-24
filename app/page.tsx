import Link from "next/link";
import { getAllServicesWithClient, getClients } from "@/lib/data";
import { formatMoney, formatDate, daysUntil, monthlyValue } from "@/lib/format";
import { StatusBadge, BillingBadge, DueBadge } from "@/components/Badges";
import { Users, Repeat, AlertTriangle, Wallet } from "lucide-react";

export default async function DashboardPage() {
  const clients = getClients();
  const services = getAllServicesWithClient();

  const activeServices = services.filter((s) => s.status === "active");
  const mrr = activeServices.reduce((sum, s) => sum + monthlyValue(s.amount, s.billing_type), 0);

  const upcoming = activeServices
    .map((s) => ({ ...s, days: daysUntil(s.due_date) }))
    .filter((s) => s.days !== null && s.days <= 30)
    .sort((a, b) => (a.days ?? 0) - (b.days ?? 0));

  const overdueCount = upcoming.filter((s) => (s.days ?? 0) < 0).length;

  const stats = [
    { label: "Clients", value: clients.length, icon: Users },
    { label: "Active services", value: activeServices.length, icon: Repeat },
    { label: "Est. monthly value", value: formatMoney(mrr, "USD"), icon: Wallet },
    { label: "Due within 30 days", value: upcoming.length, icon: AlertTriangle, alert: overdueCount > 0 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted mt-1">An overview of who you work with and what's coming due.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, alert }) => (
          <div key={label} className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted">{label}</span>
              <Icon size={16} className={alert ? "text-danger" : "text-muted"} />
            </div>
            <div className="font-serif text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-medium">Upcoming & overdue</h2>
          <span className="text-xs text-muted">Next 30 days</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted text-sm">
            Nothing due soon. Add a client to get started.
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {upcoming.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3">
                    <Link href={`/clients/${s.client_id}`} className="font-medium hover:text-accent">
                      {s.client_name}
                    </Link>
                    <div className="text-muted text-xs mt-0.5">{s.description}</div>
                  </td>
                  <td className="px-4 py-3">
                    <BillingBadge type={s.billing_type} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(s.due_date)}</td>
                  <td className="px-4 py-3">
                    <DueBadge days={s.days} />
                  </td>
                  <td className="px-6 py-3 text-right font-medium">{formatMoney(s.amount, s.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {clients.length === 0 && (
        <div className="mt-6 text-center">
          <Link
            href="/clients/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
          >
            Add your first client
          </Link>
        </div>
      )}
    </div>
  );
}
