<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\Shared;
use App\Service\UserValidation;
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
    private $validation;
    private $mailer;

    public function __construct(Shared $shared, UserValidation $validation, EntityManagerInterface $em, TokenStorageInterface $tokenStorage, \Swift_Mailer $mailer)
    {
        $this->em = $em;
        $this->shared = $shared;
        $this->tokenStorage = $tokenStorage;
        $this->mailer = $mailer;
        $this->validation = $validation;
    }

    /**
     * @api {get} /v1/login_check Obtenir un token d'authentification
     * @apiName LoginProfesseur
     * @apiGroup Users
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -i "http://api-rest-efilp/v1/login_check" -d '{"username": "TEST", "password": "testpass"}'
     */

    /**
     * @Rest\Get("/professeurs/current")
     * @Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @api {get} /v1/professeurs/current Voir le professeur actuellement connecté
     * @apiName GetCurrentProfesseur
     * @apiGroup Users
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/current"
     */
    public function currentUserAction()
    {
        return $this->handleView($this->shared->createSuccessResponse($this->tokenStorage->getToken()->getUser()));
    }

    /**
     * @Rest\Post("/professeurs/register")
     *
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     *
     * @api {post} /v1/professeurs/register Créer un compte professeur
     * @apiName CreateProfesseur
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {string} nom le nom associé au compte
     * @apiParam {string} prenom le prénom associé au compte
     * @apiParam {string} username l'identifiant du compte
     * @apiParam {string} password le mot de passe du compte
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-base.hub3e.com/v1/professeurs/register" -d '{"username": "nom_d_utilisateur", "password": "greetings earthling", "nom": "UN_NOM", "prenom": "UN_PRENOM"}'
     */
    public function createProfesseurAction(Request $request, UserPasswordEncoderInterface $encoder)
    {
        $this->validation->validateCreateUser($request);

        $user = new User();
        $user->setNom($request->get('nom'))
            ->setPrenom($request->get('prenom'))
            ->setRoles('ROLE_PROFESSEUR')
            ->setUsername($request->get('username'))
            ->setPassword($encoder->encodePassword($user, $request->get('password')));

        $this->em->persist($user);
        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource créé', 201));
    }

    /**
     * @Rest\Delete("/professeurs/{id_professeur}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param User $professeur
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {delete} /v1/professeurs/{id_professeur} Effacer un professeur
     * @apiName DeleteProfesseur
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-base.hub3e.com/v1/professeurs/123"
     *
     */
    public function delProfesseurAction(User $professeur)
    {
        $this->em->remove($professeur);
        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }
}
