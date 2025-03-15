<?php
namespace App\Repository;

use App\Entity\Lista;
use App\Entity\Categoria;
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
            ->leftJoin('l.listaCategorias', 'lc')
            ->where('lc.categoria = :categoriaId')
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
            ->leftJoin('l.listaCategorias', 'lc')
            ->where('lc.categoria = :categoriaId')
            ->setParameter('categoriaId', $categoriaId);

        return (int)$totalQueryBuilder
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function obtenerMasGustado(int $categoriaId, int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('l')
            ->select('e.nombre, SUM(CASE WHEN uep.puntuacion = true THEN 1 ELSE 0 END) as total')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->leftJoin('e.UsuarioElementoPuntuacions', 'uep')
            ->leftJoin('l.listaCategorias', 'lc')
            ->where('lc.categoria = :categoriaId')
            ->setParameter('categoriaId', $categoriaId)
            ->groupBy('e.nombre')
            ->orderBy('total', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function obtenerMasGustadoCount(int $categoriaId): int
    {
        $totalQueryBuilder = $this->createQueryBuilder('l')
            ->select('COUNT(DISTINCT e.nombre) as totalCount')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->leftJoin('e.UsuarioElementoPuntuacions', 'uep')
            ->leftJoin('l.listaCategorias', 'lc')
            ->where('lc.categoria = :categoriaId')
            ->andWhere('uep.puntuacion = true OR uep.puntuacion IS NULL')
            ->setParameter('categoriaId', $categoriaId);

        return (int)$totalQueryBuilder
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function obtenerMenosGustado(int $categoriaId, int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('l')
            ->select('e.nombre, SUM(CASE WHEN uep.puntuacion = false THEN 1 ELSE 0 END) as total')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->leftJoin('e.UsuarioElementoPuntuacions', 'uep')
            ->leftJoin('l.listaCategorias', 'lc')
            ->where('lc.categoria = :categoriaId')
            ->setParameter('categoriaId', $categoriaId)
            ->groupBy('e.nombre')
            ->orderBy('total', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function obtenerMenosGustadoCount(int $categoriaId): int
    {
        $totalQueryBuilder = $this->createQueryBuilder('l')
            ->select('COUNT(DISTINCT e.nombre) as totalCount')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->leftJoin('e.UsuarioElementoPuntuacions', 'uep')
            ->leftJoin('l.listaCategorias', 'lc')
            ->where('lc.categoria = :categoriaId')
            ->andWhere('uep.puntuacion = false OR uep.puntuacion IS NULL')
            ->setParameter('categoriaId', $categoriaId);

        return (int)$totalQueryBuilder
            ->getQuery()
            ->getSingleScalarResult();
    }
}