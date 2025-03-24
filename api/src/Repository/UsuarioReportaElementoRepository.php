<?php

namespace App\Repository;

use App\Entity\UsuarioReportaElemento;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UsuarioReportaElemento>
 */
class UsuarioReportaElementoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UsuarioReportaElemento::class);
    }
}