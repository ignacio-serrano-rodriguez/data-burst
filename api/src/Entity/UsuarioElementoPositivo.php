<?php

namespace App\Entity;

use App\Repository\UsuarioElementoPositivoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioElementoPositivoRepository::class)]
class UsuarioElementoPositivo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(targetEntity: Elemento::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\Column(type: 'boolean', nullable: true)]
    private ?bool $positivo = null;

    public function getId(): ?int
    {
        return $this->id;
    }

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

        return $this;
    }
}