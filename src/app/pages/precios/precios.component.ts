import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { Precios } from '../../interfaces/precios';

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent implements OnInit {
  // Defino las tarifas como variables
  precios: Precios[] = [
    { id: 1, categoria: 'Plan Básico', costo: 500.00 },
    { id: 2, categoria: 'Plan Premium', costo: 1000.00 },
    { id: 3, categoria: 'Plan Empresarial', costo: 1500.00 }
  ];

  precioSeleccionado: Precios = { id: 0, categoria: '', costo: 0 };
  mostrarModal = false;
  nuevoCosto: number = 0;

  ngOnInit() {}

  abrirModal(precio: Precios) {
    this.precioSeleccionado = precio;
    this.nuevoCosto = precio.costo;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.precioSeleccionado = { id: 0, categoria: '', costo: 0 };
    this.nuevoCosto = 0;
  }

  guardarCambios() {
  if (this.precioSeleccionado) {
    // Actualizo el precio seleccionado
    this.precioSeleccionado.costo = this.nuevoCosto;
    const index = this.precios.findIndex(p => p.id === this.precioSeleccionado.id);
    if (index !== -1) {
      this.precios[index] = this.precioSeleccionado;
    }
    this.cerrarModal();
  }
}

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(monto);
  }
}