<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serialize;

/**
 * @ORM\Entity(repositoryClass="App\Repository\QCMRepository")
 */
class QCM
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Serialize\Groups({"lite", "complete"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Serialize\Groups({"lite", "complete"})
     */
    private $nom;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="QCMs")
     * @ORM\JoinColumn(nullable=false)
     * @Serialize\Type("integer")
     * @Serialize\Accessor(getter="getIdProfesseur")
     * @Serialize\Groups({"lite", "complete"})
     */
    private $professeur;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Question", mappedBy="qcm")
     * @ORM\OrderBy({"position" = "ASC"})
     * @Serialize\Groups({"complete"})
     */
    private $questions;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Session", mappedBy="qcm")
     * @Serialize\Exclude()
     */
    private $sessions;

    public function __construct()
    {
        $this->questions = new ArrayCollection();
        $this->sessions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getProfesseur(): ?User
    {
        return $this->professeur;
    }

    public function setProfesseur(?User $professeur): self
    {
        $this->professeur = $professeur;

        return $this;
    }

    /**
     * @return Collection|Question[]
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Question $question): self
    {
        if (!$this->questions->contains($question)) {
            $this->questions[] = $question;
            $question->setQcm($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): self
    {
        if ($this->questions->contains($question)) {
            $this->questions->removeElement($question);
            // set the owning side to null (unless already changed)
            if ($question->getQcm() === $this) {
                $question->setQcm(null);
            }
        }

        return $this;
    }

    /*
     * Méthodes pour le JMS serializer
     */
    public function getIdProfesseur(): ?int {
        return $this->professeur instanceof User ? $this->professeur->getId() : null;
    }

    /**
     * @return Collection|Session[]
     */
    public function getSessions(): Collection
    {
        return $this->sessions;
    }

    public function addSession(Session $session): self
    {
        if (!$this->sessions->contains($session)) {
            $this->sessions[] = $session;
            $session->setQcm($this);
        }

        return $this;
    }

    public function removeSession(Session $session): self
    {
        if ($this->sessions->contains($session)) {
            $this->sessions->removeElement($session);
            // set the owning side to null (unless already changed)
            if ($session->getQcm() === $this) {
                $session->setQcm(null);
            }
        }

        return $this;
    }
}
