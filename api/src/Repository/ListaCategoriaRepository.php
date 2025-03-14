<?php

namespace App\Repository;

use App\Entity\ListaCategoria;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ListaCategoria>
 *
 * @method ListaCategoria|null find($id, $lockMode = null, $lockVersion = null)
 * @method ListaCategoria|null findOneBy(array $criteria, array $orderBy = null)
 * @method ListaCategoria[]    findAll()
 * @method ListaCategoria[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ListaCategoriaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ListaCategoria::class);
    }
}