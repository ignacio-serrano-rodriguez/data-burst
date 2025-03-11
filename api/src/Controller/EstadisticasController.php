<?php
namespace App\Controller;

use App\Repository\EstadisticasRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class EstadisticasController extends AbstractController
{
    private $estadisticasRepository;

    public function __construct(EstadisticasRepository $estadisticasRepository)
    {
        $this->estadisticasRepository = $estadisticasRepository;
    }

    #[Route("/api/generar-estadisticas", name: "generar_estadisticas", methods: ["POST"])]
    public function generarEstadisticas(Request $request): JsonResponse
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombre = $datosRecibidos['categoria'] ?? null;
        $page = (int)($datosRecibidos['page'] ?? 1);
        $limit = (int)($datosRecibidos['limit'] ?? 10);

        if ($nombre === null) {
            return new JsonResponse(
                ["mensaje" => "Nombre de la lista no proporcionado."],
                Response::HTTP_BAD_REQUEST
            );
        }

        try {
            // Si la categoría está vacía, intentar hacer una búsqueda más flexible
            if (empty($nombre)) {
                // Buscar las categorías disponibles para sugerirlas al usuario
                $categorias = $this->estadisticasRepository->obtenerCategoriasDisponibles();
                return new JsonResponse(
                    [
                        "mensaje" => "Por favor, ingrese alguna de las siguientes categorías:",
                        "categorias_disponibles" => $categorias
                    ],
                    Response::HTTP_OK
                );
            }

            $masAgregado = $this->estadisticasRepository->obtenerMasAgregado(nombre: $nombre, page: $page, limit: $limit);
            $masAgregadoCount = $this->estadisticasRepository->obtenerMasAgregadoCount(nombre: $nombre);
            $masGustado = $this->estadisticasRepository->obtenerMasGustado(nombre: $nombre, page: $page, limit: $limit);
            $masGustadoCount = $this->estadisticasRepository->obtenerMasGustadoCount(nombre: $nombre);
            $menosGustado = $this->estadisticasRepository->obtenerMenosGustado(nombre: $nombre, page: $page, limit: $limit);
            $menosGustadoCount = $this->estadisticasRepository->obtenerMenosGustadoCount(nombre: $nombre);
            
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