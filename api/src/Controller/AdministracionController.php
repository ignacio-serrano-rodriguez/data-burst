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

    #[Route("/api/actualizar-permiso", name: "actualizar_permiso", methods: ["POST"])]
    public function actualizarPermiso(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $datos = json_decode($request->getContent(), true);
            $usuarioId = $datos['usuarioId'] ?? null;
            $permiso = $datos['permiso'] ?? null;

            if (!$usuarioId || $permiso === null) {
                return new JsonResponse([
                    'exito' => false,
                    'error' => 'Datos incompletos'
                ]);
            }

            $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioId);
            if (!$usuario) {
                return new JsonResponse([
                    'exito' => false,
                    'error' => 'Usuario no encontrado'
                ]);
            }

            $usuario->setPermiso($permiso);
            $entityManager->flush();

            return new JsonResponse([
                'exito' => true,
                'mensaje' => 'Permiso actualizado correctamente'
            ]);
        } catch (\Throwable $th) {
            return new JsonResponse([
                'exito' => false,
                'error' => $th->getMessage()
            ]);
        }
    }
}