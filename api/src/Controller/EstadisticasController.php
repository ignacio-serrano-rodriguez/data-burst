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

        if ($nombre === null) {
            return new JsonResponse(
                ["mensaje" => "Nombre de la lista no proporcionado."],
                Response::HTTP_BAD_REQUEST
            );
        }

        try {
            // Lógica para obtener las estadísticas
            $masAgregado = $this->estadisticasRepository->obtenerMasAgregado($nombre);
            $masGustado = $this->estadisticasRepository->obtenerMasGustado($nombre);
            $menosGustado = $this->estadisticasRepository->obtenerMenosGustado($nombre);

            return new JsonResponse(
                [
                    'masAgregado' => $masAgregado,
                    'masGustado' => $masGustado,
                    'menosGustado' => $menosGustado
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