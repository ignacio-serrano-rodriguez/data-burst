import { Routes } from '@angular/router';

import { InicioComponent } from './paginas/inicio/inicio.component';
import { HomeComponent } from './paginas/home/home.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { AdministracionComponent } from './paginas/administracion/administracion.component';
import { ErrorComponent } from './paginas/error/error.component';
import { EstadisticasComponent } from './paginas/estadisticas/estadisticas.component';
import { AmigoComponent } from './paginas/home/amigo/amigo.component';

import { authGuard } from './guardianes/auth.guard';

export const routes: Routes = [
  { path: "", component: InicioComponent },
  { path: "home", component: HomeComponent, canActivate: [authGuard] },
  { path: "perfil", component: PerfilComponent, canActivate: [authGuard] },
  { path: "estadisticas", component: EstadisticasComponent, canActivate: [authGuard] },
  { path: "administracion", component: AdministracionComponent, canActivate: [authGuard] },
  { path: ":nombreUsuario", component: AmigoComponent, canActivate: [authGuard] },
  { path: "**", component: ErrorComponent, canActivate: [authGuard] }
];