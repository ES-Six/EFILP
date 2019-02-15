<?php

namespace App\Controller;

use App\Entity\Classe;
use App\Entity\User;
use App\Service\ClasseValidation;
use App\Service\Shared;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;

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
     * @Rest\Post("/professeurs/{id_professeur}/classes")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param User $professeur
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     *
     * @api {post} /v1/professeurs/{id_professeur} Créer une classe
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
}
