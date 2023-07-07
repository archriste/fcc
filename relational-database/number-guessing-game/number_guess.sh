#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

# Prompt username
echo "Enter your username:"
read USERNAME

# If user is in database, set IS_USER to true and return stats
while IFS='|' read USER_ID GAMES_PLAYED FEWEST_GUESSES; do 
  break
done < <($PSQL "SELECT user_id, games_played, fewest_guesses FROM users WHERE username='$USERNAME'")

if ! [[ -z $USER_ID ]]
then
  IS_USER=1
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $FEWEST_GUESSES guesses."
# Else, welcome user and continue
else
  echo "Welcome, $USERNAME! It looks like this is your first time here."
fi

# Generate random number
NUMBER=0
while [[ $NUMBER -le 1 ]]
do
  NUMBER=$RANDOM
  let "NUMBER %= 1000"
done

# Initialize count variable
COUNT=1

echo "Guess the secret number between 1 and 1000:"

scorekeeper()
{
  # If is_user is true, update values else insert user into database with name, games_played=1, and best_game=count
  if [[ $IS_USER -eq 1 ]]
  then
    let "GAMES_PLAYED++"
    # If count is less than fewest_guesses, update fewest_guesses
    if [[ $COUNT -lt $FEWEST_GUESSES ]]
    then
      FEWEST_GUESSES=$COUNT
    fi
    $PSQL "UPDATE users SET games_played=$GAMES_PLAYED, fewest_guesses=$FEWEST_GUESSES WHERE user_id=$USER_ID" -q
  # If is_user is not true
  else
    $PSQL "INSERT INTO users(username, games_played, fewest_guesses) VALUES('$USERNAME', 1, $COUNT)" -q
  fi
  exit
}

guesser()
{
  # Prompt user for a number
  read GUESS

  # If input is not a number, run guesser again
  if ! [[ $GUESS =~ ^[0-9]+$ ]]
  then
    echo "That is not an integer, guess again:"
    let "COUNT++"
    guesser
  fi

  # If input is the random number, congratulate user and pass number of guesses to scorekeeper
  if [[ $GUESS -eq $NUMBER ]]
  then
    echo "You guessed it in $COUNT tries. The secret number was $NUMBER. Nice job!"
    scorekeeper
  fi

  # If input is too high, run again
  if [[ $GUESS -gt $NUMBER ]]
  then
    echo "It's lower than that, guess again:"
    let "COUNT++"
    guesser
  fi

  # If input is too low, run again
  if [[ $GUESS -lt $NUMBER ]]
  then
    echo "It's higher than that, guess again:"
    let "COUNT++"
    guesser
  fi

  return
}

guesser