<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serialize;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ReponseRepository")
 */
class Reponse
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\Column(type="boolean")
     */
    private $est_valide;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Question", inversedBy="reponses")
     * @ORM\JoinColumn(nullable=false)
     * @Serialize\Exclude()
     */
    private $question;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\StatistiqueReponse", mappedBy="reponse")
     */
    private $statistiqueReponses;

    public function __construct()
    {
        $this->statistiqueReponses = new ArrayCollection();
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

    public function getEstValide(): ?bool
    {
        return $this->est_valide;
    }

    public function setEstValide(bool $est_valide): self
    {
        $this->est_valide = $est_valide;

        return $this;
    }

    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    public function setQuestion(Question $question): self
    {
        $this->question = $question;

        return $this;
    }

    /**
     * @return Collection|StatistiqueReponse[]
     */
    public function getStatistiqueReponses(): Collection
    {
        return $this->statistiqueReponses;
    }

    public function addStatistiqueReponse(StatistiqueReponse $statistiqueReponse): self
    {
        if (!$this->statistiqueReponses->contains($statistiqueReponse)) {
            $this->statistiqueReponses[] = $statistiqueReponse;
            $statistiqueReponse->setReponse($this);
        }

        return $this;
    }

    public function removeStatistiqueReponse(StatistiqueReponse $statistiqueReponse): self
    {
        if ($this->statistiqueReponses->contains($statistiqueReponse)) {
            $this->statistiqueReponses->removeElement($statistiqueReponse);
            // set the owning side to null (unless already changed)
            if ($statistiqueReponse->getReponse() === $this) {
                $statistiqueReponse->setReponse(null);
            }
        }

        return $this;
    }
}
