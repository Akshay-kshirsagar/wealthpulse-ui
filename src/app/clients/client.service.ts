import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { apiConfig } from '../core/api.config';
import { Client, ClientPayload } from './client.models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.gatewayBaseUrl}/clients`;
  private clients = [...mockClients];

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl).pipe(catchError(() => of(this.clients)));
  }

  getClientById(id: string): Observable<Client | undefined> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`).pipe(catchError(() => of(this.clients.find((client) => client.id === id))));
  }

  addClient(data: ClientPayload): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, data).pipe(
      catchError(() => {
        const client: Client = { ...data, id: `client-${Date.now()}`, aum: data.aum ?? 0 };
        this.clients = [client, ...this.clients];
        return of(client);
      })
    );
  }

  updateClient(id: string, data: ClientPayload): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, data).pipe(
      catchError(() => {
        const updated: Client = { ...data, id, aum: data.aum ?? this.clients.find((client) => client.id === id)?.aum ?? 0 };
        this.clients = this.clients.map((client) => (client.id === id ? updated : client));
        return of(updated);
      })
    );
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        this.clients = this.clients.filter((client) => client.id !== id);
        return of(undefined);
      }),
      map(() => undefined)
    );
  }
}

const mockClients: Client[] = [
  { id: 'c-1001', name: 'Ananya Sharma', pan: 'ABCDE1234F', email: 'ananya@example.com', mobile: '9876543210', riskProfile: 'Moderate', address: 'Mumbai, Maharashtra', aum: 24500000 },
  { id: 'c-1002', name: 'Rohan Mehta', pan: 'PQRSX9876L', email: 'rohan@example.com', mobile: '9876501234', riskProfile: 'High', address: 'Bengaluru, Karnataka', aum: 38400000 },
  { id: 'c-1003', name: 'Priya Nair', pan: 'LMNOP4567Q', email: 'priya@example.com', mobile: '9988776655', riskProfile: 'Low', address: 'Kochi, Kerala', aum: 12600000 }
];
