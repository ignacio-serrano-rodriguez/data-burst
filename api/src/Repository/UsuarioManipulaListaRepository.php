<?php

namespace App\Repository;

use App\Entity\UsuarioManipulaLista;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UsuarioManipulaLista>
 *
 * @method UsuarioManipulaLista|null find($id, $lockMode = null, $lockVersion = null)
 * @method UsuarioManipulaLista|null findOneBy(array $criteria, array $orderBy = null)
 * @method UsuarioManipulaLista[]    findAll()
 * @method UsuarioManipulaLista[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UsuarioManipulaListaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UsuarioManipulaLista::class);
    }

    public function save(UsuarioManipulaLista $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(UsuarioManipulaLista $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}