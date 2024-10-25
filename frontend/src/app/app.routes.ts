import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [

	{path:"inicio", component:InicioComponent},
	{path:"home", component:HomeComponent},
	{path:"perfil", component:PerfilComponent},
	{path:"administracion", component:AdministracionComponent},
	{path:"", component:InicioComponent, pathMatch: "full"},
	{path:"**", component:ErrorComponent}

];