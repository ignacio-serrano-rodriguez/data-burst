<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ListaContieneElementoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ListaContieneElementoRepository::class)]
#[ApiResource]
class ListaContieneElemento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'listaContieneElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Lista $lista = null;

    #[ORM\ManyToOne(inversedBy: 'listaContieneElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $momentoContencion = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLista(): ?Lista
    {
        return $this->lista;
    }

    public function setLista(?Lista $lista): self
    {
        $this->lista = $lista;

        return $this;
    }

    public function getElemento(): ?Elemento
    {
        return $this->elemento;
    }

    public function setElemento(?Elemento $elemento): self
    {
        $this->elemento = $elemento;

        return $this;
    }

    public function getMomentoContencion(): ?\DateTimeInterface
    {
        return $this->momentoContencion;
    }

    public function setMomentoContencion(\DateTimeInterface $momentoContencion): self
    {
        $this->momentoContencion = $momentoContencion;

        return $this;
    }
}