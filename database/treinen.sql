SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `trein`
--
DROP DATABASE IF EXISTS trein;

CREATE DATABASE  IF NOT EXISTS `trein` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `trein`;

CREATE USER IF NOT EXISTS 'root_fswd'@'localhost' IDENTIFIED BY 'root_fswd';
GRANT ALL PRIVILEGES ON * . * TO 'root_fswd'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

--
-- Table structure for table `bestemmingen`
--

DROP TABLE IF EXISTS `bestemmingen`;
CREATE TABLE `bestemmingen` (
  `idbestemming` int(11) NOT NULL AUTO_INCREMENT,
  `stad` varchar(45) NOT NULL,
  `latitude` varchar(10) NOT NULL,
  `Llngitude` varchar(10) NOT NULL,
  PRIMARY KEY (`idbestemming`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bestemmingen`
--

LOCK TABLES `bestemmingen` WRITE;
INSERT INTO `bestemmingen` VALUES (100,'Brussel','50.8455717228164', '4.357150042346437'),(101,'Antwerpen','51.21729102105296','4.4211510985110065'),(102,'Gent-Sint-Pieters','51.03624811173457','3.710860656176517'),(103,'Brugge','51.198280738569615','3.2189295012280823');
UNLOCK TABLES;

--
-- Table structure for table `treinen`
--

DROP TABLE IF EXISTS `treinen`;
CREATE TABLE `treinen` (
  `idtrein` int(11) NOT NULL AUTO_INCREMENT,
  `vertrek` tinytext NOT NULL,
  `bestemmingID` int(11) NOT NULL,
  `spoor` int(11) NOT NULL,
  `vertraging` int(11) DEFAULT NULL,
  `afgeschaft` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`idtrein`),
  KEY `bestemming_idx` (`bestemmingID`),
  CONSTRAINT `bestemming` FOREIGN KEY (`bestemmingID`) REFERENCES `bestemmingen` (`idbestemming`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `treinen`
--

LOCK TABLES `treinen` WRITE;
INSERT INTO `treinen` VALUES (16,'10:00',100,12,0,0),(17,'10:00',101,11,NULL,0),(18,'10:10',103,5,5,0),(19,'10:15',103,5,NULL,1),(20,'11:00',100,9,NULL,0),(21,'10:10',103,6,30,0),(25,'02:01',101,4,1,0),(26,'11:22',100,32,4,1),(27,'11:22',101,5,NULL,0),(28,'22:22',101,99,60,1),(29,'23:00',100,99,NULL,0),(30,'11:22',101,55,5,1),(31,'11:11',100,34,5,1),(32,'22:22',100,4,5,1),(34,'04:11',102,4,5,0),(35,'04:11',102,4,5,0),(36,'04:11',102,6,5,0),(38,'11:11',103,3,4,0);
UNLOCK TABLES;