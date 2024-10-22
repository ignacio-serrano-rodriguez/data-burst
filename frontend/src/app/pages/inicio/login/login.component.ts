import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {MatCardModule} from '@angular/material/card'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatButtonModule} from '@angular/material/button'; 

import { LoginService } from '../../../services/login.service';
import { Login } from '../../../interfaces/Login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private loginService = inject(LoginService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    usuario:['',Validators.required],
    contrasenia:['',Validators.required]
  })

  iniciarSesion(){
    if(this.formLogin.invalid)return;

    const objeto:Login={
      usuario:this.formLogin.value.usuario,
      contrasenia:this.formLogin.value.contrasenia
    }

    this.loginService.login(objeto).subscribe({
      next:(data)=>{
        if(data.token != ''){
          localStorage.setItem("token",data.token);
          this.router.navigate(['home']);
        }
      },
      error:(error) =>{
        console.log(error.message);
        alert('Credenciales no válidas.');
      }

    })
  }
}