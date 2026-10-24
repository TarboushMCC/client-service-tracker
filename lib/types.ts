export type BillingType = "monthly" | "yearly" | "lifetime" | "one_time";
export type ServiceStatus = "active" | "paused" | "completed" | "cancelled";

export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  client_id: string;
  description: string;
  billing_type: BillingType;
  amount: number;
  currency: string;
  start_date: string | null;
  due_date: string | null;
  status: ServiceStatus;
  notes: string | null;
  created_at: string;
}

export interface ClientWithServices extends Client {
  services: Service[];
}
