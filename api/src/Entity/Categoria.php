<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CategoriaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoriaRepository::class)]
#[ApiResource]
class Categoria
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $nombre = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descripcion = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'subcategorias')]
    #[ORM\JoinColumn(name: 'categoria_padre_id', referencedColumnName: 'id', nullable: true)]
    private ?Categoria $categoriaPadre = null;

    #[ORM\OneToMany(mappedBy: 'categoriaPadre', targetEntity: self::class)]
    private Collection $subcategorias;

    #[ORM\OneToMany(mappedBy: 'categoria', targetEntity: ElementoCategoria::class, orphanRemoval: true)]
    private Collection $elementoCategorias;

    #[ORM\OneToMany(mappedBy: 'categoria', targetEntity: ListaCategoria::class, orphanRemoval: true)]
    private Collection $listaCategorias;

    public function __construct()
    {
        $this->subcategorias = new ArrayCollection();
        $this->elementoCategorias = new ArrayCollection();
        $this->listaCategorias = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getCategoriaPadre(): ?self
    {
        return $this->categoriaPadre;
    }

    public function setCategoriaPadre(?self $categoriaPadre): static
    {
        $this->categoriaPadre = $categoriaPadre;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getSubcategorias(): Collection
    {
        return $this->subcategorias;
    }

    public function addSubcategoria(self $subcategoria): static
    {
        if (!$this->subcategorias->contains($subcategoria)) {
            $this->subcategorias->add($subcategoria);
            $subcategoria->setCategoriaPadre($this);
        }

        return $this;
    }

    public function removeSubcategoria(self $subcategoria): static
    {
        if ($this->subcategorias->removeElement($subcategoria)) {
            if ($subcategoria->getCategoriaPadre() === $this) {
                $subcategoria->setCategoriaPadre(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ElementoCategoria>
     */
    public function getElementoCategorias(): Collection
    {
        return $this->elementoCategorias;
    }

    public function addElementoCategoria(ElementoCategoria $elementoCategoria): static
    {
        if (!$this->elementoCategorias->contains($elementoCategoria)) {
            $this->elementoCategorias->add($elementoCategoria);
            $elementoCategoria->setCategoria($this);
        }

        return $this;
    }

    public function removeElementoCategoria(ElementoCategoria $elementoCategoria): static
    {
        if ($this->elementoCategorias->removeElement($elementoCategoria)) {
            if ($elementoCategoria->getCategoria() === $this) {
                $elementoCategoria->setCategoria(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ListaCategoria>
     */
    public function getListaCategorias(): Collection
    {
        return $this->listaCategorias;
    }

    public function addListaCategoria(ListaCategoria $listaCategoria): static
    {
        if (!$this->listaCategorias->contains($listaCategoria)) {
            $this->listaCategorias->add($listaCategoria);
            $listaCategoria->setCategoria($this);
        }

        return $this;
    }

    public function removeListaCategoria(ListaCategoria $listaCategoria): static
    {
        if ($this->listaCategorias->removeElement($listaCategoria)) {
            if ($listaCategoria->getCategoria() === $this) {
                $listaCategoria->setCategoria(null);
            }
        }

        return $this;
    }
}