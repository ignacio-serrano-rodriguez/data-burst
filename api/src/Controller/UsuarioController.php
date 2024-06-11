<?php

namespace App\Controller;

use App\Repository\UsuarioRepository; // Import the UsuarioRepository class
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Routing\Attribute\Route as RouteAttribute;

class UsuarioController extends AbstractController
{
    #[RouteAttribute("/api/login", name: "api_login", methods: ["POST"])]
    public function login(Request $request, UsuarioRepository $usuarioRepository, JWTTokenManagerInterface $JWTManager)
    {
        $data = json_decode($request->getContent(), true);
        $usuario = $data['usuario'];
        $contrasenia = $data['contrasenia'];

        $usuario = $usuarioRepository->findOneBy(['usuario' => $usuario]);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Username not found'], Response::HTTP_BAD_REQUEST);
        }

        if (!password_verify($contrasenia, $usuario->getContrasenia())) {
            return new JsonResponse(['error' => 'Invalid password'], Response::HTTP_BAD_REQUEST);
        }
        
        $token = $JWTManager->create($usuario);

        return new JsonResponse(['token' => $token]);
    }
}
