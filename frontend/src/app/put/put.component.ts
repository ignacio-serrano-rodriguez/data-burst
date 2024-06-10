import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-put',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './put.component.html',
  styleUrls: ['./put.component.css']
})
export class PutComponent {
  httpClient = inject(HttpClient);

  ngOnInit() {
    const listaId = '18'; 

    const requestData = {
      nombre: 'Recetas',
      publica: true
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/ld+json');

    this.httpClient.put<any>(`http://127.0.0.1:8000/api/listas/${listaId}`, requestData, { headers })
      .subscribe({
        next: (data: any) => {
          // Handle the response data here
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
