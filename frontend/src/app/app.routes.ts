import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
	{path:"", component:LoginComponent},
	{path:"login", component:LoginComponent},
	{path:"registro", component:RegistroComponent},
	{path:"home", component:HomeComponent}
];
