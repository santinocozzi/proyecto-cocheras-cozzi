import { Component, OnInit } from '@angular/core'; 
import { ReportesService } from '../../services/reportes.service'; 
import { HeaderComponent } from "../../components/header/header.component";
import { Reportes } from '../../interfaces/reportes';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  estacionamientos = [
    { id: 1, horaIngreso: '2023-04-01T10:00:00', horaEgreso: '2023-04-01T11:00:00', costo: 5, eliminado: null },
    { id: 2, horaIngreso: '2023-04-02T14:30:00', horaEgreso: '2023-04-02T15:45:00', costo: 7, eliminado: null },
    { id: 3, horaIngreso: '2023-04-15T09:00:00', horaEgreso: '2023-04-15T10:30:00', costo: 6, eliminado: '2023-04-16T09:00:00' },
    { id: 4, horaIngreso: '2023-05-01T11:00:00', horaEgreso: '2023-05-01T12:30:00', costo: 8, eliminado: null },
    { id: 5, horaIngreso: '2023-05-15T13:45:00', horaEgreso: '2023-05-15T15:00:00', costo: 9, eliminado: null },
    { id: 6, horaIngreso: '2023-06-01T10:00:00', horaEgreso: '2023-06-01T11:30:00', costo: 6, eliminado: null }
  ];

  nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  obtenerReportes() {
    const meses: Record<string, { usos: number; cobro: number }> = {};

    this.estacionamientos.sort((a, b) => new Date(a.horaIngreso).getTime() - new Date(b.horaIngreso).getTime());

    this.estacionamientos.forEach(estacionamiento => {
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
  }

  reportes = this.obtenerReportes();
}