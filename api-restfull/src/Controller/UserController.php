<?php

namespace App\Controller;

use App\Service\Shared;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Entity;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends AbstractFOSRestController
{
    private $em;
    private $tokenStorage;
    private $shared;
    private $mailer;

    public function __construct(Shared $shared, EntityManagerInterface $em, TokenStorageInterface $tokenStorage, \Swift_Mailer $mailer)
    {
        $this->em = $em;
        $this->shared = $shared;
        $this->tokenStorage = $tokenStorage;
        $this->mailer = $mailer;
    }

    /**
     * @Rest\Get("/users/current")
     * @Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @api {get} /v1/professeur/users/current Voir le professeur actuellement connecté
     * @apiName GetCurrentProfesseur
     * @apiGroup Users
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeur/users/current"
     */
    public function currentUserAction()
    {
        return $this->handleView($this->shared->createSuccessResponse($this->tokenStorage->getToken()->getUser()));
    }
}
