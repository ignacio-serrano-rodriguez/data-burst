<?php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ElementoCategoriaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ElementoCategoriaRepository::class)]
#[ApiResource]
class ElementoCategoria
{
    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'elementoCategorias')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'elementoCategorias')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Categoria $categoria = null;

    public function getElemento(): ?Elemento
    {
        return $this->elemento;
    }

    public function setElemento(?Elemento $elemento): static
    {
        $this->elemento = $elemento;

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