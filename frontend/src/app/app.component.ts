import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GetComponent } from './get/get.component';
import { ExampleComponent } from './example/example.component';
import { DeleteComponent } from './delete/delete.component';
import { PutComponent } from './put/put.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GetComponent, ExampleComponent, DeleteComponent, PutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Data Burst';
}
