CREATE DATABASE  IF NOT EXISTS `db_applicatie` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_applicatie`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: db_applicatie
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `charakter_tabel`
--

DROP TABLE IF EXISTS `charakter_tabel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groep_namen`
--

DROP TABLE IF EXISTS `groep_namen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groep_namen` (
  `idgroep_namen` int NOT NULL AUTO_INCREMENT,
  `naam` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`idgroep_namen`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `woordenschat_tabel`
--

DROP TABLE IF EXISTS `woordenschat_tabel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-17 16:27:18
