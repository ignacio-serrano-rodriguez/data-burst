import { Amigo } from './Amigo';

export interface RespuestaBuscarUsuarios {
  exito: boolean;
  mensaje: string;
  usuarios: Amigo[];
}