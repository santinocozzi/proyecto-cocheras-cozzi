import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReportesComponent } from "./pages/reportes/reportes.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReportesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyecto-cocheras';
}
