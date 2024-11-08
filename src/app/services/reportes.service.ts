import { inject, Injectable } from '@angular/core';
import { Estacionamiento } from './../interfaces/estacionamiento';
import { AuthService } from './auth.service';
import { Reportes } from '../interfaces/reportes';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  auth = inject(AuthService);

  private nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  obtenerReportes(): Promise<Reportes[]> {
    return this.estacionamientos().then(estacionamientos => {
      const meses: Record<string, { usos: number; cobro: number }> = {};

      estacionamientos.sort((a, b) => new Date(a.horaIngreso).getTime() - new Date(b.horaIngreso).getTime());

      estacionamientos.forEach(estacionamiento => {
        if (estacionamiento.eliminado === null && estacionamiento.horaEgreso && estacionamiento.costo != null) {
          const fechaIngreso = new Date(estacionamiento.horaIngreso);
          const mesAño = `${fechaIngreso.getMonth() + 1}/${fechaIngreso.getFullYear()}`;

          if (!meses[mesAño]) {
            meses[mesAño] = { usos: 0, cobro: 0 };
          }

          meses[mesAño].usos += 1;
          meses[mesAño].cobro += estacionamiento.costo;
        }
      });

      return Object.entries(meses).map(([mes, { usos, cobro }]) => {
        const [mesIndex, año] = mes.split('/').map(Number);
        return {
          mes,
          nombreMes: this.nombresMeses[mesIndex - 1],
          ano: año,
          usos,
          cobro,
          a: null  
        };
      });
    });
  }

  estacionamientos(): Promise<Estacionamiento[]> {
    return fetch('http://localhost:4200/estacionamientos', {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
      },
    }).then(response => response.json());
  }
}