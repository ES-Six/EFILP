import { Component, OnInit } from '@angular/core';
import { ProfesseurService } from '../../professeur.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  public statistiques: any[] = [];

  constructor(private professeurService: ProfesseurService) { }

  ngOnInit() {
    this.professeurService.fetchStatistiquesReponsesParSessionsParClasse().subscribe(
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
        stats_sessions: []
      };

      for (let sessionIdx = 0; sessionIdx < statistiques[classeIdx].stats.length; sessionIdx ++) {
        const nbr_total_participants = statistiques[classeIdx].stats[sessionIdx].nbr_total_participants;
        const nbr_questions = statistiques[classeIdx].stats[sessionIdx].nbr_questions;
        const nbr_bonnes_reponses = statistiques[classeIdx].stats[sessionIdx].nbr_bonnes_reponses;
        const nbr_mauvaises_reponses = statistiques[classeIdx].stats[sessionIdx].nbr_mauvaises_reponses;
        const nombre_abstension = (nbr_total_participants * nbr_questions) - nbr_bonnes_reponses - nbr_mauvaises_reponses;

        statistiqueClasse.stats_sessions.push({
          session: statistiques[classeIdx].stats[sessionIdx].session,
          nbr_bonnes_reponses: nbr_bonnes_reponses,
          nbr_mauvaises_reponses: nbr_mauvaises_reponses,
          nbr_total_participants: nbr_total_participants,
          nbr_questions: nbr_questions,
          pie_chart_labels: ['Bonnes réponses', 'Mauvaises réponses', 'Abstentions'],
          pie_chart_data: [
            {data: [
                nbr_bonnes_reponses,
                nbr_mauvaises_reponses,
                nombre_abstension
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
