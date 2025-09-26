---
title: Protocol syntax
sidebar_position: 2
---
<!--- start -->

The syntax of the yaml protocol is explained on this page. 

The general yaml protocols are stored on [https://github.com/vanutech/protocol-hub](https://github.com/vanutech/protocol-hub).

Mandatory info
- unique_id: name of the value
  - "Power" or "P"
  - "Energy" or "E"
  - "Energy_charge" or "EC"
  - "Energy_discharge" or "ED"
  - "soc"
  - "Reserve5" or "R5" , 
- adress: adress number of the register
- data_types:  
  - "uint16" or "u16"
  - "uint32" or "u32"
  -  "int16" or "i16"
  -  "int32" or "i32"
  -  "float" or "f"
- input_type
  -  "holding"
  -  "input"
  -  "coil"
  -  "discrete"
- endianness (optional):
  - "middle-endian": default
  - "little-endian"
  - "big-endian"
- scale (optional):
- divide (optional):


Below you can find a example of a protocol for a sensor
```yaml
pri: sensor

#specific parmaeters
adr: !parameter
type: pv

prcl: #protocol
  #minimum needed info
  - unique_id: Power
    address: 32080
    data_type: int32
    input_type: input

  # adding device or scale is optional
  - unique_id: Energy
    address: 32106
    data_type: uint32
    input_type: input
    divide: 100 # default 1
    scale: 10 # default 1
    endianness: big-endian #default middle endian
```


Below an example of a actuator protocol for cloning a meter

Instead of unique_id, a value is provided. The value could also we a string which is used in sync automation, setting sensor values to specific locations

```yaml
type: ValuePower
# possible typs
# SW, //switch or relay on off
# PS, //proportional switch
# VP, //valut of power

pri: actuator

#device specifics
adr: !parameter

prcl: #protocol
  - value: U
    address: 1
    data_type: float
    input_type: input    

  - value: 0
    address: 25
    data_type: float
    input_type: input
    divide: 100 # default 1
    scale: 10 # default 1
    endianness: big-endian #default middle endian
```
