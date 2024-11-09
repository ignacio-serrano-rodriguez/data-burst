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
    #[Route("/api/login", name: "login", methods: ["POST"])]
    public function login
    (
        Request $request, 
        UsuarioRepository $usuarioRepository, 
        JWTTokenManagerInterface $JWTManager
    ) 
    {

        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreUsuario = $datosRecibidos['usuario'];
        $contrasenia = $datosRecibidos['contrasenia'];
        $respuestaJson = null;

        $usuario = $usuarioRepository->findOneBy(['usuario' => $nombreUsuario]);

        if (!$usuario) 
        {
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => false,
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
                    "exito" => false,
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
                    "exito" => true,
                    "mensaje" => "Inicio de sesión exitoso.",
                    'token' => $token
                ],
                Response::HTTP_OK
            );
        }        

        return $respuestaJson;
    }

    #[Route("/api/registro", name: "registro", methods: ["POST"])]
    public function registro
    (
        Request $request, 
        EntityManagerInterface $entityManager
    )
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreUsuario = $datosRecibidos['usuario'];
        $mail = $datosRecibidos['mail'];
        $contrasenia = $datosRecibidos['contrasenia'];
        $respuestaJson = null;

        $usuario = new Usuario();
        $usuario->setUsuario($nombreUsuario);
        $usuario->setMail($mail);
        $usuario->setContrasenia($contrasenia);

        try 
        {
            $entityManager->persist($usuario);
            $entityManager->flush();
        
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => true,
                    "mensaje" => "Usuario creado exitosamente."
                ],
                Response::HTTP_CREATED
            );
        } 
        
        catch (\Throwable $th) 
        {
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => false,
                    "mensaje" => "Registro fallido."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $respuestaJson;
    }

    #[Route("/api/validar-token", name: "validar_token", methods: ["POST"])]
    public function validarToken(Request $request, JWTTokenManagerInterface $JWTManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $token = $datosRecibidos['token'];
        $respuestaJson = null;

        try 
        {
            $data = $JWTManager->parse($token);

            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => true,
                    "mensaje" => "Token válido."
                ],
                Response::HTTP_OK
            );
        } 
        catch (\Exception $e) 
        {
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => false,
                    "mensaje" => "Token inválido."
                ],
                Response::HTTP_UNAUTHORIZED
            );
        }

        return $respuestaJson;
    }
}