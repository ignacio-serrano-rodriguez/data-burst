import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-get',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.css']
})
export class GetComponent {
  httpClient = inject(HttpClient);

  ngOnInit() {
    const listaId = '1'; // Replace 'your-lista-id' with the actual ID of the 'lista' you want to retrieve

    this.httpClient.get<any>(`http://127.0.0.1:8000/api/listas/${listaId}`)
      .subscribe({
        next: (data: any) => {
          console.log("id: " + data.id);
          console.log("nombre: " + data.nombre);
          console.log("publica: " + data.publica);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}