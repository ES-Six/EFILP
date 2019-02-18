<?php

namespace App\Controller;

use App\Entity\Classe;
use App\Entity\QCM;
use App\Entity\Session;
use App\Entity\User;
use App\Service\SessionValidation;
use App\Service\Shared;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class SessionController extends AbstractFOSRestController
{
    private $em;
    private $shared;
    private $validation;

    public function __construct(Shared $shared, SessionValidation $validation, EntityManagerInterface $em)
    {
        $this->em = $em;
        $this->shared = $shared;
        $this->validation = $validation;
    }

    /**
     * @Rest\Get("/apprenant/sessions/{code_session}")
     * @ParamConverter("session", options={"mapping": {"code_session" : "id"}})
     *
     * @param Session $session
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/professeurs/{id_professeur}/classes Voir une session par son code unique
     * @apiName FindSession
     * @apiGroup Sessions
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/123/sessions/00000001"
     */
    public function getSessionApprenantAction(Session $session)
    {
        return $this->handleView($this->shared->createSuccessResponse($session));
    }

    /**
     * @Rest\Get("/professeurs/{id_professeur}/sessions")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param User $professeur
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/professeurs/{id_professeur}/classes Voir une session par son code unique
     * @apiName FindSession
     * @apiGroup Sessions
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/123/sessions"
     */
    public function getSessionProfesseurAction(User $professeur)
    {
        $sessions = $this->em->createQueryBuilder()
            ->select('DISTINCT Sessions')
            ->from(Classe::class, 'Classes')
            ->from(Session::class, 'Sessions')
            ->andWhere('Classes.id = Sessions.classe')
            ->getQuery()
            ->getResult();
        return $this->handleView($this->shared->createSuccessResponse($sessions));
    }

    /**
     * @Rest\Post("/professeurs/{id_professeur}/sessions")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     * @ParamConverter("qcm", converter="request_param_converter", options={"mapping": {"id_qcm" : "id"}})
     * @ParamConverter("classe", converter="request_param_converter", options={"mapping": {"id_classe" : "id"}})
     *
     * @param Request $request
     * @param User $professeur
     * @param QCM $qcm
     * @param Classe $classe
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {post} /v1/professeurs/{id_professeur}/sessions Créer une session
     * @apiName CreateSession
     * @apiGroup Sessions
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {number} id_qcm l'id du qcm auquel la session sera lié
     * @apiParam {number} id_classe l'id de la classe à laquelle la session sera liée
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-restfull/v1/professeurs/sessions" -d '{"id_qcm": "123", "id_classe": "4"}'
     */
    public function createSessionAction(Request $request, User $professeur, QCM $qcm, Classe $classe)
    {
        $this->validation->validateCreateSession($request);

        $session = new Session();
        $session->setNomSession($request->get('nom'))
            ->setQcm($qcm)
            ->setClasse($classe)
            ->setConfigAffichageClassement($request->get('afficher_classement'))
            ->setConfigGenerationPseudo($request->get('generer_pseudo'));
        $this->em->persist($session);
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse($session, 'ressource créé', 201));
    }

    /**
     * @Rest\Delete("/sessions/{id_session}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === session.getClasse().getProfesseur().getId()")
     * @ParamConverter("session", options={"mapping": {"id_session" : "id"}})
     *
     * @param Session $session
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     *
     * @api {delete} /v1/sessions/{id_session} Supprimer une session
     * @apiName DeleteSession
     * @apiGroup Sessions
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_session l'id de la session
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-restfull/v1/professeurs/123/sessions/4"
     */
    public function deleteSessionAction(Session $session)
    {
        $this->em->remove($session);
        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }
}
