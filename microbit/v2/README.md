# ML-Machine microbit v2 firmware

This is the folder for the micro:bit software that is used for ML-Machine. It is the version that will be given to users with v2 micro:bits.

This folder provides the tooling needed to compile a C/C++ CODAL program for the micro:bit v2 and produce a HEX file that can be downloaded to the device.

This originated as a fork of [Lancaster's Microbit v2 samples repository](https://github.com/lancaster-university/microbit-v2-samples).
That repository is a good starting place if one wishes to learn more about development for micro:bits.

# Installation
You need some open source pre-requisites to build this repo. You can either install these tools yourself, or use the docker image provided below.

- [GNU Arm Embedded Toolchain](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads)
- [Git](https://git-scm.com/)
- [CMake](https://cmake.org/download/)
- [Python 3](https://www.python.org/downloads/)
- For OS X you may need command line tools for xcode. Install using `xcode-select --install`
- For linux you may need the package
    - `arm-none-eabi-newlib` - Found to be the case in Arch Linux.

**OR**

One can use docker instead of downloading these dependencies (read about this here [here](https://github.com/lancaster-university/microbit-v2-samples))

# Building without docker
- Clone this repository
- In the folder `/microbit/v2` type `python3 build.py` or `python build.py` depending on python version
- The hex file will be built `MICROBIT.HEX` and placed in the `/microbit/v2` folder.
- If at some point any config changes are made outside any .cpp files run `python3 build.py -c`. The `-c` flag will clear the build files. If this is not done the changes to config will not take effect.

**Note**: for OS X users receiving the error 

```xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun```

install xcode command line tools using `xcode-select --install`

### Broken .hex fix
If at some point the HEX file doesn't seem to work, but compiles fine, check `codal.json` to see if the following is missing.

```JSON
"config":{
    "SOFTDEVICE_PRESENT": 1,
}
```

Add if it is not present. (It may not be required in the future, but is currently a bug. Last checked 14th nov 2022)

It is related to [this issue](https://github.com/lancaster-university/codal-microbit-v2/issues/242)

## Getting started on development

- Check out `src/main.cpp`

- Now find the main function

```C
int main()
{
    ...
}
```

#### Understanding the main function 

**Setting up the micro:bit**

The first is the initialization method, which is required for the micro:bit to work. 
```C++
    uBit.init();
```

Then we add listeners for events such as
 - Incoming UART messages
 - Disconnect
 - Connect
```C++
    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, onConnected);
    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, onDisconnected);
    uBit.messageBus.listen(MICROBIT_ID_BLE_UART, MICROBIT_UART_S_EVT_DELIM_MATCH, onDelim);
```

The line for incoming UART messages tells the micro:bit that when a **delimiter match** is found, fire the onDelim function with.
```C++
    uBit.messageBus.listen(MICROBIT_ID_BLE_UART, MICROBIT_UART_S_EVT_DELIM_MATCH, onDelim);
```
For example we delimit messages with the '#' character. Using '#' as the delimiter means that a steam of bytes such as `123456789` can be separated into messages `123`, `456`, `7`, `8`, `9` by using the delimiter. I.e sending `123#456#7#8#9#`. The micro:bit does not know where a message ends without this delimiter and will infinitely grow it's message buffer until out of memory. We assign the delimiter like this
```C++
    uart->eventOn("#");
```
This is also shown later in the main function.

Next up is the service initialization. Luckily enabling services are dead-simple, we can simply instantiate new objects of them, like so

```C++
    uBit.bleManager.setTransmitPower(7);

    uart = new MicroBitUARTService(*uBit.ble, 32, 32);
    led = new MicroBitLEDService(*uBit.ble, uBit.display);
    io = new MicroBitIOPinService(*uBit.ble, uBit.io);
    btn = new MicroBitButtonService(*uBit.ble);
    accel = new MicroBitAccelerometerService(*uBit.ble, uBit.accelerometer);
```
The following line we add in order to ensure that the bluetooth signal has enough strength. The power level is a number between 0-7 where 7 is the strongest signal. Using other power levels may give longer battery life, but could result in instable bluetooth connections.
```c++
    uBit.bleManager.setTransmitPower(7);
```

In each of the initializations we give the `*uBit.ble` pointer along which points to the bluetooth module of the micro:bit, as well as modules the initializations need to access, such as the display `uBit.display` for the LEDService.

We don't actually need to assign them to variables, but I have chosen to do so in case they become useful later on.

While it has nothing to do with setting up the micro:bit it has to do with tearing it down again, I will mention the last line. The description below is from [Lancaster](https://lancaster-university.github.io/microbit-docs/)
```C++
    release_fiber();
```
> Fibers are lightweight threads used by the runtime to perform operations asynchronously.
> The function call release_fiber(); is recommended at the end of main to release the main fiber, and enter the scheduler indefinitely as you may have other fibers running elsewhere in the code. It also means that the processor will enter a power efficient sleep if there are no other processes running.
> If this line is omitted, your program will cease all execution.

**Initial display state**

Now that we have taken care of the set-up, the last remaining lines are as follows
```
    printSmiley(GLAD_SMILEY);
    uBit.sleep(400);
    printPairPatternAnimated();
```
Now these should be fairly obvious, they put a happy smiley on the display, waits for 400ms and prints the pairing pattern in an animated fashion.

#### Understanding main.cpp 

After discussing the main function, you should have a good idea of how it all works, but let's quickly look through the rest of the `main.cpp` file starting at the top.

```c++
MicroBit uBit;
typedef __uint8_t uint8_t ;
```

`uBit` is the reference to the micro:bit object, it has all of the neccessary modules such as `uBit.accelerometer`, `uBit.ble`(bluetooth module) or `uBit.bleManager`. I suggest looking to the [samples](https://github.com/lancaster-university/microbit-v2-samples) for more information on the CODAL modules.

The line `typedef __uint8_t uint8_t ;` was to prevent IDE errors because of `<type-error>` warnings. It has no actual effect besides keeping the IDE happy. `uint8_t` is by the way a 'lighter' integer, that is used instead of `int` wherever possible as it uses less memory.

Let's now look at the other methods that are defined inside main.cpp
```c++
void sendString(ManagedString s)
{
    if (connected == 0)
        return;

    uart->send(s);
}
```
`sendString` is a method for sending messages outbound from the micro:bit. It is not used anywhere, but it's available for future usage

```c++
void onConnected(MicroBitEvent)
{
    connected = 1; // Set the connected flag
    printSmiley(GLAD_SMILEY);
}
```
`onConnected` is the event called by the micro:bit event system when a bluetooth connection is made.

```c++
void onDisconnected(MicroBitEvent)
{
    connected = 0; // Set the connected flag
    
    printSmiley(SAD_SMILEY);

    uBit.sleep(2000);
    printPairPattern();
}
```
`onDisconnect` is the event called by the micro:bit event system when a bluetooth connection is broken.

```c++
void onDelim(MicroBitEvent)
{
    int beat = 200;
    ManagedString r = uart->readUntil("#");
    ManagedString prefix = r.substring(0,2);

    if (prefix == "s_") {
        ManagedString soundNo = r.substring(2,1);
        playSound(getSound(soundNo), beat);
    }
}
```
`onDelim` is the event called by the micro:bit event system when a *delimiting character* was received. Right now the UART service is used to determine what sound should be played. It will read from the buffer until the delimiting character, in this case '#', and since sound indeces from ML-Machine.org are sent as s1, s2 etc, it will substring the last character giving s1->1 s2->2, which will be used to figure out what sound to play.


#### Understanding the rest of the architecture

**The utilities.h file**
Inside the `utilities.h` header file, a few things are defined worth mentioning

The enum `Note` will map musical notes into frequencies that the micro:bit speaker uses to generate sound. *Fun fact: it is based on the A-440 scale.*
```c++
enum Note {
    C = 262,
    CSharp = 277,
    D = 294,
    ...
};
```

Functions for sound are also found. They are implemented in the `sound.cpp` file.
```c++
Note * getSound(ManagedString soundNo);

void playNote(Note note, int time);

void playSound(Note notes[], int beat);
```
The `playSound` plays a sound on the micro:bit speaker. It is parameterized by an array of Notes and a 'beat'. An example of note arrays can be found in `sounds.h` and the beat is how much time each note should be played for. We use 200ms for each note, which can be seen in the onDelim function inside of `main.cpp`.


Other helper functions for LED display are also found and implemented in `helpers.cpp`
```c++
void blink();

void printSmiley(const char * smiley);

void printPairPatternAnimated();

void printPairPattern();
```
The `printSmiley(const char * smiley)` takes a string as argument in order to display it. See `smileys.h` for predefined smileys to put as arguments and for examples on how to make your own.

Functions `PrintPairPattern()` and `PrintPairPatternAnimated()` however the first is instant and the last is animated. The implementations of these functions uses the `codebook.h` header to decode it's pairing pattern by matching each letter of the micro:bit's name to the placement inside of the codebook.

### Development advice

When developing the .hex files I recommend making two bash files to avoid having to manually copy the .hex into the micro:bit.

These are meant for MacOSX, but equivalents can be made for other development environments.

build_and_move.sh
```sh
python3 build.py

mv $(pwd)/MICROBIT.hex /volumes/MICROBIT/MICROBIT.hex
```
build_clear_and_move.sh
```sh
python3 build.py -c

mv $(pwd)/MICROBIT.hex /volumes/MICROBIT/MICROBIT.hex
```

