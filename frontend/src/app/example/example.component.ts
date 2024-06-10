import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  httpClient = inject(HttpClient);

  ngOnInit() {
    const requestData = {
      nombre: 'Series',
      publica: false
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/ld+json');

    this.httpClient.post<any>('http://127.0.0.1:8000/api/listas', requestData, { headers })
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
