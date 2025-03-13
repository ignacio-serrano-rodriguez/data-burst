<?php
// filepath: c:\Users\ignac\Documents\GitHub\data-burst\api\src\Entity\ListaCategoria.php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ListaCategoriaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ListaCategoriaRepository::class)]
#[ApiResource]
#[ORM\HasLifecycleCallbacks]
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

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $momento_asignacion = null;

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