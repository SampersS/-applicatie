CREATE DATABASE  IF NOT EXISTS `db_applicatie` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_applicatie`;

DROP TABLE IF EXISTS `charakter_tabel`;
CREATE TABLE `charakter_tabel` (
  `idcharakter_tabel` int NOT NULL AUTO_INCREMENT,
  `groep_id` int NOT NULL,
  `uitspraak voorbeeld` varchar(30) DEFAULT NULL,
  `betekenis` varchar(50) DEFAULT NULL,
  `ckarakter` varchar(4) DEFAULT NULL,
  `img` varchar(45) DEFAULT NULL,
  `notitie` varchar(45) DEFAULT NULL,
  `opvraag_index_naar_teken` int DEFAULT NULL,
  `opvraag_index_naar_betekenis` int DEFAULT NULL,
  `juist_streak_naar_teken` int DEFAULT NULL,
  `juist_streak_naar_betekenis` int DEFAULT NULL,
  `aantal_fout_naar_teken` int DEFAULT NULL,
  `aantal_fout_naar_betekenis` int DEFAULT NULL,
  PRIMARY KEY (`idcharakter_tabel`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `groep_namen`;
CREATE TABLE `groep_namen` (
  `idgroep_namen` int NOT NULL AUTO_INCREMENT,
  `naam` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`idgroep_namen`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

DROP TABLE IF EXISTS `woordenschat_tabel`;
CREATE TABLE `woordenschat_tabel` (
  `idwoordenschat_tabel` int NOT NULL AUTO_INCREMENT,
  `groep_id` varchar(45) NOT NULL,
  `romaji_uitspraak` varchar(20) DEFAULT NULL,
  `kanji` varchar(15) DEFAULT NULL,
  `betekenis` varchar(50) DEFAULT NULL,
  `notitie` varchar(45) DEFAULT NULL,
  `opvraag_index_naar_uitspraak` int DEFAULT NULL,
  `opvraag_index_naar_betekenis` int DEFAULT NULL,
  `juist_streak_naar_uitspraak` int DEFAULT NULL,
  `juist_streak_naar_betekenis` int DEFAULT NULL,
  `aantal_fout_naar_uitspraak` int DEFAULT NULL,
  `aantal_fout_naar_betekenis` int DEFAULT NULL,
  PRIMARY KEY (`idwoordenschat_tabel`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `activiteit_tabel`;
CREATE TABLE activiteit_tabel (`idDag` int not null auto_increment, `dag` date not null, `knt` int default 0, `knb` int default 0, `wnb` int default 0, `wnu` int default 0, primary key(`idDag`));