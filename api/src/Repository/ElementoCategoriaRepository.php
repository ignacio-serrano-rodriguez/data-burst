<?php

namespace App\Repository;

use App\Entity\ElementoCategoria;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ElementoCategoria>
 *
 * @method ElementoCategoria|null find($id, $lockMode = null, $lockVersion = null)
 * @method ElementoCategoria|null findOneBy(array $criteria, array $orderBy = null)
 * @method ElementoCategoria[]    findAll()
 * @method ElementoCategoria[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ElementoCategoriaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ElementoCategoria::class);
    }
}