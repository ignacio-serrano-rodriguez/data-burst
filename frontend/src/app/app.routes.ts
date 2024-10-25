import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [

	{path:"inicio", component:InicioComponent, pathMatch: "full"},
	{path:"home", component:HomeComponent, pathMatch: "full"},
	{path:"", component:InicioComponent, pathMatch: "full"},
	{path:"**", component:InicioComponent}

];