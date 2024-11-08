import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Fila } from '../../interfaces/fila';
import { EstacionamientoService } from '../../services/estacionamiento.service';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule],
  templateUrl: './estado-cocheras.component.html',
  styleUrls: ['./estado-cocheras.component.scss']
})
export class EstadoCocherasComponent {
  titulo: string = 'Estado de las cocheras';
  header: {
    nro: string,
    disponibilidad: string,
    ingreso: string,
    acciones: string
  } = {
    nro: "Nro",
    disponibilidad: "Disponibilidad",
    ingreso: "Ingreso",
    acciones: "Acción"
  };

  filas: Fila[] = [];
  siguienteNumero: number = 1;

  constructor(private estacionamientoService: EstacionamientoService) {}

  async cerrarEstacionamiento(nroCochera: number) {
    const cocheraIndex = this.filas.findIndex(fila => fila.nro === nroCochera);
    if (cocheraIndex === -1 || !this.filas[cocheraIndex].patente) return;

    const cochera = this.filas[cocheraIndex];

    // Modal de confirmación
    const confirmResult = await Swal.fire({
      title: '¿Desea cerrar el estacionamiento?',
      text: `Patente: ${cochera.patente}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmResult.isConfirmed) {
      // Calculamos el monto
      const monto = this.estacionamientoService.calcularMonto(cochera.fechaIngresoCompleta);
      const montoFormateado = this.estacionamientoService.formatearMonto(monto);

      // Mostramos el modal con el monto
      await Swal.fire({
        title: 'Monto a pagar',
        html: `
          <div class="monto-details">
            <p>Patente: ${cochera.patente}</p>
            <p>Ingreso: ${cochera.ingresos}</p>
            <p>Salida: ${new Date().toLocaleString()}</p>
            <h3>Total: ${montoFormateado}</h3>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });

      // Liberamos la cochera
      this.filas[cocheraIndex].disponibilidad = true;
      this.filas[cocheraIndex].patente = undefined;
      this.filas[cocheraIndex].ingresos = '';
      this.filas[cocheraIndex].fechaIngresoCompleta = '';
    }
  }

  abrirModal(nroCochera: number) {
    const cocheraIndex = this.filas.findIndex(fila => fila.nro === nroCochera);
    if (cocheraIndex !== -1 && this.filas[cocheraIndex]) {
      const cochera = this.filas[cocheraIndex];
      
      // Si ya tiene patente, llamamos a cerrarEstacionamiento
      if (cochera.patente) {
        this.cerrarEstacionamiento(nroCochera);
        return;
      }

      const options: SweetAlertOptions = {
        title: `Asignar vehículo a la cochera ${nroCochera}`,
        input: 'text',
        inputLabel: 'Ingrese la patente del vehículo',
        inputValue: '',
        showCancelButton: true,
        confirmButtonText: 'Asignar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debes ingresar una patente válida';
          }
          return null;
        }
      };

      Swal.fire(options).then((result) => {
        if (result.isConfirmed) {
          const now = new Date();
          this.filas[cocheraIndex].patente = result.value;
          this.filas[cocheraIndex].disponibilidad = false;
          this.filas[cocheraIndex].ingresos = now.toLocaleDateString();
          this.filas[cocheraIndex].fechaIngresoCompleta = now.toISOString();
          Swal.fire('Asignado', 'El vehículo ha sido asignado a la cochera.', 'success');
        }
      });
    }
  }



  agregarFila() {
    this.filas.push({
      nro: this.siguienteNumero,
      disponibilidad: true,
      ingresos: '',
      fechaIngresoCompleta: '',
      acciones: "-",
      patente: undefined
    });
    this.siguienteNumero += 1;
  }
eliminarFila(numeroFila: number){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success", // no aparecen los diseños
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Confirma la acción",
    text: "Estas a punto de eliminar una cochera",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, borrar",
    cancelButtonText: "No, cancelar",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.filas.splice(numeroFila,1);
      swalWithBootstrapButtons.fire({
        title: "Eliminada",
        text: "La cochera ha sido eliminada.",
        icon: "success"
      });
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "La cochera no fue eliminada",
        icon: "error"
      });
    }
  });
}

toggleDisponibilidadCochera(numeroFila: number) {
  const cochera = this.filas[numeroFila];
  const estaOcupada = !cochera.disponibilidad || typeof cochera.disponibilidad === 'string';
  
  let titulo, texto, confirmText, successText, successMessage;

  if (estaOcupada) {
    titulo = "¿Deseas liberar esta cochera?";
    texto = cochera.patente 
      ? `Esto liberará la cochera ocupada por el vehículo ${cochera.patente}`
      : "Esto liberará la cochera";
    confirmText = "Sí, liberar";
    successText = "¡Liberada!";
    successMessage = "La cochera ahora está disponible.";
  } else {
    titulo = "¿Deseas deshabilitar esta cochera?";
    texto = "Esto marcará la cochera como no disponible";
    confirmText = "Sí, deshabilitar";
    successText = "¡Deshabilitada!";
    successMessage = "La cochera ahora está no disponible.";
  }

  Swal.fire({
    title: titulo,
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      if (estaOcupada) {
        cochera.disponibilidad = true; // Liberamos la cochera
        cochera.patente = undefined; // Limpiamos la patente
      } else {
        cochera.disponibilidad = false; // Deshabilitamos la cochera
      }
      Swal.fire(successText, successMessage, "success");
    }
  }).catch(error => {
    console.error("Error al cambiar la disponibilidad de la cochera:", error);
    Swal.fire("Error", "No se pudo cambiar la disponibilidad de la cochera.", "error");
  });
}}