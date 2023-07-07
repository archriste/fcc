#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"

if [[ -z $1 ]]
then
  echo "Please provide an element as an argument."
  exit
fi

if [[ $1 =~ ^[A-Za-z]+$ ]]
then
  ATOMIC_NUMBER=$($PSQL "SELECT atomic_number FROM elements WHERE symbol='$1' OR name='$1'")
else
  ATOMIC_NUMBER=$($PSQL "SELECT atomic_number FROM elements WHERE atomic_number=$1")
fi

if [[ -z $ATOMIC_NUMBER ]]
then
  echo "I could not find that element in the database."
  exit
fi

while IFS='|' read SYMBOL NAME; do
  break
done < <($PSQL "SELECT symbol, name FROM elements WHERE atomic_number=$ATOMIC_NUMBER")

while IFS='|' read ATOMIC_MASS MELTING_POINT_CELSIUS BOILING_POINT_CELSIUS TYPE_ID; do
  break
done < <($PSQL "SELECT atomic_mass, melting_point_celsius, boiling_point_celsius, type_id FROM properties WHERE atomic_number=$ATOMIC_NUMBER")

while IFS='|' read TYPE; do
  break
done < <($PSQL "SELECT type FROM types WHERE type_id=$TYPE_ID")

echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $ATOMIC_MASS amu. $NAME has a melting point of $MELTING_POINT_CELSIUS celsius and a boiling point of $BOILING_POINT_CELSIUS celsius."
