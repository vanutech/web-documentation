---
title: Huawei SUN2000
sidebar_position: 1
sidebar_custom_props: 
  img: huawei.png
---


Instruction to connect a huawei sun2000 inverter to the  **Zato box** system. 

- Huawei SUN2000 l1 (with or withour battery)
- Huawei SUN2000 m1 (with or withour battery)

Prerequisite
- **Zato box one**
- **Generic RJ45 cable**
- **USB-A to USB-C cable**

#### Step 1 - Hardware connection

Connect RS485A1 and RS485B1 pins of the inverter to the modbus A en B pins of zatobox one.

See pictures below with the pinout of the sun2000 L1 single phase inverter.

<img src="/img/img-huawei/huaweisun2000L1pinout.png" alt="Huawei sun2000 L1 pinout" width="500" height="auto"></img>
Below picture of the pinout for the sun2000 M1 three phase inverter.
<img src="/img/img-huawei/huaweisun2000M1pinout.png" alt="Huawei sun2000 M1 pinout" width="500" height="auto"></img>


***********Picture connecting usb A to zatobox


#### Step 2 - Huawei inverter settings


The Slave ID should be identical to the Com address set in the RS485_1 settings.

***************picture of screenshot huawei app


#### Step 3 - Add to zatobox

Go to the device tab and push the plus button to add an extra device. Choose Huawei sun2000 from the list. If you have a battery attached you can choose the battery variant.

More information how to add 3rd party devices with the APP [link](/docs/app-info/add-connecteddevice).

*********** picture of connection settings


#### Step 4 - Trouble shooting

- Check if the inverter modbus settings are correct.
- Check if the inverter is powered on. At night the power can be removed when only pv is connected.
- Check if the zatobox device is powered on and connected to the wifi.

