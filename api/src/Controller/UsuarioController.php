<?php

namespace App\Controller;

use App\Entity\Invitacion;
use App\Entity\Usuario;
use App\Entity\UsuarioAgregaUsuario;
use App\Entity\UsuarioManipulaLista;
use App\Entity\Lista;
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
                    'mensaje' => 'Usuario o contraseña incorrectos.'
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
        else if (!password_verify($contrasenia, $usuario->getContrasenia())) 
        {
            $respuestaJson = new JsonResponse
            (
                [
                    'mensaje' => 'Usuario o contraseña incorrectos.'
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
        else if ($usuario->getPermiso() === 0 || $usuario->getPermiso() === "0")
        {
            $respuestaJson = new JsonResponse
            (
                [
                    'mensaje' => 'Esta cuenta ha sido suspendida. Contacte con administración.'
                ],
                Response::HTTP_FORBIDDEN
            );
        }
        else 
        {
            $token = $JWTManager->create($usuario);
            
            $respuestaJson = new JsonResponse
            (
                [
                    'token' => $token,
                    'exito' => true,
                    'mensaje' => 'Inicio de sesión exitoso.',
                    'id' => $usuario->getId(),
                    'mail' => $usuario->getMail(),
                    'usuario' => $usuario->getUsuario(),
                    'verificado' => $usuario->isVerificado() ?? false,
                    'nombre' => $usuario->getNombre() ?? '',
                    'apellido_1' => $usuario->getApellido1() ?? '',
                    'apellido_2' => $usuario->getApellido2() ?? '',
                    'fechaNacimiento' => $usuario->getFechaNacimiento() ? $usuario->getFechaNacimiento()->format('Y-m-d') : '',
                    'pais' => $usuario->getPais() ?? '',
                    'profesion' => $usuario->getProfesion() ?? '',
                    'estudios' => $usuario->getEstudios() ?? '',
                    'idioma' => $usuario->getIdioma() ?? '',
                    'permiso' => $usuario->getPermiso() ?? 1
                ],
                Response::HTTP_OK
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
    public function agregarUsuario(Request $request, EntityManagerInterface $entityManager)
    {
        $respuestaJson = null;
        
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreUsuarioAgregar = $datosRecibidos['usuarioAgregar'];
        $usuarioID = $datosRecibidos['usuarioID'];  

        $usuario_1 = $entityManager->getRepository(Usuario::class)->find($usuarioID);
        $usuario_2 = $entityManager->getRepository(Usuario::class)->findOneBy(['usuario' => $nombreUsuarioAgregar]);

        if ($usuario_1 === $usuario_2) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "No puedes agregarte a ti mismo."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $invitacionExistente = $entityManager->getRepository(Invitacion::class)->findOneBy([
            'invitado' => $usuario_2,
            'invitador' => $usuario_1,
            'lista' => null
        ]);

        if ($invitacionExistente) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Ya existe una invitación para este usuario."
                ],
                Response::HTTP_CONFLICT
            );
        }

        $invitacion = new Invitacion();
        $invitacion->setInvitado($usuario_2);
        $invitacion->setInvitador($usuario_1);

        try {
            $entityManager->persist($invitacion);
            $entityManager->flush();
            
            $respuestaJson = new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Invitación de amistad enviada."
                ],
                Response::HTTP_CREATED
            );
        } catch (\Throwable $th) {
            $respuestaJson = new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al enviar la invitación de amistad."
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
    public function obtenerSolicitudes(Request $request, EntityManagerInterface $entityManager)
    {
        $respuestaJson = null;
        $datosRecibidos = json_decode($request->getContent(), true);
        $usuarioId = $datosRecibidos['id'];

        try {
            $solicitudesAmistad = $entityManager->getRepository(Invitacion::class)->findBy([
                'invitado' => $usuarioId,
                'lista' => null
            ]);

            $solicitudesLista = $entityManager->getRepository(Invitacion::class)->createQueryBuilder('i')
                ->where('i.invitado = :usuarioId')
                ->andWhere('i.lista IS NOT NULL')
                ->setParameter('usuarioId', $usuarioId)
                ->getQuery()
                ->getResult();

            $dataAmistad = [];
            $dataLista = [];

            foreach ($solicitudesAmistad as $solicitud) {
                $dataAmistad[] = [
                    'nombre' => $solicitud->getInvitador()->getUsuario(),
                ];
            }

            foreach ($solicitudesLista as $solicitud) {
                $dataLista[] = [
                    'nombre' => $solicitud->getLista()->getNombre(), 
                    'invitador' => $solicitud->getInvitador()->getUsuario()
                ];
            }

            $respuestaJson = new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => empty($dataAmistad) && empty($dataLista) ? "No existen solicitudes." : "Solicitudes obtenidas exitosamente.",
                    "solicitudes" => [
                        "amistad" => $dataAmistad,
                        "lista" => $dataLista
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
        
        $usuario = $entityManager->getRepository(Usuario::class)->find($idUsuario);
        
        if (!$usuario) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Usuario no encontrado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
        
        try {
            if ($tipo === 'amistad') {
                $usuario_2 = $entityManager->getRepository(Usuario::class)->findOneBy(['usuario' => $nombreSolicitud]);
                if (!$usuario_2) {
                    return new JsonResponse(
                        [
                            "exito" => false,
                            "mensaje" => "Usuario no encontrado."
                        ],
                        Response::HTTP_BAD_REQUEST
                    );
                }

                $invitacion = $entityManager->getRepository(Invitacion::class)->findOneBy([
                    'invitado' => $usuario,
                    'invitador' => $usuario_2,
                    'lista' => null
                ]);

                if ($invitacion) {
                    $nuevaRelacion = new UsuarioAgregaUsuario();
                    $nuevaRelacion->setUsuario1($usuario);
                    $nuevaRelacion->setUsuario2($usuario_2);

                    $entityManager->persist($nuevaRelacion);
                    $entityManager->remove($invitacion);  
                    $entityManager->flush();

                    return new JsonResponse(['exito' => true, 'mensaje' => 'Solicitud de amistad aceptada.'], Response::HTTP_OK);
                } else {
                    return new JsonResponse(['exito' => false, 'mensaje' => 'Solicitud de amistad no encontrada.'], Response::HTTP_NOT_FOUND);
                }
            } elseif ($tipo === 'lista') {
                $lista = $entityManager->getRepository(Lista::class)->findOneBy(['nombre' => $nombreSolicitud]);
                if (!$lista) {
                    return new JsonResponse(
                        [
                            "exito" => false,
                            "mensaje" => "Lista no encontrada."
                        ],
                        Response::HTTP_BAD_REQUEST
                    );
                }

                $invitacion = $entityManager->getRepository(Invitacion::class)->findOneBy([
                    'invitado' => $usuario,
                    'lista' => $lista
                ]);

                if ($invitacion) {
                    $usuarioManipulaLista = new UsuarioManipulaLista();
                    $usuarioManipulaLista->setLista($invitacion->getLista());
                    $usuarioManipulaLista->setUsuario($invitacion->getInvitado());
                    $usuarioManipulaLista->setMomentoManipulacion(new \DateTime()); 

                    $entityManager->persist($usuarioManipulaLista);
                    $entityManager->remove($invitacion);
                    $entityManager->flush();

                    return new JsonResponse(['exito' => true, 'mensaje' => 'Solicitud de acceso a la lista aceptada.'], Response::HTTP_OK);
                } else {
                    return new JsonResponse(['exito' => false, 'mensaje' => 'Solicitud de acceso a la lista no encontrada.'], Response::HTTP_NOT_FOUND);
                }
            }
        } catch (\Throwable $th) {
            error_log('Error al aceptar la solicitud: ' . $th->getMessage());
            return new JsonResponse(['exito' => false, 'mensaje' => 'Error al aceptar la solicitud.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route("/api/obtener-numero-solicitudes", name: "obtener_numero_solicitudes", methods: ["POST"])]
    public function obtenerNumeroSolicitudes(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $usuarioId = $datosRecibidos['id'];

        try {
            $solicitudesAmistad = $entityManager->getRepository(Invitacion::class)->findBy([
                'invitado' => $usuarioId,
                'lista' => null
            ]);

            $solicitudesLista = $entityManager->getRepository(Invitacion::class)->createQueryBuilder('i')
                ->where('i.invitado = :usuarioId')
                ->andWhere('i.lista IS NOT NULL')
                ->setParameter('usuarioId', $usuarioId)
                ->getQuery()
                ->getResult();

            $nuevasSolicitudes = count($solicitudesAmistad) + count($solicitudesLista);

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

    #[Route("/api/denegar-solicitud", name: "denegar_solicitud", methods: ["POST"])]
    public function denegarSolicitud(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreSolicitud = $datosRecibidos['nombre'];
        $idUsuario = $datosRecibidos['IDUsuario'];
        $tipo = $datosRecibidos['tipo'];
        
        $usuario = $entityManager->getRepository(Usuario::class)->find($idUsuario);
        
        if (!$usuario) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Usuario no encontrado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
        
        try {
            if ($tipo === 'amistad') {
                $usuario_2 = $entityManager->getRepository(Usuario::class)->findOneBy(['usuario' => $nombreSolicitud]);
                if (!$usuario_2) {
                    return new JsonResponse(
                        [
                            "exito" => false,
                            "mensaje" => "Usuario no encontrado."
                        ],
                        Response::HTTP_BAD_REQUEST
                    );
                }

                $invitacion = $entityManager->getRepository(Invitacion::class)->findOneBy([
                    'invitado' => $usuario,
                    'invitador' => $usuario_2,
                    'lista' => null
                ]);

                if ($invitacion) {
                    $entityManager->remove($invitacion);
                    $entityManager->flush();

                    return new JsonResponse(['exito' => true, 'mensaje' => 'Solicitud de amistad denegada.'], Response::HTTP_OK);
                } else {
                    return new JsonResponse(['exito' => false, 'mensaje' => 'Solicitud de amistad no encontrada.'], Response::HTTP_NOT_FOUND);
                }
            } elseif ($tipo === 'lista') {
                $lista = $entityManager->getRepository(Lista::class)->findOneBy(['nombre' => $nombreSolicitud]);
                if (!$lista) {
                    return new JsonResponse(
                        [
                            "exito" => false,
                            "mensaje" => "Lista no encontrada."
                        ],
                        Response::HTTP_BAD_REQUEST
                    );
                }

                $invitacion = $entityManager->getRepository(Invitacion::class)->findOneBy([
                    'invitado' => $usuario,
                    'lista' => $lista
                ]);

                if ($invitacion) {
                    $entityManager->remove($invitacion);
                    $entityManager->flush();

                    return new JsonResponse(['exito' => true, 'mensaje' => 'Solicitud de acceso a la lista denegada.'], Response::HTTP_OK);
                } else {
                    return new JsonResponse(['exito' => false, 'mensaje' => 'Solicitud de acceso a la lista no encontrada.'], Response::HTTP_NOT_FOUND);
                }
            }
        } catch (\Throwable $th) {
            return new JsonResponse(['exito' => false, 'mensaje' => 'Error al denegar la solicitud.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route("/api/buscar-usuarios-no-agregados", name: "buscar_usuarios_no_agregados", methods: ["POST"])]
    public function buscarUsuariosNoAgregados(Request $request, EntityManagerInterface $entityManager)
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

            $usuariosAgregados = $entityManager->createQueryBuilder()
                ->select('IDENTITY(ua.usuario_1) as usuario1, IDENTITY(ua.usuario_2) as usuario2')
                ->from(UsuarioAgregaUsuario::class, 'ua')
                ->where('ua.usuario_1 = :usuarioID OR ua.usuario_2 = :usuarioID')
                ->setParameter('usuarioID', $usuarioID)
                ->getQuery()
                ->getResult();

            $idsUsuariosAgregados = [];
            foreach ($usuariosAgregados as $usuarioAgregado) {
                $idsUsuariosAgregados[] = $usuarioAgregado['usuario1'];
                $idsUsuariosAgregados[] = $usuarioAgregado['usuario2'];
            }

            $usuariosInvitados = $entityManager->createQueryBuilder()
                ->select('IDENTITY(i.invitado) as invitado')
                ->from(Invitacion::class, 'i')
                ->where('i.invitador = :usuarioID OR i.invitado = :usuarioID')
                ->setParameter('usuarioID', $usuarioID)
                ->getQuery()
                ->getResult();

            foreach ($usuariosInvitados as $usuarioInvitado) {
                $idsUsuariosAgregados[] = $usuarioInvitado['invitado'];
            }

            $usuariosNoAgregados = $entityManager->createQueryBuilder()
                ->select('u')
                ->from(Usuario::class, 'u')
                ->where('u.usuario LIKE :query')
                ->andWhere('u.id != :usuarioID')
                ->andWhere('u.id NOT IN (:idsUsuariosAgregados)')
                ->setParameter('query', '%' . $query . '%')
                ->setParameter('usuarioID', $usuarioID)
                ->setParameter('idsUsuariosAgregados', $idsUsuariosAgregados ?: [0])
                ->getQuery()
                ->getResult();

            $dataUsuarios = [];
            foreach ($usuariosNoAgregados as $usuarioNoAgregado) {
                $dataUsuarios[] = [
                    'id' => $usuarioNoAgregado->getId(),
                    'nombre' => $usuarioNoAgregado->getUsuario()
                ];
            }

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Usuarios no agregados encontrados exitosamente.",
                    "usuarios" => $dataUsuarios
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al buscar usuarios no agregados.",
                    "usuarios" => []
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/obtener-amigos", name: "obtener_amigos", methods: ["POST"])]
    public function obtenerAmigos(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $usuarioID = $datosRecibidos['usuarioID'];

        if (!$usuarioID) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "ID de usuario no proporcionado."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

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

            $amistades = $entityManager->getRepository(UsuarioAgregaUsuario::class)->createQueryBuilder('ua')
                ->where('ua.usuario_1 = :usuarioID OR ua.usuario_2 = :usuarioID')
                ->setParameter('usuarioID', $usuarioID)
                ->getQuery()
                ->getResult();

            $dataAmigos = [];
            foreach ($amistades as $amistad) {
                if ($amistad->getUsuario1()->getId() === $usuarioID) {
                    $amigo = $amistad->getUsuario2();
                } else {
                    $amigo = $amistad->getUsuario1();
                }

                $dataAmigos[] = [
                    'id' => $amigo->getId(),
                    'nombre' => $amigo->getUsuario()
                ];
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

    #[Route("/api/buscar-amigos-no-manipulan-lista", name: "buscar_amigos_no_manipulan_lista", methods: ["POST"])]
    public function buscarAmigosNoManipulanLista(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $query = $datosRecibidos['query'];
        $usuarioID = $datosRecibidos['usuarioID'];
        $listaID = $datosRecibidos['listaID'];

        try {
            $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioID);
            if (!$usuario) {
                return new JsonResponse([
                    'exito' => false,
                    'mensaje' => 'Usuario no encontrado.',
                    'amigos' => []
                ]);
            }

            $qb = $entityManager->createQueryBuilder();
            $qb->select('u, CASE WHEN inv.id IS NOT NULL THEN true ELSE false END as tieneInvitacion')
            ->from(Usuario::class, 'u')
            ->innerJoin(UsuarioAgregaUsuario::class, 'uau', 'WITH', 
                $qb->expr()->orX(
                    $qb->expr()->andX(
                        $qb->expr()->eq('uau.usuario_1', ':usuario'),
                        $qb->expr()->eq('u.id', 'uau.usuario_2')
                    ),
                    $qb->expr()->andX(
                        $qb->expr()->eq('uau.usuario_2', ':usuario'),
                        $qb->expr()->eq('u.id', 'uau.usuario_1')
                    )
                )
            )
            ->leftJoin(Invitacion::class, 'inv', 'WITH', 
                $qb->expr()->andX(
                    $qb->expr()->eq('inv.invitado', 'u.id'),
                    $qb->expr()->eq('inv.invitador', ':usuario'),
                    $qb->expr()->eq('inv.lista', ':listaId')
                )
            )
            ->andWhere(
                $qb->expr()->not(
                    $qb->expr()->exists(
                        $entityManager->createQueryBuilder()
                            ->select('1')
                            ->from(UsuarioManipulaLista::class, 'uml')
                            ->where('uml.usuario = u.id')
                            ->andWhere('uml.lista = :listaId')
                            ->getDQL()
                    )
                )
            )
            ->setParameter('usuario', $usuario)
            ->setParameter('listaId', $listaID);

            if (!empty($query)) {
                $qb->andWhere(
                    $qb->expr()->orX(
                        $qb->expr()->like('u.usuario', ':query'),
                        $qb->expr()->like('u.nombre', ':query')
                    )
                )
                ->setParameter('query', '%' . $query . '%');
            }

            $results = $qb->getQuery()->getResult();

            $amigosArray = [];
            foreach ($results as $result) {
                $amigo = $result[0];
                $tieneInvitacion = $result['tieneInvitacion'];
                
                $amigosArray[] = [
                    'id' => $amigo->getId(),
                    'nombre' => $amigo->getUsuario(),
                    'tieneInvitacion' => $tieneInvitacion
                ];
            }

            return new JsonResponse([
                'exito' => true,
                'mensaje' => '',
                'amigos' => $amigosArray
            ]);
        } catch (\Throwable $th) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Error al buscar amigos: ' . $th->getMessage(),
                'amigos' => []
            ]);
        }
    }

    #[Route("/api/obtener-colaboradores/{listaId}", name: "obtener_colaboradores", methods: ["GET"])]
    public function obtenerColaboradores(int $listaId, EntityManagerInterface $entityManager)
    {
        try {
            $lista = $entityManager->getRepository(Lista::class)->find($listaId);
            if (!$lista) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Lista no encontrada."
                    ],
                    Response::HTTP_BAD_REQUEST
                );
            }

            $colaboradores = $entityManager->getRepository(UsuarioManipulaLista::class)->findBy(['lista' => $lista]);

            $dataColaboradores = [];
            foreach ($colaboradores as $colaborador) {
                $dataColaboradores[] = [
                    'id' => $colaborador->getUsuario()->getId(),
                    'nombre' => $colaborador->getUsuario()->getUsuario()
                ];
            }

            return new JsonResponse(
                [
                    "exito" => true,
                    "mensaje" => "Colaboradores obtenidos exitosamente.",
                    "colaboradores" => $dataColaboradores
                ],
                Response::HTTP_OK
            );
        } catch (\Throwable $th) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Error al obtener los colaboradores.",
                    "error" => $th->getMessage()
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route("/api/obtener-amigo-por-nombre/{nombreAmigo}", name: "obtener_amigo_por_nombre", methods: ["GET"])]
    public function obtenerAmigoPorNombre(string $nombreAmigo, EntityManagerInterface $entityManager)
    {
        $usuario = $entityManager->getRepository(Usuario::class)->findOneBy(['usuario' => $nombreAmigo]);

        if (!$usuario) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Amigo no encontrado."
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        return new JsonResponse(
            [
                "exito" => true,
                "amigo" => [
                    "id" => $usuario->getId(),
                    "nombre" => $usuario->getUsuario()
                ]
            ],
            Response::HTTP_OK
        );
    }

    #[Route("/api/eliminar-amistad", name: "eliminar_amistad", methods: ["POST"])]
    public function eliminarAmistad(Request $request, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);
        $usuarioID = $data['usuarioID'];
        $amigoID = $data['amigoID'];

        $usuario = $entityManager->getRepository(Usuario::class)->find($usuarioID);
        $amigo = $entityManager->getRepository(Usuario::class)->find($amigoID);

        if (!$usuario || !$amigo) {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Usuario no encontrado."
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        $amistad = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findOneBy([
            'usuario_1' => $usuario,
            'usuario_2' => $amigo
        ]);

        if (!$amistad) {
            $amistad = $entityManager->getRepository(UsuarioAgregaUsuario::class)->findOneBy([
                'usuario_1' => $amigo,
                'usuario_2' => $usuario
            ]);
        }

        if ($amistad) {
            try {
                $entityManager->remove($amistad);
                $entityManager->flush();

                return new JsonResponse(
                    [
                        "exito" => true,
                        "mensaje" => "Amistad eliminada exitosamente."
                    ],
                    Response::HTTP_OK
                );
            } catch (\Throwable $th) {
                return new JsonResponse(
                    [
                        "exito" => false,
                        "mensaje" => "Error al eliminar la amistad."
                    ],
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }
        } else {
            return new JsonResponse(
                [
                    "exito" => false,
                    "mensaje" => "Amistad no encontrada."
                ],
                Response::HTTP_NOT_FOUND
            );
        }
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
}