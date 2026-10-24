import { db } from "./db";
import type { Client, Service, ClientWithServices } from "./types";

export function getClients(): Client[] {
  return db.prepare("SELECT * FROM clients ORDER BY name COLLATE NOCASE ASC").all() as Client[];
}

export function getClient(id: string): Client | undefined {
  return db.prepare("SELECT * FROM clients WHERE id = ?").get(id) as Client | undefined;
}

export function getServicesForClient(clientId: string): Service[] {
  return db
    .prepare("SELECT * FROM services WHERE client_id = ? ORDER BY due_date IS NULL, due_date ASC")
    .all(clientId) as Service[];
}

export function getClientWithServices(id: string): ClientWithServices | undefined {
  const client = getClient(id);
  if (!client) return undefined;
  return { ...client, services: getServicesForClient(id) };
}

export function getAllClientsWithServices(): ClientWithServices[] {
  const clients = getClients();
  return clients.map((c) => ({ ...c, services: getServicesForClient(c.id) }));
}

export function getAllServicesWithClient(): (Service & { client_name: string })[] {
  return db
    .prepare(
      `SELECT s.*, c.name as client_name
       FROM services s JOIN clients c ON c.id = s.client_id
       ORDER BY s.due_date IS NULL, s.due_date ASC`
    )
    .all() as (Service & { client_name: string })[];
}
