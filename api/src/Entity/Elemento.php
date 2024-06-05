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

    #[ORM\OneToOne(inversedBy: 'elemento', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $id_usuario = null;

    /**
     * @var Collection<int, Usuario>
     */
    #[ORM\ManyToMany(targetEntity: Usuario::class, mappedBy: 'Lista_Contiene_Elemento')]
    private Collection $test1;

    public function __construct()
    {
        $this->test1 = new ArrayCollection();
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

    public function getIdUsuario(): ?Usuario
    {
        return $this->id_usuario;
    }

    public function setIdUsuario(Usuario $id_usuario): static
    {
        $this->id_usuario = $id_usuario;

        return $this;
    }

    /**
     * @return Collection<int, Usuario>
     */
    public function getTest1(): Collection
    {
        return $this->test1;
    }

    public function addTest1(Usuario $test1): static
    {
        if (!$this->test1->contains($test1)) {
            $this->test1->add($test1);
            $test1->addListaContieneElemento($this);
        }

        return $this;
    }

    public function removeTest1(Usuario $test1): static
    {
        if ($this->test1->removeElement($test1)) {
            $test1->removeListaContieneElemento($this);
        }

        return $this;
    }
}
