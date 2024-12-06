<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsuarioElementoComentarioRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioElementoComentarioRepository::class)]
#[ApiResource]
#[ORM\HasLifecycleCallbacks]
class UsuarioElementoComentario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $comentario = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioElementoComentarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioElementoComentarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $momento_comentario = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getComentario(): ?string
    {
        return $this->comentario;
    }

    public function setComentario(?string $comentario): static
    {
        $this->comentario = $comentario;
        $this->momento_comentario = new \DateTime(); // Actualizar momento_comentario cuando cambie comentario

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

    public function getElemento(): ?Elemento
    {
        return $this->elemento;
    }

    public function setElemento(?Elemento $elemento): static
    {
        $this->elemento = $elemento;

        return $this;
    }

    public function getMomentoComentario(): ?\DateTimeInterface
    {
        return $this->momento_comentario;
    }

    public function setMomentoComentario(?\DateTimeInterface $momento_comentario): static
    {
        $this->momento_comentario = $momento_comentario;

        return $this;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function actualizarMomentoComentario(): void
    {
        $this->momento_comentario = new \DateTime();
    }
}