<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\InvitacionListaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InvitacionListaRepository::class)]
#[ApiResource]
class InvitacionLista
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'invitacionesEnviadas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $invitador = null;

    #[ORM\ManyToOne(inversedBy: 'invitacionesRecibidas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $invitado = null;

    #[ORM\ManyToOne(inversedBy: 'invitaciones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Lista $lista = null;

    #[ORM\Column(type: 'boolean')]
    private bool $aceptada = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInvitador(): ?Usuario
    {
        return $this->invitador;
    }

    public function setInvitador(?Usuario $invitador): self
    {
        $this->invitador = $invitador;

        return $this;
    }

    public function getInvitado(): ?Usuario
    {
        return $this->invitado;
    }

    public function setInvitado(?Usuario $invitado): self
    {
        $this->invitado = $invitado;

        return $this;
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

    public function isAceptada(): bool
    {
        return $this->aceptada;
    }

    public function setAceptada(bool $aceptada): self
    {
        $this->aceptada = $aceptada;

        return $this;
    }
}