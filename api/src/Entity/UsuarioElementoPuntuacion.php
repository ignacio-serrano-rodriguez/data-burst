<?php
namespace App\Entity;

use App\Repository\UsuarioElementoPuntuacionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioElementoPuntuacionRepository::class)]
#[ORM\HasLifecycleCallbacks]
class UsuarioElementoPuntuacion
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
    private ?bool $puntuacion = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $momento_puntuacion = null;

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

    public function getPuntuacion(): ?bool
    {
        return $this->puntuacion;
    }

    public function setPuntuacion(?bool $puntuacion): self
    {
        $this->puntuacion = $puntuacion;
        $this->momento_puntuacion = new \DateTime(); 

        return $this;
    }

    public function getMomentoPuntuacion(): ?\DateTimeInterface
    {
        return $this->momento_puntuacion;
    }

    public function setMomentoPuntuacion(?\DateTimeInterface $momento_puntuacion): self
    {
        $this->momento_puntuacion = $momento_puntuacion;

        return $this;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function actualizarMomentoPuntuacion(): void
    {
        $this->momento_puntuacion = new \DateTime();
    }
}