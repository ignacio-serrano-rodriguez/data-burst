<?php

namespace App\Repository;

use App\Entity\UsuarioAgregaUsuario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UsuarioAgregaUsuario>
 */
class UsuarioAgregaUsuarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UsuarioAgregaUsuario::class);
    }
}