<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsuarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UsuarioRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource]
class Usuario implements UserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 254, unique: true)]
    private ?string $mail = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $usuario = null;

    #[ORM\Column(length: 255)]
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

    private array $roles = [];

    /**
     * @var Collection<int, Elemento>
     */
    #[ORM\OneToMany(targetEntity: Elemento::class, mappedBy: 'usuario', orphanRemoval: true)]
    private Collection $elementos;

    /**
     * @var Collection<int, UsuarioManipulaLista>
     */
    #[ORM\OneToMany(targetEntity: UsuarioManipulaLista::class, mappedBy: 'usuario', orphanRemoval: true)]
    private Collection $usuarioManipulaListas;

    /**
     * @var Collection<int, UsuarioReportaElemento>
     */
    #[ORM\OneToMany(targetEntity: UsuarioReportaElemento::class, mappedBy: 'usuario', orphanRemoval: true)]
    private Collection $usuarioReportaElementos;

    /**
     * @var Collection<int, UsuarioGestionaElemento>
     */
    #[ORM\OneToMany(targetEntity: UsuarioGestionaElemento::class, mappedBy: 'usuario', orphanRemoval: true)]
    private Collection $usuarioGestionaElementos;

    /**
     * @var Collection<int, UsuarioAgregaUsuario>
     */
    #[ORM\OneToMany(targetEntity: UsuarioAgregaUsuario::class, mappedBy: 'usuario_1', orphanRemoval: true)]
    private Collection $usuarioAgregaUsuarios;

    /**
     * @var Collection<int, UsuarioGestionaUsuario>
     */
    #[ORM\OneToMany(targetEntity: UsuarioGestionaUsuario::class, mappedBy: 'usuario_normal', orphanRemoval: true)]
    private Collection $usuarioGestionaUsuarios;

    public function __construct()
    {
        $this->elementos = new ArrayCollection();
        $this->usuarioManipulaListas = new ArrayCollection();
        $this->usuarioReportaElementos = new ArrayCollection();
        $this->usuarioGestionaElementos = new ArrayCollection();
        $this->usuarioAgregaUsuarios = new ArrayCollection();
        $this->usuarioGestionaUsuarios = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function prePersist(): void
    {
        $this->momento_registro = new \DateTime();
        $this->permiso = 1;

        // Cambiar cuando se implemente el envío de correos de verificación
        if ($this->verificado === null) 
        {
            $this->verificado = true;
        }
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

    private function hashContraseniaPlana(string $contraseniaPlana): string
    {
        return password_hash($contraseniaPlana, PASSWORD_DEFAULT);
    }

    public function comprobarContrasenia(string $contraseniaPlana): bool
    {
        return password_verify($contraseniaPlana, $this->contrasenia);
    }

    public function setContrasenia(string $contraseniaPlana): static
    {
        $this->contrasenia = $this->hashContraseniaPlana($contraseniaPlana);

        return $this;
    }

    public function getContrasenia(): ?string
    {            
        return $this->contrasenia;
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
     * @return Collection<int, Elemento>
     */
    public function getElementos(): Collection
    {
        return $this->elementos;
    }

    public function addElemento(Elemento $elemento): static
    {
        if (!$this->elementos->contains($elemento)) {
            $this->elementos->add($elemento);
            $elemento->setUsuario($this);
        }

        return $this;
    }

    public function removeElemento(Elemento $elemento): static
    {
        if ($this->elementos->removeElement($elemento)) {
            if ($elemento->getUsuario() === $this) {
                $elemento->setUsuario(null);
            }
        }

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
            if ($usuarioReportaElemento->getUsuario() === $this) {
                $usuarioReportaElemento->setUsuario(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UsuarioGestionaElemento>
     */
    public function getUsuarioGestionaElementos(): Collection
    {
        return $this->usuarioGestionaElementos;
    }

    public function addUsuarioGestionaElemento(UsuarioGestionaElemento $usuarioGestionaElemento): static
    {
        if (!$this->usuarioGestionaElementos->contains($usuarioGestionaElemento)) {
            $this->usuarioGestionaElementos->add($usuarioGestionaElemento);
            $usuarioGestionaElemento->setUsuario($this);
        }

        return $this;
    }

    public function removeUsuarioGestionaElemento(UsuarioGestionaElemento $usuarioGestionaElemento): static
    {
        if ($this->usuarioGestionaElementos->removeElement($usuarioGestionaElemento)) {
            if ($usuarioGestionaElemento->getUsuario() === $this) {
                $usuarioGestionaElemento->setUsuario(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UsuarioAgregaUsuario>
     */
    public function getUsuarioAgregaUsuarios(): Collection
    {
        return $this->usuarioAgregaUsuarios;
    }

    public function addUsuarioAgregaUsuario(UsuarioAgregaUsuario $usuarioAgregaUsuario): static
    {
        if (!$this->usuarioAgregaUsuarios->contains($usuarioAgregaUsuario)) {
            $this->usuarioAgregaUsuarios->add($usuarioAgregaUsuario);
            $usuarioAgregaUsuario->setUsuario1($this);
        }

        return $this;
    }

    public function removeUsuarioAgregaUsuario(UsuarioAgregaUsuario $usuarioAgregaUsuario): static
    {
        if ($this->usuarioAgregaUsuarios->removeElement($usuarioAgregaUsuario)) {
            if ($usuarioAgregaUsuario->getUsuario1() === $this) {
                $usuarioAgregaUsuario->setUsuario1(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UsuarioGestionaUsuario>
     */
    public function getUsuarioGestionaUsuarios(): Collection
    {
        return $this->usuarioGestionaUsuarios;
    }

    public function addUsuarioGestionaUsuario(UsuarioGestionaUsuario $usuarioGestionaUsuario): static
    {
        if (!$this->usuarioGestionaUsuarios->contains($usuarioGestionaUsuario)) {
            $this->usuarioGestionaUsuarios->add($usuarioGestionaUsuario);
            $usuarioGestionaUsuario->setUsuarioNormal($this);
        }

        return $this;
    }

    public function removeUsuarioGestionaUsuario(UsuarioGestionaUsuario $usuarioGestionaUsuario): static
    {
        if ($this->usuarioGestionaUsuarios->removeElement($usuarioGestionaUsuario)) {
            if ($usuarioGestionaUsuario->getUsuarioNormal() === $this) {
                $usuarioGestionaUsuario->setUsuarioNormal(null);
            }
        }

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;

        if (empty($roles)) {
            $roles[] = 'ROLE_USER';
        }

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function eraseCredentials(): void
    {
        $this->contrasenia = null;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->id;
    }
}