import { Lista } from './Lista';

export interface UsuarioManipulaLista {
  id: number;
  usuario_id: number;
  lista: Lista;
  publica: boolean;
  momento_manipulacion: string; // Agregar la propiedad momento_manipulacion
}