<?php

namespace App\Controller;

use App\Entity\Elemento;
use App\Entity\Usuario;
use App\Entity\Lista;
use App\Entity\ListaContieneElemento;
use App\Entity\ListaCategoria; 
use App\Entity\ElementoCategoria; 
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ElementoController extends AbstractController
{
    #[Route("/api/buscar-elementos", name: "buscar_elementos", methods: ["POST"])]
    public function buscarElementos(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $query = $datosRecibidos['query'] ?? '';
        $listaId = $datosRecibidos['lista_id'] ?? null;

        if (empty($query)) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "La consulta de búsqueda está vacía.",
                    "elementos" => []
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $qb = $entityManager->getRepository(Elemento::class)->createQueryBuilder('e');

        if ($listaId) {
            $lista = $entityManager->getRepository(Lista::class)->find($listaId);
            
            if (!$lista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista no encontrada.",
                        "elementos" => []
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }
            
            $listaCategorias = $entityManager->getRepository(ListaCategoria::class)->findBy(['lista' => $lista]);
            
            if (empty($listaCategorias)) {
                return new JsonResponse(
                    [
                        "exito" => true,
                        "mensaje" => "No hay categorías asociadas a esta lista.",
                        "elementos" => []
                    ],
                    Response::HTTP_OK
                );
            }
            
            $categoriaIds = [];
            foreach ($listaCategorias as $listaCategoria) {
                $categoriaIds[] = $listaCategoria->getCategoria()->getId();
            }
            
            $qb->join('App\Entity\ElementoCategoria', 'ec', 'WITH', 'ec.elemento = e.id')
            ->where('e.nombre LIKE :query')
            ->andWhere($qb->expr()->notIn('e.id', 
                    $entityManager->getRepository(ListaContieneElemento::class)->createQueryBuilder('lce')
                        ->select('IDENTITY(lce.elemento)')
                        ->where('lce.lista = :listaId')
                        ->getDQL()
                ))
            ->andWhere('ec.categoria IN (:categoriaIds)')
            ->setParameter('query', '%' . $query . '%')
            ->setParameter('listaId', $listaId)
            ->setParameter('categoriaIds', $categoriaIds)
            ->distinct();
        } else {
            $qb->where('e.nombre LIKE :query')
                ->setParameter('query', '%' . $query . '%');
        }

        $elementos = $qb->getQuery()->getResult();

        $dataElementos = [];
        foreach ($elementos as $elemento) {
            $dataElementos[] = [
                'id' => $elemento->getId(),
                'nombre' => $elemento->getNombre(),
                'fecha_aparicion' => $elemento->getFechaAparicion()->format('Y-m-d'),
                'descripcion' => $elemento->getDescripcion(),
                'momento_creacion' => $elemento->getMomentoCreacion()->format('Y-m-d H:i:s')
            ];
        }

        return new JsonResponse(
            [
                "exito" => true,
                "mensaje" => "Elementos encontrados.",
                "elementos" => $dataElementos
            ],
            Response::HTTP_OK
        );
    }

    #[Route("/api/crear-elemento", name: "crear_elemento", methods: ["POST"])]
    public function crearElemento(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);

        $usuario = $entityManager->getRepository(Usuario::class)->find($datosRecibidos['usuario_id']);
        if (!$usuario) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Usuario no encontrado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $elemento = new Elemento();
        $elemento->setNombre($datosRecibidos['nombre']);
        $elemento->setFechaAparicion(new \DateTime($datosRecibidos['fecha_aparicion']));
        $elemento->setDescripcion($datosRecibidos['descripcion']);
        $elemento->setMomentoCreacion(new \DateTime());
        $elemento->setUsuario($usuario);

        try {
            $entityManager->persist($elemento);
            $entityManager->flush();

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Elemento creado exitosamente.",
                    "elemento" => [
                        'id' => $elemento->getId(),
                        'nombre' => $elemento->getNombre(),
                        'fecha_aparicion' => $elemento->getFechaAparicion()->format('Y-m-d'),
                        'descripcion' => $elemento->getDescripcion(),
                        'momento_creacion' => $elemento->getMomentoCreacion()->format('Y-m-d H:i:s')
                    ]
                ],
                Response::HTTP_CREATED
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al crear el elemento: " . $th->getMessage()
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/asignar-elemento", name: "asignar_elemento", methods: ["POST"])]
    public function asignarElemento(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);

        $lista = $entityManager->getRepository(Lista::class)->find($datosRecibidos['lista_id']);
        $elemento = $entityManager->getRepository(Elemento::class)->find($datosRecibidos['elemento_id']);

        if (!$lista || !$elemento) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Lista o elemento no encontrado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $listaContieneElemento = new ListaContieneElemento();
        $listaContieneElemento->setLista($lista);
        $listaContieneElemento->setElemento($elemento);
        $listaContieneElemento->setMomentoContencion(new \DateTime());

        try {
            $entityManager->persist($listaContieneElemento);
            $entityManager->flush();

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Elemento asignado a la lista exitosamente."
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al asignar el elemento a la lista: " . $th->getMessage()
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/quitar-elemento", name: "quitar_elemento", methods: ["POST"])]
    public function quitarElemento(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);

        $lista = $entityManager->getRepository(Lista::class)->find($datosRecibidos['lista_id']);
        $elemento = $entityManager->getRepository(Elemento::class)->find($datosRecibidos['elemento_id']);

        if (!$lista || !$elemento) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Lista o elemento no encontrado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $listaContieneElemento = $entityManager->getRepository(ListaContieneElemento::class)->findOneBy([
            'lista' => $lista,
            'elemento' => $elemento
        ]);

        if (!$listaContieneElemento) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "El elemento no está asignado a la lista."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        try {
            $entityManager->remove($listaContieneElemento);
            $entityManager->flush();

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Elemento quitado de la lista exitosamente."
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al quitar el elemento de la lista: " . $th->getMessage()
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}