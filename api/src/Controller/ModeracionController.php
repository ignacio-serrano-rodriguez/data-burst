<?php

namespace App\Controller;

use App\Entity\Elemento;
use App\Entity\Usuario;
use App\Entity\UsuarioReportaElemento;
use App\Entity\UsuarioGestionaElemento;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ModeracionController extends AbstractController
{
    #[Route("/api/obtener-reportes", name: "obtener_reportes", methods: ["GET"])]
    public function obtenerReportes(EntityManagerInterface $entityManager)
    {
        try {
            $reportesRepository = $entityManager->getRepository(UsuarioReportaElemento::class);
            $reportes = $reportesRepository->findAll();
            
            $reportesArray = [];
            foreach ($reportes as $reporte) {
                $gestionado = false;
                foreach ($reporte->getGestionesElemento() as $gestion) {
                    $gestionado = true;
                    break;
                }
                
                $moderador = null;
                if ($reporte->getModerador()) {
                    $moderador = [
                        'id' => $reporte->getModerador()->getId(),
                        'nombre' => $reporte->getModerador()->getUsuario()
                    ];
                }
                
                $reportesArray[] = [
                    'id' => $reporte->getId(),
                    'usuario' => [
                        'id' => $reporte->getUsuario()->getId(),
                        'nombre' => $reporte->getUsuario()->getUsuario()
                    ],
                    'elemento' => [
                        'id' => $reporte->getElemento()->getId(),
                        'nombre' => $reporte->getElemento()->getNombre(),
                        'fecha_aparicion' => $reporte->getElemento()->getFechaAparicion()->format('Y-m-d'),
                        'descripcion' => $reporte->getElemento()->getDescripcion()
                    ],
                    'nombre_reportado' => $reporte->getNombreReportado(),
                    'fecha_aparicion_reportada' => $reporte->getFechaAparicionReportada() ? 
                        $reporte->getFechaAparicionReportada()->format('Y-m-d') : null,
                    'descripcion_reportada' => $reporte->getDescripcionReportada(),
                    'momento_reporte' => $reporte->getMomentoReporte()->format('Y-m-d H:i:s'),
                    'estado' => $reporte->getEstado(),
                    'moderador' => $moderador,
                    'momento_procesado' => $reporte->getMomentoProcesado() ? 
                        $reporte->getMomentoProcesado()->format('Y-m-d H:i:s') : null,
                    'comentario_moderador' => $reporte->getComentarioModerador(),
                    'gestionado' => $gestionado
                ];
            }
            
            return new JsonResponse([
                'exito' => true,
                'mensaje' => 'Reportes obtenidos correctamente',
                'reportes' => $reportesArray
            ]);
        } catch (\Throwable $th) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Error al obtener reportes: ' . $th->getMessage(),
                'reportes' => []
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    #[Route("/api/aprobar-reporte", name: "aprobar_reporte", methods: ["POST"])]
    public function aprobarReporte(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        
        if (!isset($datosRecibidos['reporte_id']) || !isset($datosRecibidos['usuario_id']) || !isset($datosRecibidos['cambios'])) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Faltan datos requeridos'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        $reporteId = $datosRecibidos['reporte_id'];
        $usuarioId = $datosRecibidos['usuario_id'];
        $cambios = $datosRecibidos['cambios'];
        
        $moderador = $entityManager->getRepository(Usuario::class)->find($usuarioId);
        if (!$moderador || ($moderador->getPermiso() != 2 && $moderador->getPermiso() != 3)) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Usuario no autorizado para esta acción'
            ], Response::HTTP_FORBIDDEN);
        }
        
        $reporte = $entityManager->getRepository(UsuarioReportaElemento::class)->find($reporteId);
        if (!$reporte) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Reporte no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }
        
        if ($reporte->getEstado() !== UsuarioReportaElemento::ESTADO_PENDIENTE) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Este reporte ya ha sido procesado'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        try {
            $entityManager->beginTransaction();
            
            $reporte->setEstado(UsuarioReportaElemento::ESTADO_CONFIRMADO);
            $reporte->setModerador($moderador);
            $reporte->setMomentoProcesado(new \DateTime());
            
            $elemento = $reporte->getElemento();
            $gestion = new UsuarioGestionaElemento();
            $gestion->setUsuario($reporte->getUsuario());
            $gestion->setElemento($elemento);
            $gestion->setModerador($moderador);
            $gestion->setReporte($reporte);
            $gestion->setMomentoGestion(new \DateTime());
            
            $gestion->setNombreAntiguo($elemento->getNombre());
            $gestion->setFechaAparicionAntigua($elemento->getFechaAparicion());
            $gestion->setDescripcionAntigua($elemento->getDescripcion());
            
            if (isset($cambios['nombre']) && !empty($cambios['nombre'])) {
                $elemento->setNombre($cambios['nombre']);
            }
            
            if (isset($cambios['fecha_aparicion']) && !empty($cambios['fecha_aparicion'])) {
                if (is_string($cambios['fecha_aparicion'])) {
                    $elemento->setFechaAparicion(new \DateTime($cambios['fecha_aparicion']));
                } else {
                    $elemento->setFechaAparicion($cambios['fecha_aparicion']);
                }
            }
            
            if (isset($cambios['descripcion']) && !empty($cambios['descripcion'])) {
                $elemento->setDescripcion($cambios['descripcion']);
            }
            
            $entityManager->persist($gestion);
            $entityManager->flush();
            $entityManager->commit();
            
            return new JsonResponse([
                'exito' => true,
                'mensaje' => 'Reporte aprobado y cambios aplicados correctamente'
            ]);
        } catch (\Throwable $th) {
            $entityManager->rollback();
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Error al aprobar reporte: ' . $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    #[Route("/api/rechazar-reporte", name: "rechazar_reporte", methods: ["POST"])]
    public function rechazarReporte(Request $request, EntityManagerInterface $entityManager)
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        
        if (!isset($datosRecibidos['reporte_id']) || !isset($datosRecibidos['usuario_id'])) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Faltan datos requeridos'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        $reporteId = $datosRecibidos['reporte_id'];
        $usuarioId = $datosRecibidos['usuario_id'];
        $comentario = $datosRecibidos['comentario'] ?? null;
        
        $moderador = $entityManager->getRepository(Usuario::class)->find($usuarioId);
        if (!$moderador || ($moderador->getPermiso() != 2 && $moderador->getPermiso() != 3)) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Usuario no autorizado para esta acción'
            ], Response::HTTP_FORBIDDEN);
        }
        
        $reporte = $entityManager->getRepository(UsuarioReportaElemento::class)->find($reporteId);
        if (!$reporte) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Reporte no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }
        
        if ($reporte->getEstado() !== UsuarioReportaElemento::ESTADO_PENDIENTE) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Este reporte ya ha sido procesado'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        try {
            $reporte->setEstado(UsuarioReportaElemento::ESTADO_RECHAZADO);
            $reporte->setModerador($moderador);
            $reporte->setMomentoProcesado(new \DateTime());
            
            if ($comentario) {
                $reporte->setComentarioModerador($comentario);
            }
            
            $entityManager->flush();
            
            return new JsonResponse([
                'exito' => true,
                'mensaje' => 'Reporte rechazado correctamente'
            ]);
        } catch (\Throwable $th) {
            return new JsonResponse([
                'exito' => false,
                'mensaje' => 'Error al rechazar reporte: ' . $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}