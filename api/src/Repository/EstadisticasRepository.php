<?php
namespace App\Repository;

use App\Entity\Lista;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Lista>
 */
class EstadisticasRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Lista::class);
    }

    public function obtenerMasAgregado(int $categoriaId, int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('l')
            ->select('e.nombre, COUNT(e.id) as total')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->where('l.categoria = :categoriaId')
            ->setParameter('categoriaId', $categoriaId)
            ->groupBy('e.nombre')
            ->orderBy('total', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function obtenerMasAgregadoCount(int $categoriaId): int
    {
        $totalQueryBuilder = $this->createQueryBuilder('l')
            ->select('COUNT(DISTINCT e.nombre) as totalCount')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->where('l.categoria = :categoriaId')
            ->setParameter('categoriaId', $categoriaId);

        return (int)$totalQueryBuilder
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function obtenerMasGustado(int $categoriaId, int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;

        $query = $this->getEntityManager()->createQuery(
            'SELECT e.nombre, COUNT(uep.elemento) as total
             FROM App\Entity\Elemento e
             LEFT JOIN App\Entity\UsuarioElementoPuntuacion uep WITH uep.elemento = e AND uep.puntuacion = true
             LEFT JOIN App\Entity\ListaContieneElemento lce WITH lce.elemento = e
             LEFT JOIN App\Entity\Lista l WITH lce.lista = l
             WHERE l.categoria = :categoriaId
             GROUP BY e.nombre
             ORDER BY total DESC'
        )
        ->setParameter('categoriaId', $categoriaId)
        ->setFirstResult($offset)
        ->setMaxResults($limit);

        return $query->getResult();
    }

    public function obtenerMasGustadoCount(int $categoriaId): int
    {
        $query = $this->getEntityManager()->createQuery(
            'SELECT COUNT(DISTINCT e.nombre) as totalCount
             FROM App\Entity\Elemento e
             LEFT JOIN App\Entity\ListaContieneElemento lce WITH lce.elemento = e
             LEFT JOIN App\Entity\Lista l WITH lce.lista = l
             LEFT JOIN App\Entity\UsuarioElementoPuntuacion uep WITH uep.elemento = e
             WHERE l.categoria = :categoriaId'
        )
        ->setParameter('categoriaId', $categoriaId);

        return (int)$query->getSingleScalarResult();
    }

    public function obtenerMenosGustado(int $categoriaId, int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;

        $query = $this->getEntityManager()->createQuery(
            'SELECT e.nombre, COUNT(uep.elemento) as total
             FROM App\Entity\Elemento e
             LEFT JOIN App\Entity\UsuarioElementoPuntuacion uep WITH uep.elemento = e AND uep.puntuacion = false
             LEFT JOIN App\Entity\ListaContieneElemento lce WITH lce.elemento = e
             LEFT JOIN App\Entity\Lista l WITH lce.lista = l
             WHERE l.categoria = :categoriaId
             GROUP BY e.nombre
             ORDER BY total DESC'
        )
        ->setParameter('categoriaId', $categoriaId)
        ->setFirstResult($offset)
        ->setMaxResults($limit);

        return $query->getResult();
    }

    public function obtenerMenosGustadoCount(int $categoriaId): int
    {
        $query = $this->getEntityManager()->createQuery(
            'SELECT COUNT(DISTINCT e.nombre) as totalCount
             FROM App\Entity\Elemento e
             LEFT JOIN App\Entity\ListaContieneElemento lce WITH lce.elemento = e
             LEFT JOIN App\Entity\Lista l WITH lce.lista = l
             LEFT JOIN App\Entity\UsuarioElementoPuntuacion uep WITH uep.elemento = e
             WHERE l.categoria = :categoriaId'
        )
        ->setParameter('categoriaId', $categoriaId);

        return (int)$query->getSingleScalarResult();
    }
}