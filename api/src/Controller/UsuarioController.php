<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Entity\UsuarioAgregaUsuario;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UsuarioRepository;
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
                    'token' => $token,

                    'id' => $usuario->getId(),
                    'mail' => $usuario->getMail(),
                    'usuario' => $usuario->getUsuario(),
                    'verificado' => $usuario->isVerificado(),
                    'nombre' => $usuario->getNombre(),
                    'apellido_1' => $usuario->getApellido1(),
                    'apellido_2' => $usuario->getApellido2(),
                    'fechaNacimiento' => $usuario->getFechaNacimiento(),
                    'pais' => $usuario->getPais(),
                    'profesion' => $usuario->getProfesion(),
                    'estudios' => $usuario->getEstudios(),
                    'idioma' => $usuario->getIdioma(),
                    'permiso' => $usuario->getPermiso()

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
    public function validarToken
    (
        Request $request, 
        JWTTokenManagerInterface $JWTManager
    )
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $token = $datosRecibidos['token'];
        $respuestaJson = null;

        try 
        {
            $JWTManager->parse($token);

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

    #[Route("/api/agregar-usuario", name: "agregar_usuario", methods: ["POST"])]
    public function agregarUsuario
    (
        Request $request, 
        EntityManagerInterface $entityManager
    )
    {
        $respuestaJson = null;
        
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreUsuarioAgregar = $datosRecibidos['usuarioAgregar'];
        $usuarioID = $datosRecibidos['usuarioID'];  

        $usuario_1 = $entityManager->
            getRepository(Usuario::class)->find($usuarioID);
        $usuario_2 = $entityManager->
            getRepository(Usuario::class)->findOneBy(['usuario' => $nombreUsuarioAgregar]);

        if ($usuario_1 === $usuario_2) 
        {
            return new JsonResponse
            (
                [
                    "exito" => false,
                    "mensaje" => "No puedes agregarte a ti mismo."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $usuarioAgregaUsuario = new UsuarioAgregaUsuario();
        $usuarioAgregaUsuario->setUsuario1($usuario_1);
        $usuarioAgregaUsuario->setUsuario2($usuario_2);

        try 
        {
            $entityManager->persist($usuarioAgregaUsuario);
            $entityManager->flush();
            
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => true,
                    "mensaje" => "Petición de amistad enviada."
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
                    "mensaje" => "Petición de amistad ya enviada o usuario inexistente."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $respuestaJson;
    }
}