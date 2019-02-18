<?php

namespace App\Controller;

use App\Entity\User;
use App\Exception\ForbiddenRequestException;
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

    public function __construct(Shared $shared,
                                UserValidation $validation,
                                EntityManagerInterface $em,
                                TokenStorageInterface $tokenStorage)
    {
        $this->em = $em;
        $this->shared = $shared;
        $this->tokenStorage = $tokenStorage;
        $this->validation = $validation;
    }

    /**
     * @api {post} /v1/login_check Obtenir un token d'authentification
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
     * @apiGroup Users
     * @apiVersion 1.0.0
     *
     * @apiParam {string} nom le nom associé au compte
     * @apiParam {string} prenom le prénom associé au compte
     * @apiParam {string} username l'identifiant du compte
     * @apiParam {string} password le mot de passe du compte
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-restfull/v1/professeurs/register" -d '{"username": "nom_d_utilisateur", "password": "greetings earthling", "nom": "UN_NOM", "prenom": "UN_PRENOM"}'
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
     * @Rest\Patch("/professeurs/{id_professeur}/info")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param Request $request
     * @param User $professeur
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     *
     * @api {patch} /v1/professeurs/{id_professeur}/info Mettre à jour les informations personelles
     * @apiName UpdateProfesseur
     * @apiGroup Users
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {string} nom le nom associé au compte
     * @apiParam {string} prenom le prénom associé au compte
     * @apiParam {string} username l'identifiant du compte
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X PATCH -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-restfull/v1/professeurs/{id_professeur}/info" -d '{"username": "nom_d_utilisateur", "nom": "UN_NOM", "prenom": "UN_PRENOM"}'
     */
    public function updateInfoProfesseurAction(Request $request, User $professeur)
    {
        $this->validation->validateUpdateUserInfo($request, $professeur);

        $professeur->setNom($request->get('nom'))
            ->setPrenom($request->get('prenom'))
            ->setUsername($request->get('username'));

        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource mise à jour', 200));
    }

    /**
     * @Rest\Patch("/professeurs/{id_professeur}/password")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param Request $request
     * @param User $professeur
     * @param UserPasswordEncoderInterface $encoder
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws ForbiddenRequestException
     * @throws \App\Exception\BadRequestException
     *
     * @api {patch} /v1/professeurs/{id_professeur}/password Mettre à jour le mot de passe
     * @apiName UpdatePasswordProfesseur
     * @apiGroup Users
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {string} currentPassword l'ancien mot de passe
     * @apiParam {string} newPassword le nouveau mot de passe
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X PATCH -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-restfull/v1/professeurs/{id_professeur}/password" -d '{"username": "nom_d_utilisateur", "nom": "UN_NOM", "prenom": "UN_PRENOM"}'
     */
    public function updatePasswordProfesseurAction(Request $request, User $professeur, UserPasswordEncoderInterface $encoder)
    {
        $this->validation->validateUpdateUserPassword($request);

        if ($encoder->isPasswordValid($professeur, $request->get('currentPassword'))) {
            $professeur->setPassword($encoder->encodePassword($professeur, $request->get('password')));
            $this->em->flush();
        } else {
            throw new ForbiddenRequestException('currentPassword: Mot de passe erroné');
        }
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource mise à jour', 200));
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
     * @apiGroup Users
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-restfull/v1/professeurs/123"
     *
     */
    public function delProfesseurAction(User $professeur)
    {
        $this->em->remove($professeur);
        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }
}
