import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
	{path:"", component:LoginComponent},
	{path:"login", component:LoginComponent},
	{path:"registro", component:RegistroComponent},
	{path:"perfil", component:PerfilComponent}
];
