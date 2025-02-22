<?php

namespace App\Controller;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AdministracionController extends AbstractController
{
    #[Route("/api/obtener-usuarios", name: "obtener_usuarios", methods: ["POST"])]
    public function obtenerUsuarios(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            // Obtener todos los usuarios sin tener en cuenta relaciones de amistad
            $usuarios = $entityManager->getRepository(Usuario::class)->findAll();
            
            // Construir un arreglo con los datos de cada usuario
            $usuariosData = [];
            foreach ($usuarios as $usuario) {
                $usuariosData[] = [
                    'id' => $usuario->getId(),
                    'usuario' => $usuario->getUsuario(),
                    'mail' => $usuario->getMail(),
                    'permiso' => $usuario->getPermiso(),
                ];
            }

            return new JsonResponse([
                'exito' => true,
                'usuarios' => $usuariosData
            ]);
        } catch (\Throwable $th) {
            return new JsonResponse([
                'exito' => false,
                'error' => $th->getMessage()
            ]);
        }
    }
}