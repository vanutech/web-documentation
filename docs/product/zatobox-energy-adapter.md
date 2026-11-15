---
title: Zatobox Energy Adapter
sidebar_position: 4
---
<!--- start -->

The Zatobox Energy Adapter is designed to connect various energy meters to the Zatobox system, enabling comprehensive energy monitoring.

<img src="/img/zatoboxone/zatobox-render.png" alt="" width="300" /> 

<!--- nextpage -->
## Product configuration

The Zatobox Energy Adapter features multiple connectivity options for different meter types, allowing flexible integration with your energy monitoring setup.

<img src="/img/zatoboxone/zatobox-one_pinout.png" alt="" width="300"/>

<br/>
<br/>
<!--- nextpage -->

## Specifications

|  Specifications | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| -------- | ------- |
| Input voltage | 5V DC   |
| Connection ports | Multiple |
| Protocol support | Various |
| Size | Compact |

## Packaging

Please ensure that the following itmes are included in the packaging along with the Zatobox device

- Zatobox energy adapter
- P1 cable
- P1 power cable
- S1 data cable
- Short RJ45 splitter
- Long RJ45 splitter

## Setup

**Hardware Connection**: Connect the Zatobox Energy Adapter to the correct source for power and data see   **[Hardware connections](#hardware_connections)**.

**Power Up**: Once powered, the LED should indicate the device is ready.


**Configure device**: Use the app to configure device **[Energy adapter config tool](/docs/app-setup/energyadapter-config)**.


## Hardware connections{#hardware_connections}

Zatobox energy adapter can be connected in several ways. Below are step by step instructinos or use the pinout table directly.

<img src="/img/zatoboxone/pinouttable.png" alt="" width="300"/>


#### P1 port to inverter

Use the p1 cable and short rj45 splitter. More information see **[P1 integration](/docs/integrations/p1-port)**.

- First Connect the P1 cable to the p1 port on your digital meter and the other side to the rj45 splitter. 

- Then connect the RS485 meter connection of your inverter to port 2 pins through the rj45 splitter.

- Connect the rj45 splitter to the Zatobox energy adapter.

#### S1 port to inverter

Use the S1 data cable, P1 power cable, the long rj45 splitter and short rj45 splitter. More information see **[S1 integration](/docs/integrations/s1-port)**.

- First Connect the S1 data cable and the P1 power cable to the digital meter and the other side to the long rj45 splitter. Connect the RJ45 splitter out to the short rj45 splitter.

- Then connect the RS485 meter connection of your inverter to port 2 pins through the rj45 splitter.

- Connect the rj45 splitter to the Zatobox energy adapter.
  
#### RS485 meter to inverter

Use the  and short rj45 splitter. 

- First Connect the rs485 meter to the rj45 splitter to connect to the Zatobox energy adapter. Use rs485 port1 for connection. 

- Then connect the RS485 meter connection of your inverter to port 2 pins through the rj45 splitter.

- Connect the rj45 splitter to the Zatobox energy adapter.


<!--- nextpage -->
## LED State

| Connection Status |  LED State  |
| -------- | ------- |
| Ready | Continous green |
| Connecting | Flashing yellow |
| Error | Continous red |

<br/>

| Data Status |  LED State  |
| -------- | ------- |
| Data flowing | Flashing green |
| No data | Continous orange |
| Error | Continous red |


<!--- nextpage -->
## Troubleshooting

### Reset

Press and hold the button for 10 seconds. If successful, the LED will indicate reset mode.
