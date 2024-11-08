import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Precios } from '../interfaces/precios';

@Injectable({
  providedIn: 'root'
})
export class PreciosService {
  private apiUrl = 'http://localhost:4200/precios';

  constructor(private authService: AuthService) {}

  obtenerPrecios(): Promise<Precios[]> {
    return fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    })
    .then(response => response.json())
    .then(data => data as Precios[]);
  }

  actualizarPrecio(id: number, costo: number): Promise<Precios> {
    return fetch(`${this.apiUrl}/${id}`, {
            method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      },
      body: JSON.stringify({ costo })
    })
    .then(response => response.json())
    .then(data => data as Precios);
  }
}