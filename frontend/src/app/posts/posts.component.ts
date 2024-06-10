import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  httpClient = inject(HttpClient);

  ngOnInit() {

    this.httpClient.get<any>('http://127.0.0.1:8000/api/listas')
      .subscribe({
        next: (data: any) => {
          let lista = data['hydra:member'];

          lista.forEach((element: any) => {
            console.log("id: " + element.id);
            console.log("nombre: " + element.nombre);
            console.log("publica: " + element.publica);
          });

        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
