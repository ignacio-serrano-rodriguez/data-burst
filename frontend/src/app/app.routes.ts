import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { HomeComponent } from './paginas/home/home.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { AdministracionComponent } from './paginas/administracion/administracion.component';
import { ErrorComponent } from './paginas/error/error.component';
import { EstadisticasComponent } from './paginas/estadisticas/estadisticas.component';
import { AmigoComponent } from './paginas/home/amigo/amigo.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'home', component: HomeComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'amigo', component: AmigoComponent },
  { path: '**', component: ErrorComponent }
];