import { Component, OnInit } from '@angular/core';
import { ProfesseurService } from '../../professeur.service';

@Component({
  selector: 'app-eleves',
  templateUrl: './eleves.component.html',
  styleUrls: ['./eleves.component.css']
})
export class ElevesComponent implements OnInit {

  public statistiques: any[] = [];

  constructor(private professeurService: ProfesseurService) { }

  ngOnInit() {
    this.professeurService.fetchStatistiquesParticipantsEnDifficulte().subscribe(
      (statistiques: any) => {
        this.genPieChart(statistiques);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  genPieChart(statistiques: any[]) {
    for (let classeIdx = 0; classeIdx < statistiques.length; classeIdx ++) {

      const statistiqueClasse = {
        classe: statistiques[classeIdx].classe,
        stats_participants: []
      };

      for (let participantIdx = 0; participantIdx < statistiques[classeIdx].participants.length; participantIdx ++) {
        const nbr_bonnes_reponses = statistiques[classeIdx].participants[participantIdx].nbr_bonnes_reponses;
        const nbr_mauvaises_reponses = statistiques[classeIdx].participants[participantIdx].nbr_mauvaises_reponses;

        statistiqueClasse.stats_participants.push({
          participant: statistiques[classeIdx].participants[participantIdx].participant,
          nbr_bonnes_reponses: nbr_bonnes_reponses,
          nbr_mauvaises_reponses: nbr_mauvaises_reponses,
          pie_chart_labels: ['Bonnes réponses', 'Mauvaises réponses'],
          pie_chart_data: [
            {data: [
                nbr_bonnes_reponses,
                nbr_mauvaises_reponses
              ], label: 'Nombre de réponses'}
          ],
          pie_chart_options: {
            maintainAspectRatio: true,
            responsive: true,
          }
        });
      }

      this.statistiques.push(statistiqueClasse);
    }
  }

}
