<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Exception\BadRequestException;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\NotBlank;

class SessionValidation
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
    public function validateCreateSession(Request $request)
    {
        $validator = Validation::createValidator();

        $violations = $validator->validate($request->get('nom'), [
            new NotBlank([
                'message' => "Un nom de session doit être spécifié"
            ]),
            new Length([
                'max'=>255,
                'maxMessage' => "Un nom de session fait au maximum 255 caractères"
            ])
        ]);
        $this->storeErrors('nom', $violations);

        $violations = $validator->validate($request->get('afficher_classement'), [
            new NotNull([
                'message' => "Il faut spécifier si la session comporte l'affichage du classement entre les questions"
            ]),
            new Type([
                'type' => 'bool',
                'message' => 'Ce champ doit être un booléen'
            ])
        ]);
        $this->storeErrors('afficher_classement', $violations);

        $violations = $validator->validate($request->get('generer_pseudo'), [
            new NotNull([
                'message' => "Il faut spécifier si les élèves ont le droit de choisir leur pseudonymes avant le début de la session"
            ]),
            new Type([
                'type' => 'bool',
                'message' => 'Ce champ doit être un booléen'
            ])
        ]);
        $this->storeErrors('generer_pseudo', $violations);

        $this->flushErrors();
    }
}