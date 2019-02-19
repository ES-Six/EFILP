<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\StatistiqueReponseRepository")
 */
class StatistiqueReponse
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Reponse", inversedBy="statistiqueReponses")
     * @ORM\JoinColumn(nullable=false)
     */
    private $reponse;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Participant", inversedBy="statistiquesReponses")
     * @ORM\JoinColumn(nullable=false)
     */
    private $participant;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReponse(): ?Reponse
    {
        return $this->reponse;
    }

    public function setReponse(?Reponse $reponse): self
    {
        $this->reponse = $reponse;

        return $this;
    }

    public function getParticipant(): ?Participant
    {
        return $this->participant;
    }

    public function setParticipant(?Participant $participant): self
    {
        $this->participant = $participant;

        return $this;
    }
}
