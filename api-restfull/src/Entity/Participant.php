<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serialize;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ParticipantRepository")
 */
class Participant
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Classe", inversedBy="participants")
     * @ORM\JoinColumn(nullable=false)
     * @Serialize\Exclude()
     */
    private $classe;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $prenom;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\StatistiqueReponse", mappedBy="participant")
     */
    private $statistiquesReponses;

    public function __construct()
    {
        $this->statistiquesReponses = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getClasse(): ?Classe
    {
        return $this->classe;
    }

    public function setClasse(?Classe $classe): self
    {
        $this->classe = $classe;

        return $this;
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

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): self
    {
        $this->prenom = $prenom;

        return $this;
    }

    /**
     * @return Collection|StatistiqueReponse[]
     */
    public function getStatistiquesReponses(): Collection
    {
        return $this->statistiquesReponses;
    }

    public function addStatistiquesReponse(StatistiqueReponse $statistiquesReponse): self
    {
        if (!$this->statistiquesReponses->contains($statistiquesReponse)) {
            $this->statistiquesReponses[] = $statistiquesReponse;
            $statistiquesReponse->setParticipant($this);
        }

        return $this;
    }

    public function removeStatistiquesReponse(StatistiqueReponse $statistiquesReponse): self
    {
        if ($this->statistiquesReponses->contains($statistiquesReponse)) {
            $this->statistiquesReponses->removeElement($statistiquesReponse);
            // set the owning side to null (unless already changed)
            if ($statistiquesReponse->getParticipant() === $this) {
                $statistiquesReponse->setParticipant(null);
            }
        }

        return $this;
    }
}
