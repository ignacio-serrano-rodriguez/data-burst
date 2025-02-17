import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [],
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