<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsuarioReportaElementoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: UsuarioReportaElementoRepository::class)]
#[ApiResource]
class UsuarioReportaElemento
{
    public const ESTADO_PENDIENTE = 0;
    public const ESTADO_CONFIRMADO = 1;
    public const ESTADO_RECHAZADO = 2;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    
    #[ORM\ManyToOne(inversedBy: 'usuarioReportaElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioReportaElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $nombre_reportado = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fecha_aparicion_reportada = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion_reportada = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $momento_reporte = null;

    #[ORM\Column(type: Types::SMALLINT, options: ["default" => 0])]
    private ?int $estado = self::ESTADO_PENDIENTE;

    #[ORM\ManyToOne(targetEntity: Usuario::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?Usuario $moderador = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $momento_procesado = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $comentario_moderador = null;
    
    #[ORM\OneToMany(mappedBy: 'reporte', targetEntity: UsuarioGestionaElemento::class)]
    private Collection $gestionesElemento;

    #[ORM\ManyToOne(targetEntity: Categoria::class)]
    #[ORM\JoinColumn(name: "categoria_id_reportada", nullable: true)]
    private ?Categoria $categoria_reportada = null;
    
    public function __construct()
    {
        $this->gestionesElemento = new ArrayCollection();
    }
    
    public function getId(): ?int
    {
        return $this->id;
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

    public function getNombreReportado(): ?string
    {
        return $this->nombre_reportado;
    }

    public function setNombreReportado(?string $nombre_reportado): static
    {
        $this->nombre_reportado = $nombre_reportado;

        return $this;
    }

    public function getFechaAparicionReportada(): ?\DateTimeInterface
    {
        return $this->fecha_aparicion_reportada;
    }

    public function setFechaAparicionReportada(?\DateTimeInterface $fecha_aparicion_reportada): static
    {
        $this->fecha_aparicion_reportada = $fecha_aparicion_reportada;

        return $this;
    }

    public function getDescripcionReportada(): ?string
    {
        return $this->descripcion_reportada;
    }

    public function setDescripcionReportada(?string $descripcion_reportada): static
    {
        $this->descripcion_reportada = $descripcion_reportada;

        return $this;
    }

    public function getMomentoReporte(): ?\DateTimeInterface
    {
        return $this->momento_reporte;
    }

    public function setMomentoReporte(\DateTimeInterface $momento_reporte): static
    {
        $this->momento_reporte = $momento_reporte;

        return $this;
    }

    public function getEstado(): ?int
    {
        return $this->estado;
    }

    public function setEstado(int $estado): static
    {
        $this->estado = $estado;

        return $this;
    }

    public function isPendiente(): bool
    {
        return $this->estado === self::ESTADO_PENDIENTE;
    }
    
    public function isConfirmado(): bool
    {
        return $this->estado === self::ESTADO_CONFIRMADO;
    }
    
    public function isRechazado(): bool
    {
        return $this->estado === self::ESTADO_RECHAZADO;
    }
    
    public function confirmar(): static
    {
        $this->estado = self::ESTADO_CONFIRMADO;
        return $this;
    }
    
    public function rechazar(): static
    {
        $this->estado = self::ESTADO_RECHAZADO;
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

    public function getMomentoProcesado(): ?\DateTimeInterface
    {
        return $this->momento_procesado;
    }

    public function setMomentoProcesado(?\DateTimeInterface $momento_procesado): static
    {
        $this->momento_procesado = $momento_procesado;

        return $this;
    }

    public function getComentarioModerador(): ?string
    {
        return $this->comentario_moderador;
    }

    public function setComentarioModerador(?string $comentario_moderador): static
    {
        $this->comentario_moderador = $comentario_moderador;

        return $this;
    }
    
    public function getGestionesElemento(): Collection
    {
        return $this->gestionesElemento;
    }

    public function addGestionElemento(UsuarioGestionaElemento $gestionElemento): self
    {
        if (!$this->gestionesElemento->contains($gestionElemento)) {
            $this->gestionesElemento[] = $gestionElemento;
            $gestionElemento->setReporte($this);
        }

        return $this;
    }

    public function removeGestionElemento(UsuarioGestionaElemento $gestionElemento): self
    {
        if ($this->gestionesElemento->removeElement($gestionElemento)) {
            if ($gestionElemento->getReporte() === $this) {
                $gestionElemento->setReporte(null);
            }
        }

        return $this;
    }

    public function getCategoriaReportada(): ?Categoria
    {
        return $this->categoria_reportada;
    }

    public function setCategoriaReportada(?Categoria $categoria): static
    {
        $this->categoria_reportada = $categoria;

        return $this;
    }
}