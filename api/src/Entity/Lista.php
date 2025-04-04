<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ListaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ListaRepository::class)]
#[ApiResource]
class Lista
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nombre = null;

    /**
     * @var Collection<int, UsuarioManipulaLista>
     */
    #[ORM\OneToMany(targetEntity: UsuarioManipulaLista::class, mappedBy: 'lista', orphanRemoval: true)]
    private Collection $usuarioManipulaListas;

    /**
     * @var Collection<int, ListaContieneElemento>
     */
    #[ORM\OneToMany(targetEntity: ListaContieneElemento::class, mappedBy: 'lista', orphanRemoval: true)]
    private Collection $listaContieneElementos;

    #[ORM\ManyToOne(inversedBy: 'listas')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Categoria $categoria = null;

    public function __construct()
    {
        $this->usuarioManipulaListas = new ArrayCollection();
        $this->listaContieneElementos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
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
            $usuarioManipulaLista->setLista($this);
        }

        return $this;
    }

    public function removeUsuarioManipulaLista(UsuarioManipulaLista $usuarioManipulaLista): static
    {
        if ($this->usuarioManipulaListas->removeElement($usuarioManipulaLista)) {
            if ($usuarioManipulaLista->getLista() === $this) {
                $usuarioManipulaLista->setLista(null);
            }
        }

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
            $listaContieneElemento->setLista($this);
        }

        return $this;
    }

    public function removeListaContieneElemento(ListaContieneElemento $listaContieneElemento): static
    {
        if ($this->listaContieneElementos->removeElement($listaContieneElemento)) {
            if ($listaContieneElemento->getLista() === $this) {
                $listaContieneElemento->setLista(null);
            }
        }

        return $this;
    }

    public function getCategoria(): ?Categoria
    {
        return $this->categoria;
    }

    public function setCategoria(?Categoria $categoria): static
    {
        $this->categoria = $categoria;

        return $this;
    }
}