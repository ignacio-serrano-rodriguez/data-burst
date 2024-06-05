<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsuarioGestionaUsuarioRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioGestionaUsuarioRepository::class)]
#[ApiResource]
class UsuarioGestionaUsuario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $permiso_antiguo = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $momento_gestion = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioGestionaUsuarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario_normal = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioGestionaUsuarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario_administrador = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getPermisoAntiguo(): ?int
    {
        return $this->permiso_antiguo;
    }

    public function setPermisoAntiguo(int $permiso_antiguo): static
    {
        $this->permiso_antiguo = $permiso_antiguo;

        return $this;
    }

    public function getMomentoGestion(): ?\DateTimeInterface
    {
        return $this->momento_gestion;
    }

    public function setMomentoGestion(\DateTimeInterface $momento_gestion): static
    {
        $this->momento_gestion = $momento_gestion;

        return $this;
    }

    public function getUsuarioNormal(): ?Usuario
    {
        return $this->usuario_normal;
    }

    public function setUsuarioNormal(?Usuario $usuario_normal): static
    {
        $this->usuario_normal = $usuario_normal;

        return $this;
    }

    public function getUsuarioAdministrador(): ?Usuario
    {
        return $this->usuario_administrador;
    }

    public function setUsuarioAdministrador(?Usuario $usuario_administrador): static
    {
        $this->usuario_administrador = $usuario_administrador;

        return $this;
    }
}
