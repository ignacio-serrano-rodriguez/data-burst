<?php

namespace App\Repository;

use App\Entity\UsuarioGestionaElemento;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UsuarioGestionaElemento>
 */
class UsuarioGestionaElementoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UsuarioGestionaElemento::class);
    }
}