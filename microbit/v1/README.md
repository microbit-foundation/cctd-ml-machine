# ML-Machine microbit v1 firmware

This is the folder for the micro:bit software that is used for ML-Machine. It is the version that will be given to users with v1 micro:bits.

This folder provides the tooling needed to compile a C++ DAL program for the micro:bit v1 and produce a HEX file that can be downloaded to the device.

For example on how to develop programs for micro:bit v1's, visit [lancaster-university/microbit-samples](https://github.com/lancaster-university/microbit-samples).

# Installation

Before gettings started we have some dependencies to take care of

- [yotta](http://docs.yottabuild.org/#installing)



### Docker image
In order to compile, a docker image is used.

`docker pull ghcr.io/carlosperate/microbit-toolchain:latest`



## Configurations
### yotta
**yottas registry is deprecated!** This means we have to acquire the build target (bbc-microbit-classic-gcc) elsewhere. Lancaster University has provided a link that will replace the yotta registry. 

In `./.yotta.json` we configure:

```json
{
  "build": {
    "target": "bbc-microbit-classic-gcc,https://github.com/lancaster-university/yotta-target-bbc-microbit-classic-gcc"
  }
}
```

`./.yotta_ignore` contains the items that will be excluded from the build.

We can then select the build target with (optional, but does produce a warning if not explicitly selected.)

```yotta target bbc-microbit-classic-gcc```

**Note!** When changing the target using the command above, you must have acquired the build target from lancaster, otherwise you have to copy the `./.yotta.json` file above in order to download it.

### 503 Server Error: Service Unavailable for url:

To fix this simply copy the target from above, and run the docker build command. Do NOT run `yotta target ...` again! This will undo the target and the error will occur again.

### Configuring the Micro:bit

In the root of the project the file `./config.json` we have the configurations for the MicroBit, allowing us to enable Bluetooth. See the [samples project](https://github.com/lancaster-university/microbit-samples) for examples.

## Building the project

We use yotta and the docker image provided to build the project

`docker run -v $(pwd):/home --rm ghcr.io/carlosperate/microbit-toolchain:latest yotta build`

Doing this will create the file `./build/bbc-microbit-classic-gcc/source/microbit-samples-combined.hex`. This is the hex that will be flashed to the microbit

**Note!** When we build we use the target provided in `.yotta.json`. By default, it is using a github repository to download. Github has hourly limits, so frequently deleting folders `yotta_modules` and `yotta_targets` may cause these limits to be reached, and prevent further downloads until the limit has expired. 


## Flashing the .hex

Copy the file `./build/bbc-microbit-classic-gcc/source/microbit-samples-combined.hex` to the microbit to flash
or by using a command.

## Understanding the software

The v1 micro:bit is even simpler than the v2 micro:bit software.
It contains a single file, source/main.cpp.

Inside is a function named *main*. 

```cpp
int main()
{
    // Initialise the micro:bit runtime.
    uBit.init();

    // Add listeners for events
    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, onConnected);
    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, onDisconnected);

    // Initialise the micro:bit services.
    uart = new MicroBitUARTService(*uBit.ble, 32, 32);
    led = new MicroBitLEDService(*uBit.ble,uBit.display);
    io = new MicroBitIOPinService(*uBit.ble, uBit.io);
    btn = new MicroBitButtonService(*uBit.ble);
    accel = new MicroBitAccelerometerService(*uBit.ble, uBit.accelerometer);

    pairPtn = getPairPattern();

    uBit.display.image.paste(pairPtn);

    release_fiber();
}
```

Inside this function we initialize the micro:bit runtime

```c
uBit.init();
```

Then we add some event listeners, that fires once the micro:bit is connected or disconnected from Bluetooth

```c
uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, onConnected);
uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, onDisconnected);
```

Next up is the service initialization. Luckily enabling services are very simple, we can simply instantiate new objects of them, like so

```c
uart = new MicroBitUARTService(*uBit.ble, 32, 32);
led = new MicroBitLEDService(*uBit.ble,uBit.display);
io = new MicroBitIOPinService(*uBit.ble, uBit.io);
btn = new MicroBitButtonService(*uBit.ble);
accel = new MicroBitAccelerometerService(*uBit.ble, uBit.accelerometer);
```

Then we will immediately draw the pairing pattern 

```cpp
pairPtn = getPairPattern();
uBit.display.image.paste(pairPtn);
```
The pairing pattern is derived from the micro:bit's name using a lookup table . You can read more about it [here](https://support.microbit.org/support/solutions/articles/19000067679-how-to-find-the-name-of-your-micro-bit)


Finally we will tear down the micro:bit
```cpp
release_fiber();
```
>Fibers are lightweight threads used by the runtime to perform operations asynchronously. The function call release_fiber(); is recommended at the end of main to release the main fiber, and enter the scheduler indefinitely as you may have other fibers running elsewhere in the code. It also means that the processor will enter a power efficient sleep if there are no other processes running. If this line is omitted, your program will cease all execution.




## Sources

### Yotta installation

http://docs.yottabuild.org/#installing

### Microbit docs

https://lancaster-university.github.io/microbit-docs/offline-toolchains/

https://lancaster-university.github.io/microbit-docs/

### Docker image

https://github.com/carlosperate/docker-microbit-toolchain

### Code examples for C++

https://github.com/lancaster-university/microbit-samples


## Developer notes

I recommend creating a bash file that both builds and flashes the build to the microbit.

example (for OS X):

```bash
# compile and run

docker run -v $(pwd):/home --rm ghcr.io/carlosperate/microbit-toolchain:latest yotta build

cp $(pwd)/build/bbc-microbit-classic-gcc/source/microbit-samples-combined.hex /Volumes/MICROBIT

```