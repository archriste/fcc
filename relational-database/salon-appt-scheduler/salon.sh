#! /bin/bash

# Variable for querying database
PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

# Intro title
echo -e "\n~~~~~ SALON MENU ~~~~~\n\nWelcome to Bash Salon.\n"

# Service list
# Get variables
MAIN_MENU() {
  if [[ $1 ]]
  then 
    echo -e "\n$1"
  fi

  SERVICE_LIST=$($PSQL "SELECT service_id, name FROM services ORDER BY service_id")
  echo "$SERVICE_LIST" | while read ID BAR NAME
  do
    echo "$ID) $NAME"
  done

  # Print new line
  echo " "

  # Read user input for requested service id
  echo -e "\nChoose a service:"
  read SERVICE_ID_SELECTED

  # Return service ids that match the requested service id
  if [[ $SERVICE_ID_SELECTED =~ ^[1-9]+$ ]]
  then
    SERVICE_ID_MATCHER=$($PSQL "SELECT service_id FROM services WHERE service_id=$SERVICE_ID_SELECTED")
    # Check if there's any service ids that match the requested service id
    if [[  $SERVICE_ID_SELECTED -eq $SERVICE_ID_MATCHER ]]
    then
      SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id=$SERVICE_ID_SELECTED")
      echo -e "\nWhat's your phone number?"
      read CUSTOMER_PHONE
      if [[ $CUSTOMER_PHONE =~ ^[^a-zA-Z]+$ ]]
      then
        CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone='$CUSTOMER_PHONE'")
        if [[ -z $CUSTOMER_NAME ]]
        then
          echo -e "\nI don't have a record for that number. What's your name?"
          read CUSTOMER_NAME
          CUSTOMER_ID=$($PSQL "INSERT INTO customers(phone, name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME') RETURNING customer_id" -q)
        else
          CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
        fi
        echo -e "\nWhat time would you like your$SERVICE_NAME,$CUSTOMER_NAME?"
        read SERVICE_TIME
        echo $($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME')" -q)
        echo -e "I have put you down for a$SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME."
      else
        MAIN_MENU "Invalid phone number. Try again.\n"
      fi
    else
      MAIN_MENU "Invalid service id. Try again.\n"
    fi
  else
    MAIN_MENU "Invalid input. Try again.\n"
  fi
}

MAIN_MENU
