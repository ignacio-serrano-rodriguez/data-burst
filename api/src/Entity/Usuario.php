<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsuarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioRepository::class)]
#[ApiResource]
class Usuario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 254)]
    private ?string $mail = null;

    #[ORM\Column(length: 255)]
    private ?string $usuario = null;

    #[ORM\Column(length: 64)]
    private ?string $contrasenia = null;

    #[ORM\Column]
    private ?bool $verificado = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $permiso = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $momento_registro = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nombre = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $apellido_1 = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $apellido_2 = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fecha_nacimiento = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $pais = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $profesion = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $estudios = null;

    #[ORM\Column(type: Types::BLOB, nullable: true)]
    private $avatar;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $idioma = null;

    /**
     * @var Collection<int, UsuarioManipulaLista>
     */
    #[ORM\OneToMany(targetEntity: UsuarioManipulaLista::class, mappedBy: 'usuario', orphanRemoval: true)]
    private Collection $usuarioManipulaListas;

    /**
     * @var Collection<int, UsuarioReportaElemento>
     */
    #[ORM\OneToMany(targetEntity: UsuarioReportaElemento::class, mappedBy: 'usuario')]
    private Collection $usuarioReportaElementos;

    public function __construct()
    {
        $this->usuarioManipulaListas = new ArrayCollection();
        $this->usuarioReportaElementos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getMail(): ?string
    {
        return $this->mail;
    }

    public function setMail(string $mail): static
    {
        $this->mail = $mail;

        return $this;
    }

    public function getUsuario(): ?string
    {
        return $this->usuario;
    }

    public function setUsuario(string $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    public function getContrasenia(): ?string
    {
        return $this->contrasenia;
    }

    public function setContrasenia(string $contrasenia): static
    {
        $this->contrasenia = $contrasenia;

        return $this;
    }

    public function isVerificado(): ?bool
    {
        return $this->verificado;
    }

    public function setVerificado(bool $verificado): static
    {
        $this->verificado = $verificado;

        return $this;
    }

    public function getPermiso(): ?int
    {
        return $this->permiso;
    }

    public function setPermiso(int $permiso): static
    {
        $this->permiso = $permiso;

        return $this;
    }

    public function getMomentoRegistro(): ?\DateTimeInterface
    {
        return $this->momento_registro;
    }

    public function setMomentoRegistro(\DateTimeInterface $momento_registro): static
    {
        $this->momento_registro = $momento_registro;

        return $this;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(?string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getApellido1(): ?string
    {
        return $this->apellido_1;
    }

    public function setApellido1(?string $apellido_1): static
    {
        $this->apellido_1 = $apellido_1;

        return $this;
    }

    public function getApellido2(): ?string
    {
        return $this->apellido_2;
    }

    public function setApellido2(?string $apellido_2): static
    {
        $this->apellido_2 = $apellido_2;

        return $this;
    }

    public function getFechaNacimiento(): ?\DateTimeInterface
    {
        return $this->fecha_nacimiento;
    }

    public function setFechaNacimiento(?\DateTimeInterface $fecha_nacimiento): static
    {
        $this->fecha_nacimiento = $fecha_nacimiento;

        return $this;
    }

    public function getPais(): ?string
    {
        return $this->pais;
    }

    public function setPais(?string $pais): static
    {
        $this->pais = $pais;

        return $this;
    }

    public function getProfesion(): ?string
    {
        return $this->profesion;
    }

    public function setProfesion(?string $profesion): static
    {
        $this->profesion = $profesion;

        return $this;
    }

    public function getEstudios(): ?string
    {
        return $this->estudios;
    }

    public function setEstudios(?string $estudios): static
    {
        $this->estudios = $estudios;

        return $this;
    }

    public function getAvatar()
    {
        return $this->avatar;
    }

    public function setAvatar($avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getIdioma(): ?string
    {
        return $this->idioma;
    }

    public function setIdioma(?string $idioma): static
    {
        $this->idioma = $idioma;

        return $this;
    }

    /**
     * @return Collection<int, UsuarioManipulaLista>
     */
    public function getUsuarioManipulaListas(): Collection
    {
        return $this->usuarioManipulaListas;
    }

    public function addUsuarioManipulaLista(UsuarioManipulaLista $usuarioManipulaLista): static
    {
        if (!$this->usuarioManipulaListas->contains($usuarioManipulaLista)) {
            $this->usuarioManipulaListas->add($usuarioManipulaLista);
            $usuarioManipulaLista->setUsuario($this);
        }

        return $this;
    }

    public function removeUsuarioManipulaLista(UsuarioManipulaLista $usuarioManipulaLista): static
    {
        if ($this->usuarioManipulaListas->removeElement($usuarioManipulaLista)) {
            // set the owning side to null (unless already changed)
            if ($usuarioManipulaLista->getUsuario() === $this) {
                $usuarioManipulaLista->setUsuario(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UsuarioReportaElemento>
     */
    public function getUsuarioReportaElementos(): Collection
    {
        return $this->usuarioReportaElementos;
    }

    public function addUsuarioReportaElemento(UsuarioReportaElemento $usuarioReportaElemento): static
    {
        if (!$this->usuarioReportaElementos->contains($usuarioReportaElemento)) {
            $this->usuarioReportaElementos->add($usuarioReportaElemento);
            $usuarioReportaElemento->setUsuario($this);
        }

        return $this;
    }

    public function removeUsuarioReportaElemento(UsuarioReportaElemento $usuarioReportaElemento): static
    {
        if ($this->usuarioReportaElementos->removeElement($usuarioReportaElemento)) {
            // set the owning side to null (unless already changed)
            if ($usuarioReportaElemento->getUsuario() === $this) {
                $usuarioReportaElemento->setUsuario(null);
            }
        }

        return $this;
    }
}
