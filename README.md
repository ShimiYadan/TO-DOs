# TODOS
TO-DOs web application. The app itself has simple functionalities that will help users create, edit and delete todos (for example: 'learn to play a game' with a deadline set to the 3rd of September). It also has a simple notification logic that sends the users notifications regarding todos reaching their deadlines.

# explaining the overall system and any assumptions:
this program gets notifications by an end point and proccess it by the fllow (REST API => dispatch => notifications) 
the traffic will go throw a rabbitMQ.
Since we need a scalability, high-prformence, havy traffic and executing multiple tasks simultaneously or concurrently I used a worker not blocking the node event loop by taking it out by a outsource thread.
the queue helpping us to consume the notifications fast and not overkill the i/O such as DB.

# install rabbitMQ on windows/Mac
# Chocolatey - https://chocolatey.org/
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

# run the command
choco install rabbitmq

# Design using lucid: 
https://lucid.app/lucidchart/c5c600f3-ccd5-4cb4-bae3-2e8fd19a07ca/edit?viewport_loc=632%2C-174%2C2839%2C1366%2C0_0&# invitationId=inv_f18ceb50-6a4b-404d-a292-530bea707a96














