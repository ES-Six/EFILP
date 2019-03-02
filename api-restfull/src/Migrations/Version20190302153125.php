<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190302153125 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE statistique_reponse ADD session_id INT NOT NULL');
        $this->addSql('ALTER TABLE statistique_reponse ADD CONSTRAINT FK_2654AD23613FECDF FOREIGN KEY (session_id) REFERENCES session (id)');
        $this->addSql('CREATE INDEX IDX_2654AD23613FECDF ON statistique_reponse (session_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE statistique_reponse DROP FOREIGN KEY FK_2654AD23613FECDF');
        $this->addSql('DROP INDEX IDX_2654AD23613FECDF ON statistique_reponse');
        $this->addSql('ALTER TABLE statistique_reponse DROP session_id');
    }
}
