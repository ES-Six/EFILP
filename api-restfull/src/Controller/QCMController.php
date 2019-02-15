<?php

namespace App\Controller;

use App\Entity\Classe;
use App\Entity\QCM;
use App\Entity\User;
use App\Service\ClasseValidation;
use App\Service\QCMValidation;
use App\Service\Shared;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Routing\Matcher\RedirectableUrlMatcher;

class QCMController extends AbstractFOSRestController
{
    private $em;
    private $shared;
    private $validation;

    public function __construct(Shared $shared, QCMValidation $validation, EntityManagerInterface $em)
    {
        $this->em = $em;
        $this->shared = $shared;
        $this->validation = $validation;
    }

    /**
     * @Rest\Get("/professeurs/{id_professeur}/qcms")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param User $professeur
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/professeurs/{id_professeur}/qcms Voir les QCMs d'un professeur
     * @apiName GetQCMs
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/123/qcms"
     */
    public function getQCMsAction(User $professeur)
    {
        return $this->handleView($this->shared->createSuccessResponse($professeur->getQCMs()));
    }

    /**
     * @Rest\Post("/professeurs/{id_professeur}/qcms")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param User $professeur
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {post} /v1/professeurs/{id_professeur}/qcms Créer un QCMs
     * @apiName CreateQCMs
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {string} nom Le nom du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/123/qcms" -d '{"nom": "QCM_test"}'
     */
    public function createQCMsAction(Request $request, User $professeur)
    {
        $this->validation->validateCreateQCM($request);

        $qcm = new QCM();
        $qcm->setNom($request->get('nom'))
            ->setProfesseur($professeur);
        $this->em->persist($qcm);
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource créée', 201));
    }

    /**
     * @Rest\Put("/professeurs/{id_professeur}/qcms/{id_qcm}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     *
     * @param User $professeur
     * @param Request $request
     * @param QCM $qcm
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {put} /v1/professeurs/{id_professeur}/qcms/{id_qcm} Mettre à jour un QCMs
     * @apiName UpdateQCMs
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {string} nom Le nom du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X PUT -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/123/qcms/4" -d '{"nom": "QCM_test"}'
     */
    public function updateQCMsAction(Request $request, User $professeur, QCM $qcm)
    {
        $this->validation->validateUpdateQCM($request);

        $qcm->setNom($request->get('nom'));
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource mise à jour', 200));
    }

    /**
     * @Rest\Delete("/professeurs/{id_professeur}/qcms/{id_qcm}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     *
     * @param User $professeur
     * @param QCM $qcm
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {delete} /v1/professeurs/{id_professeur}/qcms/{id_qcm} Supprimer un QCMs
     * @apiName UpdateQCMs
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {number} id_qcm l'id du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/123/qcms/4"
     */
    public function deleteQCMsAction(User $professeur, QCM $qcm)
    {
        $this->em->remove($qcm);
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }
}
