<?php

namespace App\Repository;

use App\Entity\QCM;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method QCM|null find($id, $lockMode = null, $lockVersion = null)
 * @method QCM|null findOneBy(array $criteria, array $orderBy = null)
 * @method QCM[]    findAll()
 * @method QCM[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QCMRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, QCM::class);
    }

    // /**
    //  * @return QCM[] Returns an array of QCM objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('q.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?QCM
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
