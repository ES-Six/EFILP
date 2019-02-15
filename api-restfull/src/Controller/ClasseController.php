<?php

namespace App\Controller;

use App\Entity\Classe;
use App\Entity\User;
use App\Service\ClasseValidation;
use App\Service\Shared;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class ClasseController extends AbstractFOSRestController
{
    private $em;
    private $shared;
    private $validation;

    public function __construct(Shared $shared, ClasseValidation $validation, EntityManagerInterface $em)
    {
        $this->em = $em;
        $this->shared = $shared;
        $this->validation = $validation;
    }

    /**
     * @Rest\Get("/professeurs/{id_professeur}/classes")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param User $professeur
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/professeurs/{id_professeur}/classes Voir les classes d'un professeur
     * @apiName GetClasses
     * @apiGroup Classes
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/123/classes"
     */
    public function getClassesAction(User $professeur)
    {
        return $this->handleView($this->shared->createSuccessResponse($professeur->getClasses()));
    }

    /**
     * @Rest\Post("/professeurs/{id_professeur}/classes")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param User $professeur
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     *
     * @api {post} /v1/professeurs/{id_professeur}/classes Créer une classe
     * @apiName CreateClasse
     * @apiGroup Classes
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {string} nom Le nom de la classe
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-base.hub3e.com/v1/professeurs/123/classes" -d '{"nom": "terminale_1"}'
     */
    public function createClasseAction(Request $request, User $professeur)
    {
        $this->validation->validateCreateClass($request);

        $classe = new Classe();
        $classe->setNom($request->get('nom'))
            ->setProfesseur($professeur);

        $this->em->persist($classe);
        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource créé', 201));
    }

    /**
     * @Rest\Put("/professeurs/{id_professeur}/classes/{id_classe}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     * @ParamConverter("classe", options={"mapping": {"id_classe" : "id"}})
     *
     * @param User $professeur
     * @param Classe $classe
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     *
     * @api {put} /v1/professeurs/{id_professeur}/classes/{id_classe} Mettre à jour une classe
     * @apiName UpdateClasse
     * @apiGroup Classes
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {number} id_classe l'id de la classe
     * @apiParam {string} nom Le nom de la classe
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X PUT -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-base.hub3e.com/v1/professeurs/123/classes/2" -d '{"nom": "terminale_1"}'
     */
    public function updateClasseAction(Request $request, User $professeur, Classe $classe)
    {
        $this->validation->validateUpdateClass($request);

        $classe->setNom($request->get('nom'))
            ->setProfesseur($professeur);

        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource mise à jour', 200));
    }

    /**
     * @Rest\Delete("/professeurs/{id_professeur}/classes/{id_classe}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     * @ParamConverter("classe", options={"mapping": {"id_classe" : "id"}})
     *
     * @param User $professeur
     * @param Classe $classe
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     *
     * @api {delete} /v1/professeurs/{id_professeur}/classes/{id_classe} Supprimer une classe
     * @apiName DeleteClasse
     * @apiGroup Classes
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {number} id_classe l'id de la classe
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-base.hub3e.com/v1/professeurs/123/classes/1"
     */
    public function deleteClasseAction(User $professeur, Classe $classe)
    {
        $this->em->remove($classe);
        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }
}
