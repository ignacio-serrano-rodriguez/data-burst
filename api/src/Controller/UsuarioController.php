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
        $respuestaJson = null;
        $datosRecibidos = json_decode($request->getContent(), true);

        $nombreUsuario = $datosRecibidos['usuario'];
        $mail = $datosRecibidos['mail'];
        $contrasenia = $datosRecibidos['contrasenia'];

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

    #[Route("/api/modificar-datos-usuario", name: "modificar_datos_usuario", methods: ["POST"])]
    public function modificarDatosUsuario
    (
        Request $request, 
        EntityManagerInterface $entityManager
    )
    {
        $respuestaJson = null;
        $datosRecibidos = json_decode($request->getContent(), true);

        $id = $datosRecibidos['id'];
        $usuario = $entityManager->getRepository(Usuario::class)->find($id);
        if (!$usuario) 
        {
            return new JsonResponse
            (
                [
                    "exito" => false,
                    "mensaje" => "Modificación del usuario fallida."
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        $contrasenia_actual = $datosRecibidos['contrasenia_actual'];
        if (!password_verify($contrasenia_actual, $usuario->getContrasenia())) 
        {
            return new JsonResponse
            (
                [
                    "exito" => false,
                    "mensaje" => "Contraseña actual incorrecta."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $mail = $datosRecibidos['mail'];
        $nombreUsuario = $datosRecibidos['usuario'];
        $nombre = $datosRecibidos['nombre'];
        $apellido_1 = $datosRecibidos['apellido_1'];
        $apellido_2 = $datosRecibidos['apellido_2'];
        $pais = $datosRecibidos['pais'];
        $idioma = $datosRecibidos['idioma'];
        $profesion = $datosRecibidos['profesion'];
        $fecha_nacimiento = $datosRecibidos['fecha_nacimiento'];
        $nueva_contrasenia = $datosRecibidos['nueva_contrasenia'];

        if (!empty($nombreUsuario)) 
        {
            $usuario->setUsuario($nombreUsuario);
        }
        if (!empty($mail)) 
        {
            $usuario->setMail($mail);
        }
        if (!empty($nombre)) 
        {
            $usuario->setNombre($nombre);
        }
        if (!empty($apellido_1)) 
        {
            $usuario->setApellido1($apellido_1);
        }
        if (!empty($apellido_2)) 
        {
            $usuario->setApellido2($apellido_2);
        }
        if (!empty($pais)) 
        {
            $usuario->setPais($pais);
        }
        if (!empty($idioma)) 
        {
            $usuario->setIdioma($idioma);
        }
        if (!empty($profesion))
        {
            $usuario->setProfesion($profesion);
        }
        if (!empty($fecha_nacimiento)) 
        {
            try 
            {
                $fechaNacimientoFormateada = new \DateTime($fecha_nacimiento);
            } 
            catch (\Exception $e) 
            {
                $fechaNacimientoFormateada = null;
            }

            $usuario->setFechaNacimiento($fechaNacimientoFormateada);
        }
        if (!empty($nueva_contrasenia)) 
        {
            $usuario->setContrasenia($nueva_contrasenia);
        }

        try 
        {
            $entityManager->persist($usuario);
            $entityManager->flush();
        
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => true,
                    "mensaje" => "Usuario modificado exitosamente."
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
                    "mensaje" => "Modificación del usuario fallida."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $respuestaJson;
    }

    #[Route("/api/obtener-solicitudes", name: "obtener_solicitudes", methods: ["POST"])]
    public function obtenerSolicitudes
    (
        Request $request, 
        EntityManagerInterface $entityManager
    )
    {
        $respuestaJson = null;
        $datosRecibidos = json_decode($request->getContent(), true);
        $usuarioId = $datosRecibidos['id'];

        try {
            // Obtener las solicitudes de amistad donde usuario_2_id coincide con el ID proporcionado
            $solicitudesAmistad = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findBy(['usuario_2' => $usuarioId]);

            $dataAmistad = [];
            $dataLista = []; // Mantener la estructura para futuras implementaciones

            foreach ($solicitudesAmistad as $solicitud) {
                // Verificar que no exista un registro con los IDs intercambiados
                $solicitudAceptada = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findOneBy([
                    'usuario_1' => $usuarioId,
                    'usuario_2' => $solicitud->getUsuario1()->getId()
                ]);

                if (!$solicitudAceptada) {
                    $dataAmistad[] = [
                        'nombre' => $solicitud->getUsuario1()->getUsuario(), // Asumiendo que 'usuario' es el nombre de usuario
                    ];
                }
            }

            $respuestaJson = new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => empty($dataAmistad) && empty($dataLista) ? "No existen solicitudes." : "Solicitudes obtenidas exitosamente.",
                    "solicitudes" => [
                        "amistad" => $dataAmistad,
                        "lista" => $dataLista // Mantener la estructura para futuras implementaciones
                    ]
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            $respuestaJson = new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "No se han podido obtener las solicitudes."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $respuestaJson;
    }

    #[Route("/api/aceptar-solicitud", name: "aceptar_solicitud", methods: ["POST"])]
    public function aceptarSolicitud(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreSolicitud = $datosRecibidos['nombre'];
        $idUsuario = $datosRecibidos['IDUsuario'];
        $tipo = $datosRecibidos['tipo'];
    
        $usuario_1 = $entityManager->getRepository(Usuario::class)->find($idUsuario);
        $usuario_2 = $entityManager->getRepository(Usuario::class)->findOneBy(['usuario' => $nombreSolicitud]);
    
        if (!$usuario_1 || !$usuario_2) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Usuario no encontrado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    
        try {
            // Obtener la solicitud de amistad
            $solicitud = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findOneBy([
                'usuario_2' => $usuario_1,
                'usuario_1' => $usuario_2
            ]);
    
            if ($solicitud) {
                // Lógica para aceptar la solicitud
                // Por ejemplo, crear una nueva relación de amistad
                $nuevaRelacion = new UsuarioAgregaUsuario();
                $nuevaRelacion->setUsuario1($usuario_1);
                $nuevaRelacion->setUsuario2($usuario_2);
                $entityManager->persist($nuevaRelacion);
                $entityManager->flush();
    
                return new JsonResponse(['exito' => true, 'mensaje' => 'Solicitud aceptada.'], Response::HTTP_OK);
            } else {
                return new JsonResponse(['exito' => false, 'mensaje' => 'Solicitud no encontrada.'], Response::HTTP_NOT_FOUND);
            }
        } catch (\Throwable $th) {
            return new JsonResponse(['exito' => false, 'mensaje' => 'Error al aceptar la solicitud.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    #[Route("/api/denegar-solicitud", name: "denegar_solicitud", methods: ["POST"])]
    public function denegarSolicitud(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreSolicitud = $datosRecibidos['nombre'];
        $idUsuario = $datosRecibidos['IDUsuario'];
        $tipo = $datosRecibidos['tipo'];
    
        $usuario_1 = $entityManager->getRepository(Usuario::class)->find($idUsuario);
        $usuario_2 = $entityManager->getRepository(Usuario::class)->findOneBy(['usuario' => $nombreSolicitud]);
    
        if (!$usuario_1 || !$usuario_2) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Usuario no encontrado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    
        try {
            // Obtener la solicitud de amistad
            $solicitud = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findOneBy([
                'usuario_2' => $usuario_1,
                'usuario_1' => $usuario_2
            ]);
    
            if ($solicitud) {
                // Lógica para denegar la solicitud
                $entityManager->remove($solicitud);
                $entityManager->flush();
    
                return new JsonResponse(['exito' => true, 'mensaje' => 'Solicitud denegada.'], Response::HTTP_OK);
            } else {
                return new JsonResponse(['exito' => false, 'mensaje' => 'Solicitud no encontrada.'], Response::HTTP_NOT_FOUND);
            }
        } catch (\Throwable $th) {
            return new JsonResponse(['exito' => false, 'mensaje' => 'Error al denegar la solicitud.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route("/api/obtener-amigos", name: "obtener_amigos", methods: ["POST"])]
    public function obtenerAmigos(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $usuarioID = $datosRecibidos['usuarioID'];

        try {
            $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioID);
            if (!$usuario) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Usuario no encontrado."
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Obtener las solicitudes de amistad enviadas por el usuario
            $solicitudesEnviadas = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findBy(['usuario_1' => $usuario]);

            $dataAmigos = [];
            foreach ($solicitudesEnviadas as $solicitud) {
                $usuario2 = $solicitud->getUsuario2();

                // Verificar si existe una solicitud de amistad en sentido contrario
                $solicitudRecibida = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findOneBy([
                    'usuario_1' => $usuario2,
                    'usuario_2' => $usuario
                ]);

                if ($solicitudRecibida) {
                    $dataAmigos[] = [
                        'nombre' => $usuario2->getUsuario()
                    ];
                }
            }

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Amigos obtenidos exitosamente.",
                    "amigos" => $dataAmigos
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al obtener amigos."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/obtener-numero-solicitudes", name: "obtener_numero_solicitudes", methods: ["POST"])]
    public function obtenerNumeroSolicitudes(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $usuarioId = $datosRecibidos['id'];

        try {
            // Obtener las solicitudes de amistad donde usuario_2_id coincide con el ID proporcionado
            $solicitudesAmistad = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findBy(['usuario_2' => $usuarioId]);

            $nuevasSolicitudes = 0;

            foreach ($solicitudesAmistad as $solicitud) {
                // Verificar que no exista un registro con los IDs intercambiados
                $solicitudAceptada = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findOneBy([
                    'usuario_1' => $usuarioId,
                    'usuario_2' => $solicitud->getUsuario1()->getId()
                ]);

                if (!$solicitudAceptada) {
                    $nuevasSolicitudes++;
                }
            }

            return new JsonResponse(
                [
                    "nuevasSolicitudes" => $nuevasSolicitudes
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "No se han podido obtener las solicitudes."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    #[Route("/api/buscar-amigos", name: "buscar_amigos", methods: ["POST"])]
    public function buscarAmigos(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $query = $datosRecibidos['query'];
        $usuarioID = $datosRecibidos['usuarioID'];

        try {
            $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioID);
            if (!$usuario) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Usuario no encontrado."
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Buscar amigos que el usuario ha agregado y cuyo nombre coincida con la consulta
            $amigos = $entityManager->getRepository(Usuario::class)->createQueryBuilder('u')
                ->innerJoin('u.usuarioAgregaUsuarios', 'ua')
                ->where('ua.usuario_1 = :usuarioID')
                ->andWhere('u.usuario LIKE :query')
                ->andWhere('u.id != :usuarioID') // Asegurarse de que el usuario no aparezca en los resultados
                ->setParameter('query', '%' . $query . '%')
                ->setParameter('usuarioID', $usuarioID)
                ->getQuery()
                ->getResult();

            $dataAmigos = [];
            foreach ($amigos as $amigo) {
                $dataAmigos[] = [
                    'id' => $amigo->getId(),
                    'nombre' => $amigo->getUsuario()
                ];
            }

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Amigos encontrados exitosamente.",
                    "amigos" => $dataAmigos
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al buscar amigos."
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
}
}