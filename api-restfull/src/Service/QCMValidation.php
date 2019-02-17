<?php

namespace App\Service;

use App\Entity\QCM;
use App\Entity\Question;
use App\Entity\Reponse;
use App\Entity\User;
use App\Exception\ConflictException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Exception\BadRequestException;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\NotBlank;

class QCMValidation
{
    private $em;
    private $errors = array();

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @throws BadRequestException
     */
    private function flushErrors()
    {
        if (count($this->errors) > 0) {
            throw new BadRequestException($this->errors);
        }
    }

    private function storeErrors(String $field, $violations)
    {
        if (count($violations) !== 0) {
            foreach ($violations as $violation) {
                array_push($this->errors, "$field: ".$violation->getMessage());
            }
        }
    }

    /**
     * @param Request $request
     * @throws BadRequestException
     */
    public function validateCreateQCM(Request $request)
    {
        $validator = Validation::createValidator();

        $violations = $validator->validate($request->get('nom'), [
            new NotBlank([
                'message' => "Un nom de classe doit être spécifié"
            ]),
            new Length([
                'max'=>255,
                'maxMessage' => "Un nom de QCM fait au maximum 255 caractères"
            ])
        ]);
        $this->storeErrors('nom', $violations);

        $this->flushErrors();
    }

    /**
     * @param Request $request
     * @throws BadRequestException
     */
    public function validateUpdateQCM(Request $request)
    {
        $validator = Validation::createValidator();

        $violations = $validator->validate($request->get('nom'), [
            new NotBlank([
                'message' => "Un nom de classe doit être spécifié"
            ]),
            new Length([
                'max'=>255,
                'maxMessage' => "Un nom de QCM fait au maximum 255 caractères"
            ])
        ]);
        $this->storeErrors('nom', $violations);

        $this->flushErrors();
    }

    /**
     * @param QCM $qcm
     * @param Question $question
     * @throws BadRequestException
     */
    public function validateQuestionBelongToQCM(QCM $qcm, Question $question)
    {
        if (!$qcm->getId() === $question->getQcm()->getId()) {
            $idQCM = $qcm->getId();
            $idQuestion = $question->getId();
            throw new BadRequestException(["La question avec l'ID $idQuestion n'existe pas dans le QCM avec l'ID $idQCM"]);
        }
    }

    /**
     * @param QCM $qcm
     * @param Question $question
     * @throws BadRequestException
     */
    public function validateReponseBelongToQuestion(Question $question, Reponse $reponse)
    {
        if (!$reponse->getQuestion()->getId() === $question->getId()) {
            $idQuestion = $question->getId();
            $idReponse = $reponse->getId();
            throw new BadRequestException(["La réponse avec l'ID $idReponse n'existe pas dans la question avec l'ID $idQuestion"]);
        }
    }
}