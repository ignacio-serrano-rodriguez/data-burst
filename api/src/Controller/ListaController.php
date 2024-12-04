<?php

namespace App\Controller;

use App\Entity\Lista;
use App\Entity\InvitacionLista;
use App\Entity\Usuario;
use App\Entity\UsuarioManipulaLista;
use App\Entity\ListaContieneElemento;
use App\Entity\UsuarioElementoPositivo;
use App\Entity\UsuarioElementoComentario;
use App\Entity\Elemento;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ListaController extends AbstractController
{
    #[Route("/api/crear-asignar-lista", name: "crear_asignar_lista", methods: ["POST"])]
    public function crearAsignarLista(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreLista = $datosRecibidos['nombre'];
        $usuarioID = $datosRecibidos['usuarioID'];
        $publica = $datosRecibidos['publica'] ?? true; // Obtener la propiedad publica, por defecto true
        $respuestaJson = null;
    
        $lista = new Lista();
        $lista->setNombre($nombreLista);
        $lista->setPublica($publica);
    
        $usuarioManipulaLista = new UsuarioManipulaLista();
        $usuarioManipulaLista->setLista($lista);
        $usuarioManipulaLista->setUsuario(
            $entityManager->getRepository(Usuario::class)->find($usuarioID)
        );
    
        try {
            $entityManager->persist($lista);
            $entityManager->flush();
        
            $respuestaJson = new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Lista creada y asignada exitosamente."
                ],
                Response::HTTP_CREATED
            );
    
            $entityManager->persist($usuarioManipulaLista);
            $entityManager->flush();
        } catch (\Throwable $th) {
            $respuestaJson = new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Creación y asignación de la lista fallida."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    
        return $respuestaJson;
    }

    #[Route("/api/obtener-listas", name: "obtener_listas", methods: ["POST"])]
    public function obtenerListas(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $usuarioID = $datosRecibidos['usuarioID'];

        try {
            $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioID);
            if (!$usuario) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Usuario no encontrado."
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }

            $listasAsignadas = $entityManager->getRepository(UsuarioManipulaLista::class)->findBy(['usuario' => $usuario]);

            $dataListas = [];
            foreach ($listasAsignadas as $listaAsignada) {
                $lista = $listaAsignada->getLista();
                $compartida = count($entityManager->getRepository(UsuarioManipulaLista::class)->findBy(['lista' => $lista])) > 1;
                $dataListas[] = [
                    'id' => $lista->getId(),
                    'nombre' => $lista->getNombre(),
                    'publica' => $lista->isPublica(),
                    'compartida' => $compartida
                ];
            }

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Listas obtenidas exitosamente.",
                    "listas" => $dataListas
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al obtener listas."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/obtener-lista/{id}", name: "obtener_lista", methods: ["GET"])]
    public function obtenerLista(int $id, EntityManagerInterface $entityManager)
    {
        try {
            $lista = $entityManager->getRepository(Lista::class)->find($id);
            if (!$lista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

            $dataLista = [
                'id' => $lista->getId(),
                'nombre' => $lista->getNombre(),
                'publica' => $lista->isPublica() // Incluir la propiedad publica
            ];

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Lista obtenida exitosamente.",
                    "lista" => $dataLista
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al obtener la lista."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/buscar-listas", name: "buscar_listas", methods: ["POST"])]
    public function buscarListas(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $query = $datosRecibidos['query'];
        $usuarioID = $datosRecibidos['usuarioID'];

        try {
            $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioID);
            if (!$usuario) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Usuario no encontrado."
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Buscar listas cuyo nombre coincida con la consulta
            $listasAsignadas = $entityManager->getRepository(UsuarioManipulaLista::class)->findBy(['usuario' => $usuario]);

            $dataListas = [];
            foreach ($listasAsignadas as $listaAsignada) {
                $lista = $listaAsignada->getLista();
                if (stripos($lista->getNombre(), $query) !== false) {
                    $dataListas[] = [
                        'id' => $lista->getId(),
                        'nombre' => $lista->getNombre()
                    ];
                }
            }

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Listas encontradas exitosamente.",
                    "listas" => $dataListas
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al buscar listas."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/modificar-nombre-lista", name: "modificar_nombre_lista", methods: ["POST"])]
    public function modificarNombreLista(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $id = $datosRecibidos['id'];
        $nuevoNombre = $datosRecibidos['nuevoNombre'];

        try {
            $lista = $entityManager->getRepository(Lista::class)->find($id);
            if (!$lista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

            $lista->setNombre($nuevoNombre);
            $entityManager->flush();

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Nombre de la lista modificado exitosamente."
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al modificar el nombre de la lista."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/desasignar-lista", name: "desasignar_lista", methods: ["POST"])]
    public function desasignarLista(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $listaId = $datosRecibidos['listaId'];
        $usuarioId = $datosRecibidos['usuarioId'];

        try {
            $lista = $entityManager->getRepository(Lista::class)->find($listaId);
            $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioId);

            if (!$lista || !$usuario) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista o usuario no encontrado."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

            $usuarioManipulaLista = $entityManager->getRepository(UsuarioManipulaLista::class)->findOneBy([
                'lista' => $lista,
                'usuario' => $usuario
            ]);

            if (!$usuarioManipulaLista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "El usuario no está asignado a esta lista."
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }

            $entityManager->remove($usuarioManipulaLista);
            $entityManager->flush();

            // Verificar si hay más relaciones de usuarios con esta lista
            $relacionesRestantes = $entityManager->getRepository(UsuarioManipulaLista::class)->findBy(['lista' => $lista]);

            if (count($relacionesRestantes) === 0) {
                // Eliminar todas las relaciones entre la lista y los elementos
                $elementosRelacionados = $entityManager->getRepository(ListaContieneElemento::class)->findBy(['lista' => $lista]);
                foreach ($elementosRelacionados as $relacion) {
                    $entityManager->remove($relacion);
                }

                // Eliminar la lista
                $entityManager->remove($lista);
                $entityManager->flush();
            }

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Lista desasignada exitosamente."
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al desasignar la lista."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/cambiar-visibilidad-lista", name: "cambiar_visibilidad_lista", methods: ["POST"])]
    public function cambiarVisibilidadLista(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $id = $datosRecibidos['id'];
        $publica = $datosRecibidos['publica'];

        try {
            $lista = $entityManager->getRepository(Lista::class)->find($id);
            if (!$lista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

            $lista->setPublica($publica);
            $entityManager->flush();

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Visibilidad de la lista cambiada exitosamente."
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al cambiar la visibilidad de la lista."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/invitar-amigo", name: "invitar_amigo", methods: ["POST"])]
    public function invitarAmigo(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $listaId = $datosRecibidos['listaId'] ?? null;
        $amigoId = $datosRecibidos['amigoId'] ?? null;
        $invitadorId = $datosRecibidos['invitadorId'] ?? null;

        if ($listaId === null || $amigoId === null || $invitadorId === null) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Datos incompletos."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        try {
            $lista = $entityManager->getRepository(Lista::class)->find($listaId);
            $amigo = $entityManager->getRepository(Usuario::class)->find($amigoId);
            $invitador = $entityManager->getRepository(Usuario::class)->find($invitadorId);

            if (!$lista || !$amigo || !$invitador) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista o usuario no encontrado."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

            // Verificar si ya existe una invitación
            $invitacionExistente = $entityManager->getRepository(InvitacionLista::class)->findOneBy([
                'lista' => $lista,
                'invitado' => $amigo,
                'invitador' => $invitador
            ]);

            if ($invitacionExistente) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Ya existe una invitación para este usuario."
                    ],
                    Response::HTTP_CONFLICT
                );
            }

            $invitacion = new InvitacionLista();
            $invitacion->setLista($lista);
            $invitacion->setInvitado($amigo);
            $invitacion->setInvitador($invitador);

            $entityManager->persist($invitacion);
            $entityManager->flush();

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Invitación enviada exitosamente."
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al enviar la invitación."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/toggle-like-dislike", name: "toggle_like_dislike", methods: ["POST"])]
    public function toggleLikeDislike(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $listaId = $datosRecibidos['lista_id'];
        $elementoId = $datosRecibidos['elemento_id'];
        $positivo = $datosRecibidos['positivo'];
        $usuarioId = $datosRecibidos['usuario_id'];

        $lista = $entityManager->getRepository(Lista::class)->find($listaId);
        $elemento = $entityManager->getRepository(Elemento::class)->find($elementoId);
        $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioId);

        if (!$lista || !$elemento || !$usuario) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Lista, elemento o usuario no encontrado."
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        $usuarioElementoPositivo = $entityManager->getRepository(UsuarioElementoPositivo::class)->findOneBy([
            'usuario' => $usuario,
            'elemento' => $elemento
        ]);

        if (!$usuarioElementoPositivo) {
            $usuarioElementoPositivo = new UsuarioElementoPositivo();
            $usuarioElementoPositivo->setUsuario($usuario);
            $usuarioElementoPositivo->setElemento($elemento);
        }

        $usuarioElementoPositivo->setPositivo($positivo);
        $entityManager->persist($usuarioElementoPositivo);
        $entityManager->flush();

        return new JsonResponse(
            [
                "exito" => true,
                "mensaje" => "Estado de like/dislike actualizado exitosamente."
            ],
            Response::HTTP_OK
        );
    }

    #[Route("/api/actualizar-comentario", name: "actualizar_comentario", methods: ["POST"])]
    public function actualizarComentario(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $listaId = $datosRecibidos['lista_id'];
        $elementoId = $datosRecibidos['elemento_id'];
        $comentario = $datosRecibidos['comentario'];
        $usuarioId = $datosRecibidos['usuario_id'];

        $lista = $entityManager->getRepository(Lista::class)->find($listaId);
        $elemento = $entityManager->getRepository(Elemento::class)->find($elementoId);
        $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioId);

        if (!$lista || !$elemento || !$usuario) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Lista, elemento o usuario no encontrado."
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        $usuarioElementoComentario = $entityManager->getRepository(UsuarioElementoComentario::class)->findOneBy([
            'usuario' => $usuario,
            'elemento' => $elemento
        ]);

        if (!$usuarioElementoComentario) {
            $usuarioElementoComentario = new UsuarioElementoComentario();
            $usuarioElementoComentario->setUsuario($usuario);
            $usuarioElementoComentario->setElemento($elemento);
        }

        $usuarioElementoComentario->setComentario($comentario);
        $entityManager->persist($usuarioElementoComentario);
        $entityManager->flush();

        return new JsonResponse(
            [
                "exito" => true,
                "mensaje" => "Comentario actualizado exitosamente."
            ],
            Response::HTTP_OK
        );
    }

    #[Route("/api/obtener-elementos-lista/{listaId}", name: "obtener_elementos_lista", methods: ["GET"])]
    public function obtenerElementosLista(int $listaId, Request $request, EntityManagerInterface $entityManager)
    {
        $usuarioId = $request->query->get('usuario_id');
        $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioId);

        if (!$usuario) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Usuario no encontrado."
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        $lista = $entityManager->getRepository(Lista::class)->find($listaId);

        if (!$lista) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Lista no encontrada."
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        $elementos = $entityManager->getRepository(ListaContieneElemento::class)->findBy(['lista' => $lista]);

        $dataElementos = [];

        foreach ($elementos as $listaContieneElemento) {
            $elemento = $listaContieneElemento->getElemento();
            $usuariosManipulanLista = $entityManager->getRepository(UsuarioManipulaLista::class)->findBy(['lista' => $lista]);

            $usuariosComentariosPositivos = [];

            foreach ($usuariosManipulanLista as $usuarioManipulaLista) {
                $usuario = $usuarioManipulaLista->getUsuario();

                $usuarioElementoPositivo = $entityManager->getRepository(UsuarioElementoPositivo::class)->findOneBy([
                    'usuario' => $usuario,
                    'elemento' => $elemento
                ]);

                $usuarioElementoComentario = $entityManager->getRepository(UsuarioElementoComentario::class)->findOneBy([
                    'usuario' => $usuario,
                    'elemento' => $elemento
                ]);

                $usuariosComentariosPositivos[] = [
                    'usuario_id' => $usuario->getId(),
                    'usuario' => $usuario->getUsuario(), // Asegurarse de obtener el nombre del usuario
                    'positivo' => $usuarioElementoPositivo ? $usuarioElementoPositivo->getPositivo() : null,
                    'comentario' => $usuarioElementoComentario ? $usuarioElementoComentario->getComentario() : null
                ];
            }

            $dataElementos[] = [
                'id' => $elemento->getId(),
                'nombre' => $elemento->getNombre(),
                'fecha_aparicion' => $elemento->getFechaAparicion()->format('Y-m-d'),
                'informacion_extra' => $elemento->getInformacionExtra(),
                'puntuacion' => $elemento->getPuntuacion(),
                'descripcion' => $elemento->getDescripcion(),
                'momento_creacion' => $elemento->getMomentoCreacion()->format('Y-m-d H:i:s'),
                'usuariosComentariosPositivos' => $usuariosComentariosPositivos
            ];
        }

        return new JsonResponse(
            [
                "exito" => true,
                "mensaje" => "Elementos de la lista encontrados.",
                "elementos" => $dataElementos
            ],
            Response::HTTP_OK
        );
    }
}