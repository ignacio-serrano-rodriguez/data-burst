<?php

namespace App\Controller;

use App\Entity\Lista;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ListaController extends AbstractController
{
    #[Route("/api/crear-lista", name: "crear_lista", methods: ["POST"])]
    public function registro
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

        try 
        {
            $entityManager->persist($lista);
            $entityManager->flush();
        
            $respuestaJson = new JsonResponse
            (
                [
                    "exito" => true,
                    "mensaje" => "Lista creada exitosamente."
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
                    "mensaje" => "Creación de la lista fallida."
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return $respuestaJson;
    }

}