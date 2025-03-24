<?php

namespace App\Repository;

use App\Entity\Invitacion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Invitacion>
 *
 * @method Invitacion|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invitacion|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invitacion[]    findAll()
 * @method Invitacion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvitacionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invitacion::class);
    }

    public function save(Invitacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Invitacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}