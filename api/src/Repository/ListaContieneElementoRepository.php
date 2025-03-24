<?php

namespace App\Repository;

use App\Entity\ListaContieneElemento;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ListaContieneElemento>
 */
class ListaContieneElementoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ListaContieneElemento::class);
    }
}
