import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent {
  httpClient = inject(HttpClient);

  ngOnInit() {
    const listaId = 19;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.delete<any>(`http://127.0.0.1:8000/api/listas/${listaId}`, { headers })
      .subscribe({
        next: () => {
          console.log(`'lista' with ID ${listaId} deleted successfully`);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
