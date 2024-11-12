<?php

namespace App\Controller;

use App\Entity\Lista;
use App\Entity\Usuario;
use App\Entity\UsuarioManipulaLista;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ListaController extends AbstractController
{
    #[Route("/api/crear-asignar-lista", name: "crear_asignar_lista", methods: ["POST"])]
    public function crearAsignarLista
    (
        Request $request, 
        EntityManagerInterface $entityManager
    )
    {
        $datosRecibidos = json_decode($request->getContent(), true);
        $nombreLista = $datosRecibidos['nombre'];
        $usuarioID = $datosRecibidos['usuarioID'];
        $respuestaJson = null;

        $lista = new Lista();
        $lista->setNombre($nombreLista);

        $usuarioManipulaLista = new UsuarioManipulaLista();
        $usuarioManipulaLista->setLista($lista);
        $usuarioManipulaLista->setUsuario
        (
            $entityManager->getRepository
            (Usuario::class)->find($usuarioID)
        );

        try 
        {
            $entityManager->persist($lista);
            $entityManager->flush();
        
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => true,
                    "mensaje" => "Lista creada y asignada exitosamente."
                ],
                Response::HTTP_CREATED
            );

            $entityManager->persist($usuarioManipulaLista);
            $entityManager->flush();
        } 
        
        catch (\Throwable $th) 
        {
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => false,
                    "mensaje" => "Creación y asignación de la lista fallida."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $respuestaJson;
    }
}