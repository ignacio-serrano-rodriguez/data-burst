<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsuarioManipulaListaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioManipulaListaRepository::class)]
#[ApiResource]
class UsuarioManipulaLista
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioManipulaListas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioManipulaListas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Lista $lista = null;

    #[ORM\Column(type: 'boolean')]
    private bool $publica = true;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $momento_manipulacion = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    public function getLista(): ?Lista
    {
        return $this->lista;
    }

    public function setLista(?Lista $lista): static
    {
        $this->lista = $lista;

        return $this;
    }

    public function isPublica(): bool
    {
        return $this->publica;
    }

    public function setPublica(bool $publica): static
    {
        $this->publica = $publica;

        return $this;
    }

    public function getMomentoManipulacion(): ?\DateTimeInterface
    {
        return $this->momento_manipulacion;
    }

    public function setMomentoManipulacion(\DateTimeInterface $momento_manipulacion): static
    {
        $this->momento_manipulacion = $momento_manipulacion;

        return $this;
    }

    #[ORM\PrePersist]
    public function prePersist(): void
    {
        $this->momento_manipulacion = new \DateTime();
    }
}