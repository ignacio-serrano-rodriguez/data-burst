<?php

namespace App\Controller;

use App\Entity\Categoria;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class CategoriaController extends AbstractController
{
    #[Route("/api/categorias", name: "obtener_categorias", methods: ["GET"])]
    public function obtenerCategorias(EntityManagerInterface $entityManager): JsonResponse
    {
        $categorias = $entityManager->getRepository(Categoria::class)->findAll();
        
        $categoriasArray = [];
        foreach ($categorias as $categoria) {
            $categoriasArray[] = [
                'id' => $categoria->getId(),
                'nombre' => $categoria->getNombre()
            ];
        }
        
        return new JsonResponse([
            'categorias' => $categoriasArray
        ]);
    }
}