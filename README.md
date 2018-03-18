# WargamersDatabase
An online GUI for the Wargamers club to manage their members, events, games and more.

Some example instances for our database: https://docs.google.com/document/d/1IEbwZUnNkSj0o9MEtCGm1BXIzfpj4rmFOylHgHd5KI0/edit?usp=sharing 

Some Brainstorming for our database: 
https://docs.google.com/document/d/1R5IuknsKe8greUB9jovi0zWLhHnxPfDAz3EKpI-s2gc/edit
https://docs.google.com/document/d/1wYUOqQ9x68wF6dEkcpAaTyWN_sazmvvdwwHvc6EbjVg/edit

Using the Script:
1. Open cmd prompt
2. psql -U USERNAME
2a. Enter Password
3. Create database DATABASENAME
4. Quit
5. psql -U USERNAME DATABASENAME < Script.pgsql
5a. enter password

Example: psql -U postgres mydb < Script.pgsql