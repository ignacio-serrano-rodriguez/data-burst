<?php
namespace App\Controller;
use App\Entity\Lista;
use App\Entity\Usuario;
use App\Entity\UsuarioManipulaLista;
use App\Entity\ListaContieneElemento;
use App\Entity\UsuarioElementoPuntuacion;
use App\Entity\UsuarioElementoComentario;
use App\Entity\Elemento;
use App\Entity\Invitacion;
use App\Entity\Categoria;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ListaController extends AbstractController
{
    #[Route("/api/obtener-categorias", name: "obtener_categorias", methods: ["GET"])]
    public function obtenerCategorias(EntityManagerInterface $entityManager)
    {
        try {
            $categorias = $entityManager->getRepository(Categoria::class)->findAll();
            
            $categoriasData = [];
            foreach ($categorias as $categoria) {
                $categoriasData[] = [
                    'id' => $categoria->getId(),
                    'nombre' => $categoria->getNombre()
                ];
            }
            
            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Categorías obtenidas exitosamente.",
                    "categorias" => $categoriasData
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al obtener categorías: " . $th->getMessage()
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/crear-asignar-lista", name: "crear_asignar_lista", methods: ["POST"])]
    public function crearAsignarLista(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreLista = $datosRecibidos['nombre'];
        $usuarioID = $datosRecibidos['usuarioID'];
        $publica = $datosRecibidos['publica'] ?? true;
        $categoriaId = $datosRecibidos['categoria_id'] ?? null;
        
        $respuestaJson = null;

        try {
            if (empty($categoriaId)) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Debe seleccionar una categoría para la lista."
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }

            $categoria = $entityManager->getRepository(Categoria::class)->find($categoriaId);
            if (!$categoria) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Categoría no encontrada."
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }

            $lista = new Lista();
            $lista->setNombre($nombreLista);
            $lista->setCategoria($categoria);

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

            $usuarioManipulaLista = new UsuarioManipulaLista();
            $usuarioManipulaLista->setLista($lista);
            $usuarioManipulaLista->setUsuario($usuario);
            $usuarioManipulaLista->setPublica($publica);
            $usuarioManipulaLista->setMomentoManipulacion(new \DateTime());

            $entityManager->persist($lista);
            $entityManager->persist($usuarioManipulaLista);
            $entityManager->flush();

            $respuestaJson = new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Lista creada y asignada exitosamente.",
                    "lista" => [
                        "id" => $lista->getId(),
                        "nombre" => $lista->getNombre(),
                        "publica" => $usuarioManipulaLista->isPublica(),
                        "categoria" => [
                            'id' => $categoria->getId(),
                            'nombre' => $categoria->getNombre()
                        ]
                    ]
                ],
                Response::HTTP_CREATED
            );
        } catch (\Throwable $th) {
            $respuestaJson = new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Creación y asignación de la lista fallida: " . $th->getMessage()
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

        if (!$usuarioID) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "ID de usuario no proporcionado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

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
                
                $categoria = $lista->getCategoria();
                $categoriaData = null;
                
                if ($categoria) {
                    $categoriaData = [
                        'id' => $categoria->getId(),
                        'nombre' => $categoria->getNombre()
                    ];
                }
                
                $dataListas[] = [
                    'id' => $lista->getId(),
                    'nombre' => $lista->getNombre(),
                    'publica' => $listaAsignada->isPublica(),
                    'compartida' => $compartida,
                    'categoria' => $categoriaData
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
                    "mensaje" => "Error al obtener listas: " . $th->getMessage()
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/obtener-lista", name: "obtener_lista", methods: ["POST"])]
    public function obtenerLista(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $listaId = $datosRecibidos['lista_id'] ?? null;
        $usuarioId = $datosRecibidos['usuario_id'] ?? null;

        if ($listaId === null || $usuarioId === null) {
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
            if (!$lista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

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

            $usuarioManipulaLista = $entityManager->getRepository(UsuarioManipulaLista::class)->findOneBy([
                'lista' => $lista,
                'usuario' => $usuario
            ]);

            if (!$usuarioManipulaLista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Relación usuario-lista no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }
            
            $categoria = $lista->getCategoria();
            $categoriaData = null;
            
            if ($categoria) {
                $categoriaData = [
                    'id' => $categoria->getId(),
                    'nombre' => $categoria->getNombre()
                ];
            }

            $dataLista = [
                'id' => $lista->getId(),
                'nombre' => $lista->getNombre(),
                'publica' => $usuarioManipulaLista->isPublica(),
                'categoria' => $categoriaData
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
                    "mensaje" => "Error al obtener la lista: " . $th->getMessage()
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

            $relacionesRestantes = $entityManager->getRepository(UsuarioManipulaLista::class)->findBy(['lista' => $lista]);

            if (count($relacionesRestantes) === 0) {
                $elementosRelacionados = $entityManager->getRepository(ListaContieneElemento::class)->findBy(['lista' => $lista]);
                foreach ($elementosRelacionados as $relacion) {
                    $entityManager->remove($relacion);
                }

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
        $listaId = $datosRecibidos['lista_id'] ?? null;
        $usuarioId = $datosRecibidos['usuario_id'] ?? null;
        $publica = $datosRecibidos['publica'] ?? null;

        if ($listaId === null || $usuarioId === null || $publica === null) {
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
            if (!$lista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

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

            $usuarioManipulaLista = $entityManager->getRepository(UsuarioManipulaLista::class)->findOneBy([
                'lista' => $lista,
                'usuario' => $usuario
            ]);

            if (!$usuarioManipulaLista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Relación usuario-lista no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

            $usuarioManipulaLista->setPublica($publica);
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

        if ($amigoId === null || $invitadorId === null) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Datos incompletos."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        try {
            $amigo = $entityManager->getRepository(Usuario::class)->find($amigoId);
            $invitador = $entityManager->getRepository(Usuario::class)->find($invitadorId);

            if (!$amigo || !$invitador) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Usuario no encontrado."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

            $invitacionExistente = $entityManager->getRepository(Invitacion::class)->findOneBy([
                'invitado' => $amigo,
                'invitador' => $invitador,
                'lista' => $listaId ? $entityManager->getRepository(Lista::class)->find($listaId) : null
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

            $invitacion = new Invitacion();
            $invitacion->setInvitado($amigo);
            $invitacion->setInvitador($invitador);
            if ($listaId) {
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
                $invitacion->setLista($lista);
            }

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
        $puntuacion = $datosRecibidos['puntuacion'];
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

        $UsuarioElementoPuntuacion = $entityManager->getRepository(UsuarioElementoPuntuacion::class)->findOneBy([
            'usuario' => $usuario,
            'elemento' => $elemento
        ]);

        if (!$UsuarioElementoPuntuacion) {
            $UsuarioElementoPuntuacion = new UsuarioElementoPuntuacion();
            $UsuarioElementoPuntuacion->setUsuario($usuario);
            $UsuarioElementoPuntuacion->setElemento($elemento);
        }

        $UsuarioElementoPuntuacion->setpuntuacion($puntuacion);
        $entityManager->persist($UsuarioElementoPuntuacion);
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

            $usuariosComentariosPuntuaciones = [];

            foreach ($usuariosManipulanLista as $usuarioManipulaLista) {
                $usuario = $usuarioManipulaLista->getUsuario();

                $UsuarioElementoPuntuacion = $entityManager->getRepository(UsuarioElementoPuntuacion::class)->findOneBy([
                    'usuario' => $usuario,
                    'elemento' => $elemento
                ]);

                $usuarioElementoComentario = $entityManager->getRepository(UsuarioElementoComentario::class)->findOneBy([
                    'usuario' => $usuario,
                    'elemento' => $elemento
                ]);

                $usuariosComentariosPuntuaciones[] = [
                    'usuario_id' => $usuario->getId(),
                    'usuario' => $usuario->getUsuario(),
                    'puntuacion' => $UsuarioElementoPuntuacion ? $UsuarioElementoPuntuacion->getpuntuacion() : null,
                    'comentario' => $usuarioElementoComentario ? $usuarioElementoComentario->getComentario() : null
                ];
            }

            $dataElementos[] = [
                'id' => $elemento->getId(),
                'nombre' => $elemento->getNombre(),
                'fecha_aparicion' => $elemento->getFechaAparicion()->format('Y-m-d'),
                'descripcion' => $elemento->getDescripcion(),
                'momento_creacion' => $elemento->getMomentoCreacion()->format('Y-m-d H:i:s'),
                'usuariosComentariosPuntuaciones' => $usuariosComentariosPuntuaciones
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

    #[Route("/api/actualizar-categorias-lista", name: "actualizar_categorias_lista", methods: ["POST"])]
    public function actualizarCategoriasLista(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $listaId = $datosRecibidos['lista_id'] ?? null;
        $categoriaId = $datosRecibidos['categoria_id'] ?? null;
        $usuarioId = $datosRecibidos['usuario_id'] ?? null;

        if ($listaId === null || $usuarioId === null || $categoriaId === null) {
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
            if (!$lista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }

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

            $usuarioManipulaLista = $entityManager->getRepository(UsuarioManipulaLista::class)->findOneBy([
                'lista' => $lista,
                'usuario' => $usuario
            ]);

            if (!$usuarioManipulaLista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "No tienes permisos para editar esta lista."
                    ],
                    Response::HTTP_FORBIDDEN
                );
            }

            $categoria = $entityManager->getRepository(Categoria::class)->find($categoriaId);
            if (!$categoria) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Categoría no encontrada."
                    ],
                    Response::HTTP_NOT_FOUND
                );
            }
            
            $lista->setCategoria($categoria);
            $entityManager->flush();
            
            $categoriaData = [
                'id' => $categoria->getId(),
                'nombre' => $categoria->getNombre()
            ];

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Categoría de la lista actualizada exitosamente.",
                    "categoria" => $categoriaData
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al actualizar categoría: " . $th->getMessage()
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}