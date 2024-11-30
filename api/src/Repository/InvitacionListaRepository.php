<?php

namespace App\Repository;

use App\Entity\InvitacionLista;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<InvitacionLista>
 *
 * @method InvitacionLista|null find($id, $lockMode = null, $lockVersion = null)
 * @method InvitacionLista|null findOneBy(array $criteria, array $orderBy = null)
 * @method InvitacionLista[]    findAll()
 * @method InvitacionLista[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvitacionListaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InvitacionLista::class);
    }

    public function save(InvitacionLista $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(InvitacionLista $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}