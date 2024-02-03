#!/bin/sh
#maakt backup van mysql database met bestandsnaam: backup/DAGVANDEWEEK.sql en verwijdert de opvolgende dag van de week
DVDW=$(date +%u)
VDVDW=$(((DVDW %7)+1))
mkdir -p "backup"
sudo mariadb-dump db_applicatie > ./backup/$DVDW.sql
rm ./backup/$VDVDW.sql
