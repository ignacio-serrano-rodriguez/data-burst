<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ElementoCategoriaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ElementoCategoriaRepository::class)]
#[ApiResource]
#[ORM\HasLifecycleCallbacks]
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

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $momento_asignacion = null;

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

    public function getMomentoAsignacion(): ?\DateTimeInterface
    {
        return $this->momento_asignacion;
    }

    public function setMomentoAsignacion(\DateTimeInterface $momento_asignacion): static
    {
        $this->momento_asignacion = $momento_asignacion;

        return $this;
    }

    #[ORM\PrePersist]
    public function prePersist(): void
    {
        $this->momento_asignacion = new \DateTime();
    }
}