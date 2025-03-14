<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ListaCategoriaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ListaCategoriaRepository::class)]
#[ApiResource]
class ListaCategoria
{
    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'listaCategorias')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Lista $lista = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'listaCategorias')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Categoria $categoria = null;

    public function getLista(): ?Lista
    {
        return $this->lista;
    }

    public function setLista(?Lista $lista): static
    {
        $this->lista = $lista;

        return $this;
    }

    public function getCategoria(): ?Categoria
    {
        return $this->categoria;
    }

    public function setCategoria(?Categoria $categoria): static
    {
        $this->categoria = $categoria;

        return $this;
    }
}