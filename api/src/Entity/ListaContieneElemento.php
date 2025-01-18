<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ListaContieneElementoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ListaContieneElementoRepository::class)]
#[ApiResource]
#[ORM\UniqueConstraint(name: "unique_lista_elemento", columns: ["lista_id", "elemento_id"])]
class ListaContieneElemento
{
    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'listaContieneElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Lista $lista = null;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'listaContieneElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $momentoContencion = null;

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