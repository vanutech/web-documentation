---
title: Vanubus api
sidebar_position: 1
---
<!--- start -->


Vanubus api works with a tcp socket.

Socket info:
    ip adress:  see app
    port : 3333

Reqest message always starts with byt of message type:
  - 1 sensor data
  - 2 send action
  - 0 keep connection alive

Request data message:
byte positon:
pos : 1  -  value: 1
pos : 2  -  value: 1st sensor id
pos : 3  -  value: 2nd sensor id
pos : 4  -  value: 0

Receive data: per 4 bytes
pos : 1 - 1st sensor type
pos : 2-31 - data according to type
pos : 32 - 2nd sensor type 
pos : 33-63 - data according to type


Send actuator message:
byte positon:
pos : 1  -  value: 2
pos : 2  -  value: actuator id
pos : 3  -  value: value of action
pos : 4  -  value: 0
