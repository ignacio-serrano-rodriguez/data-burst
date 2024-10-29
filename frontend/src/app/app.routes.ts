import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { HomeComponent } from './paginas/home/home.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { AdministracionComponent } from './paginas/administracion/administracion.component';
import { ErrorComponent } from './paginas/error/error.component';
import { EstadisticasComponent } from './paginas/estadisticas/estadisticas.component';

export const routes: Routes = [

	{path:"inicio", component:InicioComponent},
	{path:"home", component:HomeComponent},
	{path:"perfil", component:PerfilComponent},
	{path:"estadisticas", component:EstadisticasComponent},
	{path:"administracion", component:AdministracionComponent},
	{path:"", component:InicioComponent, pathMatch: "full"},
	{path:"**", component:ErrorComponent}

];