<?php

namespace App\Controller;

use App\Entity\Classe;
use App\Entity\Media;
use App\Entity\QCM;
use App\Entity\Question;
use App\Entity\Reponse;
use App\Entity\User;
use App\Exception\BadRequestException;
use App\Service\ClasseValidation;
use App\Service\QCMValidation;
use App\Service\Shared;
use Doctrine\DBAL\ConnectionException;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Routing\Matcher\RedirectableUrlMatcher;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class QCMController extends AbstractFOSRestController
{
    private $em;
    private $tokenStorage;
    private $shared;
    private $validation;

    public function __construct(Shared $shared, QCMValidation $validation, EntityManagerInterface $em, TokenStorageInterface $tokenStorage)
    {
        $this->em = $em;
        $this->shared = $shared;
        $this->validation = $validation;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @Rest\Get("/professeurs/{id_professeur}/qcms")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == request.get('id_professeur')")
     * @ParamConverter("professeur", options={"mapping": {"id_professeur" : "id"}})
     *
     * @param User $professeur
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/professeurs/{id_professeur}/qcms Voir tous les QCMs d'un professeur
     * @apiName GetAllQCMsLite
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/professeurs/123/qcms"
     */
    public function getQCMsAction(User $professeur)
    {
        return $this->handleView($this->shared->createSuccessResponse($professeur->getQCMs(), null, 200, ['lite']));
    }

    /**
     * @Rest\Get("/qcms/{id_qcm}")
     * @Security("is_granted('ROLE_PROFESSEUR') && qcm.getProfesseur().getId() == user.getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     *
     * @param QCM $qcm
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/qcms Voir les détails d'un QCMs d'un professeur
     * @apiName GetCompleteQCMs
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/1"
     */
    public function getQCMAction(QCM $qcm)
    {
        return $this->handleView($this->shared->createSuccessResponse($qcm, null, 200, ['complete', 'questions' => ['Default']]));
    }

    /**
     * @Rest\Post("/qcms")
     * @Security("is_granted('ROLE_PROFESSEUR')")
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {post} /v1/qcms Créer un QCMs
     * @apiName CreateQCMs
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiParam {string} nom Le nom du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms" -d '{"nom": "QCM_test"}'
     */
    public function createQCMsAction(Request $request)
    {
        $this->validation->validateCreateQCM($request);

        $qcm = new QCM();
        $qcm->setNom($request->get('nom'))
            ->setProfesseur($this->tokenStorage->getToken()->getUser());
        $this->em->persist($qcm);
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource créée', 201));
    }

    /**
     * @Rest\Put("/qcms/{id_qcm}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     *
     * @param Request $request
     * @param QCM $qcm
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {put} /v1/qcms/{id_qcm} Mettre à jour un QCMs
     * @apiName UpdateQCMs
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {string} nom Le nom du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X PUT -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4" -d '{"nom": "QCM_test"}'
     */
    public function updateQCMsAction(Request $request, QCM $qcm)
    {
        $this->validation->validateUpdateQCM($request);

        $qcm->setNom($request->get('nom'));
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource mise à jour', 200));
    }

    /**
     * @Rest\Delete("/qcms/{id_qcm}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     *
     * @param QCM $qcm
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {delete} /v1/qcms/{id_qcm} Supprimer un QCMs
     * @apiName DeleteQCMs
     * @apiGroup QCMs
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {number} id_qcm l'id du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4"
     */
    public function deleteQCMsAction(QCM $qcm)
    {
        $this->em->remove($qcm);
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }

    /**
     * @Rest\Post("/qcms/{id_qcm}/questions")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     *
     * @param Request $request
     * @param QCM $qcm
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     * @throws \Doctrine\ORM\NonUniqueResultException
     *
     * @api {post} /v1/qcms/{id_qcm}/questions Ajouter une question à un QCM
     * @apiName CreateQuestionQCMs
     * @apiGroup Questions
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_qcm l'id du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions" -d '{"duree": 120,"titre": "Qui est perlimpinpin ?"}'
     */
    public function createQuestionQCMsAction(Request $request, QCM $qcm)
    {
        $this->validation->validateCreateQuestion($request);

        // Obtenir la position maximale des questions du QCM
        $maxPosition = $this->em->createQueryBuilder()
            ->select('MAX(Question.position) max_position')
            ->from(Question::class, 'Question')
            ->join('Question.qcm', 'QCM')
            ->where('QCM.id = :id_qcm')
            ->setParameter('id_qcm', $qcm->getId())
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleScalarResult();

        // Créer la question dans le QCM
        $question = new Question();
        $question->setDuree($request->get('duree'))
            ->setTitre($request->get('titre'))
            ->setPosition(!empty($maxPosition) ? $maxPosition + 1 : 1)
            ->setQcm($qcm);

        $this->em->persist($question);
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(['id_question'=>$question->getId()], 'ressource créée', 201));
    }

    /**
     * @Rest\Put("/qcms/{id_qcm}/questions/{id_question}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     * @ParamConverter("question", options={"mapping": {"id_question" : "id"}})
     *
     * @param QCM $qcm
     * @param Question $question
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {put} /v1/qcms/{id_qcm}/questions/{id_question} Mettre à jour une question
     * @apiName UpdateQuestion
     * @apiGroup Questions
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {number} id_question l'id de la question du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X PUT -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions/1" -d '{"duree": 120,"titre": "Qui est perlimpinpin ?"}'
     */
    public function updateQuestionQCMsAction(Request $request, QCM $qcm, Question $question)
    {
        $this->validation->validateUpdateQuestion($request);
        $this->validation->validateQuestionBelongToQCM($qcm, $question);

        $question->setDuree($request->get('duree'))
            ->setTitre($request->get('titre'))
            ->setQcm($qcm);

        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource mise à jour', 200));
    }

    /**
     * @Rest\Delete("/qcms/{id_qcm}/questions/{id_question}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     * @ParamConverter("question", options={"mapping": {"id_question" : "id"}})
     *
     * @param QCM $qcm
     * @param Question $question
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {delete} /v1/qcms/{id_qcm}/questions/{id_question} Supprimer une question
     * @apiName DeleteQuestion
     * @apiGroup Questions
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {number} id_question l'id de la question
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions/2"
     */
    public function deleteQCMQuestionAction(QCM $qcm, Question $question)
    {
        $this->validation->validateQuestionBelongToQCM($qcm, $question);

        $next_questions = $this->em->createQueryBuilder()
            ->select('DISTINCT Question')
            ->from(Question::class, 'Question')
            ->where('Question.position > :position')
            ->setParameter('position', $question->getPosition())
            ->orderBy('Question.position', 'ASC')
            ->getQuery()
            ->getResult();

        foreach ($next_questions as $next_question) {
            $next_question->setPosition($next_question->getPosition() - 1);
        }

        $this->em->remove($question);
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }

    /**
     * @Rest\Patch("/qcms/{id_qcm}/questions/position")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     *
     * @param Request $request
     * @param QCM $qcm
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {post} /v1/qcms/{id_qcm}/questions/position Mettre à jour l'ordre des questions d'un QCM
     * @apiName UpdatePositionQuestion
     * @apiGroup Questions
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_qcm l'id du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X PATCH -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions/position" -d '{updates: [{id: 1, position: 1}, {id: 3, position: 2}, {id: 2, position: 3}]}'
     */
    public function updatePositionQuestionAction(Request $request, QCM $qcm)
    {
        // $this->validation->validateCreateQuestion($request);

        $updates = $request->get('updates');
        $questions = $qcm->getQuestions();

        foreach ($questions as $idx => $question) {
            foreach ($updates as $update) {
                if ($update['id'] === $question->getId()) {
                    $questions[$idx]->setPosition($update['position']);
                }
            }
        }

        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'position des questions mise à jour', 201));
    }

    /**
     * @Rest\Post("/qcms/{id_qcm}/questions/{id_question}/reponses")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     * @ParamConverter("question", options={"mapping": {"id_question" : "id"}})
     *
     * @param Request $request
     * @param QCM $qcm
     * @param Question $question
     * @param Reponse $reponse
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {post} /v1/qcms/{id_qcm}/questions/{id_question}/reponses Ajouter une réponse à une question
     * @apiName CreateReponse
     * @apiGroup Reponses
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {number} id_question l'id de la question
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions/123/reponses" -d '{"nom":"Un lapin ?","est_valide":true}'
     */
    public function createReponseToQuestionQCMsAction(Request $request, QCM $qcm, Question $question)
    {
        $this->validation->validateCreateReponse($request);
        $this->validation->validateQuestionBelongToQCM($qcm, $question);

        $reponse = new Reponse();

        $reponse->setNom($request->get('nom'))
            ->setEstValide($request->get('est_valide'))
            ->setQuestion($question);

        $this->em->persist($reponse);

        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource créée', 201));
    }

    /**
     * @Rest\Put("/qcms/{id_qcm}/questions/{id_question}/reponses/{id_reponse}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     * @ParamConverter("question", options={"mapping": {"id_question" : "id"}})
     * @ParamConverter("reponse", options={"mapping": {"id_reponse" : "id"}})
     *
     * @param QCM $qcm
     * @param Question $question
     * @param Reponse $reponse
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {put} /v1/qcms/{id_qcm}/questions/{id_question}/reponses/{id_reponse} Mettre à jour une réponse
     * @apiName CreateQuestionQCMs
     * @apiGroup Reponses
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_professeur l'id du compte professeur
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {number} id_question l'id de la question du QCM
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X PUT -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions/1/reponses/4" -d ''
     */
    public function updateReponseQCMsAction(Request $request, QCM $qcm, Question $question, Reponse $reponse)
    {
        $this->validation->validateUpdateReponse($request);
        $this->validation->validateQuestionBelongToQCM($qcm, $question);
        $this->validation->validateReponseBelongToQuestion($question, $reponse);

        $reponse->setNom($request->get('nom'))
            ->setEstValide($request->get('est_valide'));

        $this->em->flush();
        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource mise à jour', 200));
    }

    /**
     * @Rest\Delete("/qcms/{id_qcm}/questions/{id_question}/reponses/{id_reponse}")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     * @ParamConverter("question", options={"mapping": {"id_question" : "id"}})
     * @ParamConverter("reponse", options={"mapping": {"id_reponse" : "id"}})
     *
     * @param QCM $qcm
     * @param Question $question
     * @param Reponse $reponse
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {delete} /v1/qcms/{id_qcm}/questions/{id_question}/reponses/{id_reponse} Supprimer une réponse
     * @apiName DeleteReponseQCMs
     * @apiGroup Reponses
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {number} id_question l'id de la question
     * @apiParam {number} id_reponse l'id de la réponse
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions/2/reponses/42"
     */
    public function deleteQCMReponseAction(QCM $qcm, Question $question, Reponse $reponse)
    {
        $this->validation->validateQuestionBelongToQCM($qcm, $question);
        $this->validation->validateReponseBelongToQuestion($question, $reponse);

        $this->em->remove($reponse);
        $this->em->flush();

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }

    /**
     * @Rest\Post("/qcms/{id_qcm}/questions/{id_question}/media")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     * @ParamConverter("question", options={"mapping": {"id_question" : "id"}})
     *
     * @param Request $request
     * @param QCM $qcm
     * @param Question $question
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws BadRequestException
     * @throws ConnectionException
     *
     * @api {post} /v1/qcms/{id_qcm}/questions/{id_question}/media Définir ou remplacer le média d'une question
     * @apiName UpsertMedia
     * @apiGroup Media
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {number} id_question l'id de la question
     * @apiParam {string} url l'url qui pointe vers le média
     * @apiParam {string} type le type du média
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X POST -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions/2/media" -d '{"url": "http://www.lesite.com/image.jpg", "type": "IMAGE"}'
     */
    public function upsertMediaAction(Request $request, QCM $qcm, Question $question)
    {
        $this->validation->validateQuestionBelongToQCM($qcm, $question);
        $message = 'ressource ajoutée';

        $this->em->transactional(function(EntityManagerInterface $em) use ($request, &$message, $question) {
            if ($question->getMedia() instanceof Media) {
                $em->remove($question->getMedia());
                $question->setMedia(null);
                $em->flush();
                $message = 'ressource mise à jour';
            }

            $media = new Media();
            $media->setQuestion($question)
                ->setType($request->get('type'))
                ->setUrl($request->get('url'));

            $em->persist($media);
            $em->flush();
        });

        return $this->handleView($this->shared->createSuccessResponse(null, $message, 200));
    }

    /**
     * @Rest\Delete("/qcms/{id_qcm}/questions/{id_question}/media")
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() === qcm.getProfesseur().getId()")
     * @ParamConverter("qcm", options={"mapping": {"id_qcm" : "id"}})
     * @ParamConverter("question", options={"mapping": {"id_question" : "id"}})
     *
     * @param QCM $qcm
     * @param Question $question
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \App\Exception\BadRequestException
     *
     * @api {delete} /v1/qcms/{id_qcm}/questions/{id_question}/media Supprimer un média
     * @apiName DeleteMedia
     * @apiGroup Media
     * @apiVersion 1.0.0
     *
     * @apiParam {number} id_qcm l'id du QCM
     * @apiParam {number} id_question l'id de la question
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X DELETE -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/qcms/4/questions/2/media"
     */
    public function deleteMediaAction(QCM $qcm, Question $question)
    {
        $this->validation->validateQuestionBelongToQCM($qcm, $question);

        if ($question->getMedia() instanceof Media) {
            $this->em->remove($question->getMedia());
            $this->em->flush();
        } else {
            throw new BadRequestException(["La question avec l'ID ".$question->getId()." n'a pas de média"]);
        }

        return $this->handleView($this->shared->createSuccessResponse(null, 'ressource supprimée', 200));
    }
}
