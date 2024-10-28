<?php

namespace App\Controller;

use App\Repository\UsuarioRepository;
use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

class UsuarioController extends AbstractController
{
    #[Route("/api/auth/signin", name: "signin", methods: ["POST"])]
    public function signin(
        Request $request, 
        UsuarioRepository $usuarioRepository, 
        JWTTokenManagerInterface $JWTManager) 
    {

        $data = json_decode($request->getContent(), true);
        $nombreUsuario = $data['usuario'];
        $contrasenia = $data['contrasenia'];
        $respuestaJson = null;

        $usuario = $usuarioRepository->findOneBy(['usuario' => $nombreUsuario]);

        if (!$usuario) 
        {
            $respuestaJson = new JsonResponse
            (
                [
                    "resultado" => "error",
                    "mensaje" => "Inicio de sesión fallido.",
                    'token' => ''
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        else if (!password_verify($contrasenia, $usuario->getContrasenia())) 
        {
            $respuestaJson = new JsonResponse
            (
                [
                    "resultado" => "error",
                    "mensaje" => "Inicio de sesión fallido.",
                    'token' => ''
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        else 
        {
            $token = $JWTManager->create($usuario);
            
            $respuestaJson = new JsonResponse
            (
                [
                    "resultado" => "exito",
                    "mensaje" => "Inicio de sesión exitoso.",
                    'token' => $token
                ],
                Response::HTTP_OK
            );
        }        

        return $respuestaJson;
    }

    #[Route("/api/auth/signup", name: "signup", methods: ["POST"])]
    public function signup(Request $request, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);
        $nombreUsuario = $data['usuario'];
        $mail = $data['mail'];
        $contrasenia = $data['contrasenia'];

        $usuario = new Usuario();
        $usuario->setUsuario($nombreUsuario);
        $usuario->setMail($mail);
        $usuario->setContrasenia($contrasenia);

        $entityManager->persist($usuario);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Usuario creado exitosamente.'], Response::HTTP_CREATED);
    }
}