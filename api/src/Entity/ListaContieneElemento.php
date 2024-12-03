<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ListaContieneElementoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ListaContieneElementoRepository::class)]
#[ApiResource]
class ListaContieneElemento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'listaContieneElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Lista $lista = null;

    #[ORM\ManyToOne(inversedBy: 'listaContieneElementos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Elemento $elemento = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $momentoContencion = null;

    #[ORM\OneToMany(mappedBy: 'listaContieneElemento', targetEntity: UsuarioElementoPositivo::class)]
    private Collection $usuarioElementoPositivos;

    #[ORM\OneToMany(mappedBy: 'listaContieneElemento', targetEntity: UsuarioElementoComentario::class)]
    private Collection $usuarioElementoComentarios;

    public function __construct()
    {
        $this->usuarioElementoPositivos = new ArrayCollection();
        $this->usuarioElementoComentarios = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLista(): ?Lista
    {
        return $this->lista;
    }

    public function setLista(?Lista $lista): self
    {
        $this->lista = $lista;

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

    public function getMomentoContencion(): ?\DateTimeInterface
    {
        return $this->momentoContencion;
    }

    public function setMomentoContencion(\DateTimeInterface $momentoContencion): self
    {
        $this->momentoContencion = $momentoContencion;

        return $this;
    }

    /**
     * @return Collection<int, UsuarioElementoPositivo>
     */
    public function getUsuarioElementoPositivos(): Collection
    {
        return $this->usuarioElementoPositivos;
    }

    public function addUsuarioElementoPositivo(UsuarioElementoPositivo $usuarioElementoPositivo): self
    {
        if (!$this->usuarioElementoPositivos->contains($usuarioElementoPositivo)) {
            $this->usuarioElementoPositivos[] = $usuarioElementoPositivo;
            $usuarioElementoPositivo->setListaContieneElemento($this);
        }

        return $this;
    }

    public function removeUsuarioElementoPositivo(UsuarioElementoPositivo $usuarioElementoPositivo): self
    {
        if ($this->usuarioElementoPositivos->removeElement($usuarioElementoPositivo)) {
            // set the owning side to null (unless already changed)
            if ($usuarioElementoPositivo->getListaContieneElemento() === $this) {
                $usuarioElementoPositivo->setListaContieneElemento(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UsuarioElementoComentario>
     */
    public function getUsuarioElementoComentarios(): Collection
    {
        return $this->usuarioElementoComentarios;
    }

    public function addUsuarioElementoComentario(UsuarioElementoComentario $usuarioElementoComentario): self
    {
        if (!$this->usuarioElementoComentarios->contains($usuarioElementoComentario)) {
            $this->usuarioElementoComentarios[] = $usuarioElementoComentario;
            $usuarioElementoComentario->setListaContieneElemento($this);
        }

        return $this;
    }

    public function removeUsuarioElementoComentario(UsuarioElementoComentario $usuarioElementoComentario): self
    {
        if ($this->usuarioElementoComentarios->removeElement($usuarioElementoComentario)) {
            // set the owning side to null (unless already changed)
            if ($usuarioElementoComentario->getListaContieneElemento() === $this) {
                $usuarioElementoComentario->setListaContieneElemento(null);
            }
        }

        return $this;
    }
}