<?php
namespace App\Controller;

use App\Repository\EstadisticasRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Categoria;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class EstadisticasController extends AbstractController
{
    private $estadisticasRepository;
    private $entityManager;

    public function __construct(EstadisticasRepository $estadisticasRepository, EntityManagerInterface $entityManager)
    {
        $this->estadisticasRepository = $estadisticasRepository;
        $this->entityManager = $entityManager;
    }

    #[Route("/api/generar-estadisticas", name: "generar_estadisticas", methods: ["POST"])]
    public function generarEstadisticas(Request $request): JsonResponse
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $categoriaId = $datosRecibidos['categoria_id'] ?? null;
        $page = (int)($datosRecibidos['page'] ?? 1);
        $limit = (int)($datosRecibidos['limit'] ?? 10);

        if ($categoriaId === null) {
            return new JsonResponse(
                ["mensaje" => "ID de categoría no proporcionado."],
                Response::HTTP_BAD_REQUEST
            );
        }

        try {
            // Verificar que la categoría existe
            $categoria = $this->entityManager->getRepository(Categoria::class)->find($categoriaId);
            
            if (!$categoria) {
                return new JsonResponse(
                    ["mensaje" => "La categoría especificada no existe."],
                    Response::HTTP_NOT_FOUND
                );
            }

            $masAgregado = $this->estadisticasRepository->obtenerMasAgregado($categoriaId, $page, $limit);
            $masAgregadoCount = $this->estadisticasRepository->obtenerMasAgregadoCount($categoriaId);
            $masGustado = $this->estadisticasRepository->obtenerMasGustado($categoriaId, $page, $limit);
            $masGustadoCount = $this->estadisticasRepository->obtenerMasGustadoCount($categoriaId);
            $menosGustado = $this->estadisticasRepository->obtenerMenosGustado($categoriaId, $page, $limit);
            $menosGustadoCount = $this->estadisticasRepository->obtenerMenosGustadoCount($categoriaId);
            
            return new JsonResponse(
                [
                    'masAgregado' => [
                        'items' => $masAgregado,
                        'total' => $masAgregadoCount
                    ],
                    'masGustado' => [
                        'items' => $masGustado,
                        'total' => $masGustadoCount
                    ],
                    'menosGustado' => [
                        'items' => $menosGustado,
                        'total' => $menosGustadoCount
                    ],
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "mensaje" => "Error al generar estadísticas.",
                    "error" => $th->getMessage()
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}