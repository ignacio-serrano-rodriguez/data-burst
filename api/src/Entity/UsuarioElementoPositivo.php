<?php

namespace App\Entity;

use App\Repository\UsuarioElementoPositivoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioElementoPositivoRepository::class)]
#[ORM\HasLifecycleCallbacks]
class UsuarioElementoPositivo
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Elemento::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\Column(type: 'boolean', nullable: true)]
    private ?bool $positivo = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $momento_positivo = null;

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): self
    {
        $this->usuario = $usuario;

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

    public function getPositivo(): ?bool
    {
        return $this->positivo;
    }

    public function setPositivo(?bool $positivo): self
    {
        $this->positivo = $positivo;
        $this->momento_positivo = new \DateTime(); // Actualizar momento_positivo cuando cambie positivo

        return $this;
    }

    public function getMomentoPositivo(): ?\DateTimeInterface
    {
        return $this->momento_positivo;
    }

    public function setMomentoPositivo(?\DateTimeInterface $momento_positivo): self
    {
        $this->momento_positivo = $momento_positivo;

        return $this;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function actualizarMomentoPositivo(): void
    {
        $this->momento_positivo = new \DateTime();
    }
}