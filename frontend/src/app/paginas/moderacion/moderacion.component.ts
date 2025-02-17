import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-moderacion',
  standalone: true,
  imports: [],
  templateUrl: './moderacion.component.html',
  styleUrls: ['./moderacion.component.css']
})
export class ModeracionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const permiso = localStorage.getItem('permiso');
    if (permiso !== "2" && permiso !== "3") {
      this.router.navigate(['home']);
    }
  }
}