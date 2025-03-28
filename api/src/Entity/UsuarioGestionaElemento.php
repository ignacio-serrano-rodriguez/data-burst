<?php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsuarioGestionaElementoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioGestionaElementoRepository::class)]
#[ApiResource]
class UsuarioGestionaElemento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $momento_gestion = null;

    #[ORM\Column(length: 255)]
    private ?string $nombre_antiguo = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $fecha_aparicion_antigua = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $descripcion_antigua = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioGestionaElementos')]
    #[ORM\JoinColumn(name: "usuario_id", nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioGestionaElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ORM\JoinColumn(name: "moderador_id", nullable: true)]
    private ?Usuario $moderador = null;

    #[ORM\ManyToOne(targetEntity: UsuarioReportaElemento::class, inversedBy: 'gestionesElemento')]
    #[ORM\JoinColumn(name: "reporte_id", nullable: true)]
    private ?UsuarioReportaElemento $reporte = null;

    #[ORM\ManyToOne(targetEntity: Categoria::class)]
    #[ORM\JoinColumn(name: "categoria_id_antigua", nullable: true)]
    private ?Categoria $categoria_antigua = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

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

    public function getNombreAntiguo(): ?string
    {
        return $this->nombre_antiguo;
    }

    public function setNombreAntiguo(string $nombre_antiguo): static
    {
        $this->nombre_antiguo = $nombre_antiguo;

        return $this;
    }

    public function getFechaAparicionAntigua(): ?\DateTimeInterface
    {
        return $this->fecha_aparicion_antigua;
    }

    public function setFechaAparicionAntigua(\DateTimeInterface $fecha_aparicion_antigua): static
    {
        $this->fecha_aparicion_antigua = $fecha_aparicion_antigua;

        return $this;
    }

    public function getDescripcionAntigua(): ?string
    {
        return $this->descripcion_antigua;
    }

    public function setDescripcionAntigua(string $descripcion_antigua): static
    {
        $this->descripcion_antigua = $descripcion_antigua;

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

    public function getModerador(): ?Usuario
    {
        return $this->moderador;
    }

    public function setModerador(?Usuario $moderador): static
    {
        $this->moderador = $moderador;

        return $this;
    }

    public function getReporte(): ?UsuarioReportaElemento
    {
        return $this->reporte;
    }

    public function setReporte(?UsuarioReportaElemento $reporte): static
    {
        $this->reporte = $reporte;

        return $this;
    }

    public function getCategoriaAntigua(): ?Categoria
    {
        return $this->categoria_antigua;
    }

    public function setCategoriaAntigua(?Categoria $categoria): static
    {
        $this->categoria_antigua = $categoria;

        return $this;
    }
}