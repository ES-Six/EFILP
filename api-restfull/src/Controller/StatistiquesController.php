<?php

namespace App\Controller;

use App\Entity\Classe;
use App\Entity\Participant;
use App\Entity\QCM;
use App\Entity\Question;
use App\Entity\Reponse;
use App\Entity\Session;
use App\Entity\StatistiqueReponse;
use App\Entity\User;
use App\Service\ClasseValidation;
use App\Service\Shared;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class StatistiquesController extends AbstractFOSRestController
{
    private $em;
    private $shared;
    private $tokenStorage;

    public function __construct(Shared $shared,
                                EntityManagerInterface $em,
                                TokenStorageInterface $tokenStorage)
    {
        $this->em = $em;
        $this->shared = $shared;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @Rest\Get("/statistiques/session/{id_session}/questions/{id_question}")
     * @ParamConverter("question", options={"mapping": {"id_question" : "id"}})
     * @ParamConverter("session", options={"mapping": {"id_session" : "id"}})
     * @Security("is_granted('ROLE_PROFESSEUR') && user.getId() == session.getClasse().getProfesseur().getId()")
     *
     * @param Question $question
     * @param Session $session
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/professeurs/{id_professeur}/classes Voir une session par son code unique
     * @apiName StatistiquesReponsesParQuestionParSession
     * @apiGroup Sessions
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/statistiques/session/{id_session}/questions/{id_question}"
     */
    public function getStatistiqueReponsesParQuestionParSessionAction(Question $question, Session $session)
    {
        $subquery = $this->em->createQueryBuilder()
            ->select('COUNT(StatistiqueReponse.reponse)')
            ->from(StatistiqueReponse::class, 'StatistiqueReponse')
            ->andWhere('StatistiqueReponse.reponse = Reponse.id')
            ->andWhere('StatistiqueReponse.session = :id_session');

        $statiqtiquesReponsesParQuestionParSession = $this->em->createQueryBuilder()
            ->select('DISTINCT Reponse reponse')
            ->addSelect("({$subquery->getQuery()->getDQL()}) nbr_reponses")
            ->from(Reponse::class, 'Reponse')
            ->andWhere('Reponse.question = :id_question')
            ->setParameters(['id_question'=>$question->getId(), 'id_session'=>$session->getId()])
            ->getQuery()
            ->getResult();

        return $this->handleView($this->shared->createSuccessResponse($statiqtiquesReponsesParQuestionParSession));
    }

    /**
     * @Rest\Get("/statistiques/classes")
     * @Security("is_granted('ROLE_PROFESSEUR')")
     *
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/statistiques/classes Voir les sattistiques du nombre de bonnes / mauvaises réponses pour l'ensemble des classes d'un professeur
     * @apiName StatistiquesReponsesParClasse
     * @apiGroup Statistiques
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/statistiques/classes"
     */
    public function getStatistiqueReponsesParSessionsParClassesAction()
    {
        $classes = $this->tokenStorage->getToken()->getUser()->getClasses();
        $results = [];
        foreach ($classes as $classe) {
            $subqueryBonnesReponses = $this->em->createQueryBuilder()
                ->select('COUNT(SubStatistiqueGoodReponse.reponse)')
                ->from(StatistiqueReponse::class, 'SubStatistiqueGoodReponse')
                ->join('SubStatistiqueGoodReponse.reponse','ReponseSubStatistiqueGoodReponse')
                ->andWhere('ReponseSubStatistiqueGoodReponse.est_valide = 1')
                ->andWhere('SubStatistiqueGoodReponse.session = Session');

            $subqueryMauvaisesReponses = $this->em->createQueryBuilder()
                ->select('COUNT(SubStatistiqueBadReponse.reponse)')
                ->from(StatistiqueReponse::class, 'SubStatistiqueBadReponse')
                ->join('SubStatistiqueBadReponse.reponse','ReponseSubStatistiqueBadReponse')
                ->andWhere('ReponseSubStatistiqueBadReponse.est_valide = 0')
                ->andWhere('SubStatistiqueBadReponse.session = Session');

            $subqueryNbrParticipantParSession = $this->em->createQueryBuilder()
                ->select('COUNT(DISTINCT Participant.id)')
                ->from(Participant::class, 'Participant')
                ->from(StatistiqueReponse::class, 'SubStatistiqueParticipants')
                ->andWhere('Participant = SubStatistiqueParticipants.participant')
                ->andWhere('SubStatistiqueParticipants.session = Session');

            $subqueryNbrQuestionsParSession = $this->em->createQueryBuilder()
                ->select('COUNT(DISTINCT Question.id)')
                ->from(QCM::class, 'QCM')
                ->from(Question::class, 'Question')
                ->andWhere('QCM = Session.qcm')
                ->andWhere('Question.qcm = QCM');

            $statiqtiquesReponsesParQuestionParSession = $this->em->createQueryBuilder()
                ->select('DISTINCT Session session')
                ->addSelect("({$subqueryBonnesReponses->getQuery()->getDQL()}) nbr_bonnes_reponses")
                ->addSelect("({$subqueryMauvaisesReponses->getQuery()->getDQL()}) nbr_mauvaises_reponses")
                ->addSelect("({$subqueryNbrParticipantParSession->getQuery()->getDQL()}) nbr_total_participants")
                ->addSelect("({$subqueryNbrQuestionsParSession->getQuery()->getDQL()}) nbr_questions")
                ->from(StatistiqueReponse::class, 'StatistiqueReponse')
                ->from(Session::class, 'Session')
                ->from(Reponse::class, 'Reponse')
                ->join('Session.classe', 'Classe')
                ->andWhere('Classe.id = :id_classe')
                ->andWhere('StatistiqueReponse.session = Session')
                ->andWhere('Reponse = StatistiqueReponse.reponse')
                ->setParameters(['id_classe'=>$classe->getId()])
                ->getQuery()
                ->getResult();

            $results []= [
                'classe'=>$classe,
                'stats'=>$statiqtiquesReponsesParQuestionParSession
            ];
        }

        return $this->handleView($this->shared->createSuccessResponse($results));
    }

    /**
     * @Rest\Get("/statistiques/participant_en_difficulte")
     * @Security("is_granted('ROLE_PROFESSEUR')")
     *
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @api {get} /v1/statistiques/participant_en_difficulte Voir les participants en difficultés
     * @apiName StatistiquesParticipantsEnDifficulté
     * @apiGroup Statistiques
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Exemple d'utilisation:
     *     curl -X GET -H "Authorization: Bearer votre_jeton_d_authentification_ici" -i "http://api-rest-efilp/v1/statistiques/participant_en_difficulte"
     */
    public function getStatistiqueParticipantDifficulteAction()
    {
        // L'algorithme consiste à détecter les participants avec un ratio de bonnes réponses inferieur à 50%
        $classes = $this->tokenStorage->getToken()->getUser()->getClasses();
        $results = [];
        foreach ($classes as $classe) {
            $participants = [];

            $results []= $participants;
        }

        return $this->handleView($this->shared->createSuccessResponse($results));
    }
}
