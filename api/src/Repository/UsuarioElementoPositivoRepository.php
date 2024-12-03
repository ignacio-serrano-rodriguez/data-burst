<?php

namespace App\Repository;

use App\Entity\UsuarioElementoPositivo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UsuarioElementoPositivo>
 *
 * @method UsuarioElementoPositivo|null find($id, $lockMode = null, $lockVersion = null)
 * @method UsuarioElementoPositivo|null findOneBy(array $criteria, array $orderBy = null)
 * @method UsuarioElementoPositivo[]    findAll()
 * @method UsuarioElementoPositivo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UsuarioElementoPositivoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UsuarioElementoPositivo::class);
    }

    public function save(UsuarioElementoPositivo $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(UsuarioElementoPositivo $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}