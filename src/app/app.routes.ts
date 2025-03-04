import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { AuthGuard } from './auth.guard';
import { PreciosComponent } from './pages/precios/precios.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
        canActivate: [AuthGuard] // Permite el acceso solo si no está logueado
    },
    {
        path: "estado-cocheras",
        component: EstadoCocherasComponent,
        canActivate: [AuthGuard] // Permite el acceso solo si no está logueado
    },
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "reportes",
        component: ReportesComponent,
        canActivate: [AuthGuard] // Permite el acceso solo si no está logueado
    },
    {
        path: 'precios',
        component: PreciosComponent,
        canActivate: [AuthGuard] // Permite el acceso solo si no está logueado
      },
];
