import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const permiso = localStorage.getItem('permiso');
      if (permiso !== "3") {
        this.router.navigate(['home']);
      }
    } else {
      this.router.navigate(['home']);
    }
  }
}