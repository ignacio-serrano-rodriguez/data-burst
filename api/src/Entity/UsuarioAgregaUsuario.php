<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsuarioAgregaUsuarioRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioAgregaUsuarioRepository::class)]
#[ApiResource]
class UsuarioAgregaUsuario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $momento_agregacion = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioAgregaUsuarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario_1 = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioAgregaUsuarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario_2 = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMomentoAgregacion(): ?\DateTimeInterface
    {
        return $this->momento_agregacion;
    }

    public function setMomentoAgregacion(\DateTimeInterface $momento_agregacion): static
    {
        $this->momento_agregacion = $momento_agregacion;

        return $this;
    }

    public function getUsuario1(): ?Usuario
    {
        return $this->usuario_1;
    }

    public function setUsuario1(?Usuario $usuario_1): static
    {
        $this->usuario_1 = $usuario_1;

        return $this;
    }

    public function getUsuario2(): ?Usuario
    {
        return $this->usuario_2;
    }

    public function setUsuario2(?Usuario $usuario_2): static
    {
        $this->usuario_2 = $usuario_2;

        return $this;
    }
}
