import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiUrlTokens = 'https://api.openai.com/v1/usage';
  private apiUrlCredito = 'https://api.openai.com/v1/dashboard/billing/credit_grants';

  constructor(private http: HttpClient) { }
  
  generateText(chiave: string, modello: string, prompt: string, systemRole: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${chiave}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: modello, // Puoi usare 'gpt-3.5-turbo' o 'gpt-4' a seconda di quale modello desideri
      messages: [
        // { role: 'system', content: systemRole }, // Puoi aggiungere un messaggio di sistema opzionale
        { role: 'user', content: prompt }
      ],
      temperature: 0.0,
      seed: 1234,
      top_p: 0
      // max_tokens: 4096
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  ritornaTokens(chiave: string, myDate: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${chiave}`);
    const params = new HttpParams().set('date', myDate);  // Aggiungi il parametro 'date'

    return this.http.get<any>(this.apiUrlTokens, { headers, params });
  }

  ritornaCredito(chiave: string, myDate: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${chiave}`);
    const params = new HttpParams().set('date', myDate);  // Aggiungi il parametro 'date'

    return this.http.get<any>(this.apiUrlCredito, { headers, params });
  }
}
