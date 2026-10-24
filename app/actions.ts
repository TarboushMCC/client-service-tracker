"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import type { BillingType, ServiceStatus } from "@/lib/types";

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed === "" ? null : trimmed;
}

export async function createClient(formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Name is required");

  const id = randomUUID();
  db.prepare(
    `INSERT INTO clients (id, name, company, email, phone, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    name,
    str(formData, "company"),
    str(formData, "email"),
    str(formData, "phone"),
    str(formData, "notes"),
    new Date().toISOString()
  );

  revalidatePath("/");
  revalidatePath("/clients");
  return id;
}

export async function updateClient(id: string, formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Name is required");

  db.prepare(
    `UPDATE clients SET name = ?, company = ?, email = ?, phone = ?, notes = ? WHERE id = ?`
  ).run(name, str(formData, "company"), str(formData, "email"), str(formData, "phone"), str(formData, "notes"), id);

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
}

export async function deleteClient(id: string) {
  db.prepare("DELETE FROM clients WHERE id = ?").run(id);
  revalidatePath("/");
  revalidatePath("/clients");
}

export async function createService(clientId: string, formData: FormData) {
  const description = str(formData, "description");
  if (!description) throw new Error("Description is required");

  const id = randomUUID();
  db.prepare(
    `INSERT INTO services (id, client_id, description, billing_type, amount, currency, start_date, due_date, status, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    clientId,
    description,
    (str(formData, "billing_type") ?? "monthly") as BillingType,
    Number(formData.get("amount") ?? 0),
    str(formData, "currency") ?? "USD",
    str(formData, "start_date"),
    str(formData, "due_date"),
    (str(formData, "status") ?? "active") as ServiceStatus,
    str(formData, "notes"),
    new Date().toISOString()
  );

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
}

export async function updateService(id: string, clientId: string, formData: FormData) {
  const description = str(formData, "description");
  if (!description) throw new Error("Description is required");

  db.prepare(
    `UPDATE services SET description = ?, billing_type = ?, amount = ?, currency = ?, start_date = ?, due_date = ?, status = ?, notes = ?
     WHERE id = ?`
  ).run(
    description,
    (str(formData, "billing_type") ?? "monthly") as BillingType,
    Number(formData.get("amount") ?? 0),
    str(formData, "currency") ?? "USD",
    str(formData, "start_date"),
    str(formData, "due_date"),
    (str(formData, "status") ?? "active") as ServiceStatus,
    str(formData, "notes"),
    id
  );

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
}

export async function deleteService(id: string, clientId: string) {
  db.prepare("DELETE FROM services WHERE id = ?").run(id);
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
}
