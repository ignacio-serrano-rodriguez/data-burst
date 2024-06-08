<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ElementoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ElementoRepository::class)]
#[ApiResource]
class Elemento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nombre = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $fecha_aparicion = null;

    #[ORM\Column(length: 255)]
    private ?string $informacion_extra = null;

    #[ORM\Column]
    private ?int $puntuacion = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $descripcion = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $momento_creacion = null;

    #[ORM\ManyToOne(inversedBy: 'elementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    /**
     * @var Collection<int, ListaContieneElemento>
     */
    #[ORM\OneToMany(targetEntity: ListaContieneElemento::class, mappedBy: 'elemento', orphanRemoval: true)]
    private Collection $listaContieneElementos;

    /**
     * @var Collection<int, UsuarioReportaElemento>
     */
    #[ORM\OneToMany(targetEntity: UsuarioReportaElemento::class, mappedBy: 'elemento', orphanRemoval: true)]
    private Collection $usuarioReportaElementos;

    /**
     * @var Collection<int, UsuarioGestionaElemento>
     */
    #[ORM\OneToMany(targetEntity: UsuarioGestionaElemento::class, mappedBy: 'elemento', orphanRemoval: true)]
    private Collection $usuarioGestionaElementos;

    public function __construct()
    {
        $this->listaContieneElementos = new ArrayCollection();
        $this->usuarioReportaElementos = new ArrayCollection();
        $this->usuarioGestionaElementos = new ArrayCollection();
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

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getFechaAparicion(): ?\DateTimeInterface
    {
        return $this->fecha_aparicion;
    }

    public function setFechaAparicion(\DateTimeInterface $fecha_aparicion): static
    {
        $this->fecha_aparicion = $fecha_aparicion;

        return $this;
    }

    public function getInformacionExtra(): ?string
    {
        return $this->informacion_extra;
    }

    public function setInformacionExtra(string $informacion_extra): static
    {
        $this->informacion_extra = $informacion_extra;

        return $this;
    }

    public function getPuntuacion(): ?int
    {
        return $this->puntuacion;
    }

    public function setPuntuacion(int $puntuacion): static
    {
        $this->puntuacion = $puntuacion;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getMomentoCreacion(): ?\DateTimeInterface
    {
        return $this->momento_creacion;
    }

    public function setMomentoCreacion(\DateTimeInterface $momento_creacion): static
    {
        $this->momento_creacion = $momento_creacion;

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

    /**
     * @return Collection<int, ListaContieneElemento>
     */
    public function getListaContieneElementos(): Collection
    {
        return $this->listaContieneElementos;
    }

    public function addListaContieneElemento(ListaContieneElemento $listaContieneElemento): static
    {
        if (!$this->listaContieneElementos->contains($listaContieneElemento)) {
            $this->listaContieneElementos->add($listaContieneElemento);
            $listaContieneElemento->setElemento($this);
        }

        return $this;
    }

    public function removeListaContieneElemento(ListaContieneElemento $listaContieneElemento): static
    {
        if ($this->listaContieneElementos->removeElement($listaContieneElemento)) {
            // set the owning side to null (unless already changed)
            if ($listaContieneElemento->getElemento() === $this) {
                $listaContieneElemento->setElemento(null);
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
            $usuarioReportaElemento->setElemento($this);
        }

        return $this;
    }

    public function removeUsuarioReportaElemento(UsuarioReportaElemento $usuarioReportaElemento): static
    {
        if ($this->usuarioReportaElementos->removeElement($usuarioReportaElemento)) {
            // set the owning side to null (unless already changed)
            if ($usuarioReportaElemento->getElemento() === $this) {
                $usuarioReportaElemento->setElemento(null);
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
            $usuarioGestionaElemento->setElemento($this);
        }

        return $this;
    }

    public function removeUsuarioGestionaElemento(UsuarioGestionaElemento $usuarioGestionaElemento): static
    {
        if ($this->usuarioGestionaElementos->removeElement($usuarioGestionaElemento)) {
            // set the owning side to null (unless already changed)
            if ($usuarioGestionaElemento->getElemento() === $this) {
                $usuarioGestionaElemento->setElemento(null);
            }
        }

        return $this;
    }
}
