import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { Token } from '@angular/compiler';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

   datosLogin:Login = {
     username: '',
     password: ''
   }

   router = inject(Router);

   Login() {
    console.log("Login");
    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.datosLogin),
    }).then(res => {
      res.json().then(data => {
        if (data.status === "ok") {
          this.router.navigate(["/estado-cocheras"]);
          localStorage.setItem("token", data.token);   // Se guarda solo el token y no todo el objeto
        }
      else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario o contraseña incorrecto",
      });
    }
    
  })
 })

 .catch((error) => {
  console.error("Error en la solicitud:", error);
  Swal.fire({
    icon: "error",
    title: "Error de conexión",
    text: "No se pudo conectar con el servidor",
  });
});

  console.log("Termino Login");
 }

}
