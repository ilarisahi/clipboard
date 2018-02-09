# Clipboard documentation
With this software users can share their clipboard with other users.

## Functionality
Users can create accounts and login to the service. Users can create a new clipboard room or join an existing one by entering a code.
Multiple users can be inside one clipboard room.

Users can copy content inside the room to automatically send the copied content to other users in the same room,
or users can paste external content to the designated input field. Pasted content will be selected automatically on other clients,
but it can't be copied automatically because of the risk of malicious clipboard injection.

## Technologies
* **Back end**: Node.js, Express, MongoDB database
* **Front end**: Angular.io, JavaScript, HTML, CSS
* **Both**: Socket.io

## Architecture
Most of the functionality is client side, but back end is used for user registration and authentication.
Back end is also used for socket management. The idea is that user contacts server via socket and then server will contact
other required users via socket. The server is functioning as a middle man between multiple users.

### Pros
+ Can be run on every environment that has an Internet browser. 
+ The service can be extended easily.
+ Fast.

### Cons
- User's clipboard can't be read or written directly because of security risks (malicious clipboard injection).
- Overhead is quite large.

## Implementation overhead
The overhead of this implementation is quite large, because both Node.js+Express back end and Angular.io front end
require a lot of unnecessary code concerning this specific task. However the service can be easily expanded upon because
the used technologies are versatile and widely used. It was also easy to include user and room management.
