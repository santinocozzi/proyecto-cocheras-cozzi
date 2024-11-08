import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientoService {
  private tarifaPorHora: number = 500; // Tarifa en pesos por hora
  
  calcularMonto(fechaIngreso: string): number {
    const ingreso = new Date(fechaIngreso);
    const salida = new Date();
    
    // Calculamos la diferencia en horas
    const diferencia = salida.getTime() - ingreso.getTime();
    const horas = Math.ceil(diferencia / (1000 * 60 * 60));
    
    // Calculamos el monto total
    return horas * this.tarifaPorHora;
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  }
}
