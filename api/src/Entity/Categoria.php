<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CategoriaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    #[ORM\OneToMany(mappedBy: 'categoria', targetEntity: Elemento::class)]
    private Collection $elementos;

    #[ORM\OneToMany(mappedBy: 'categoria', targetEntity: Lista::class)]
    private Collection $listas;

    public function __construct()
    {
        $this->elementos = new ArrayCollection();
        $this->listas = new ArrayCollection();
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
            $elemento->setCategoria($this);
        }

        return $this;
    }

    public function removeElemento(Elemento $elemento): static
    {
        if ($this->elementos->removeElement($elemento)) {
            if ($elemento->getCategoria() === $this) {
                $elemento->setCategoria(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Lista>
     */
    public function getListas(): Collection
    {
        return $this->listas;
    }

    public function addLista(Lista $lista): static
    {
        if (!$this->listas->contains($lista)) {
            $this->listas->add($lista);
            $lista->setCategoria($this);
        }

        return $this;
    }

    public function removeLista(Lista $lista): static
    {
        if ($this->listas->removeElement($lista)) {
            if ($lista->getCategoria() === $this) {
                $lista->setCategoria(null);
            }
        }

        return $this;
    }
}