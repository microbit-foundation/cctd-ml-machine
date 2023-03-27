#include "MicroBit.h"
#include "MicroBitUARTService.h"
#include "MicroBitAccelerometerService.h"
#include "MicroBitIOPinService.h"
#include "MicroBitLEDService.h"
#include "MicroBitButtonService.h"
#include "utilities.h"
#include "smileys.h"

MicroBit uBit;

typedef __uint8_t uint8_t ;

// Services
MicroBitAccelerometerService *accel;
MicroBitUARTService *uart;
MicroBitLEDService *led;
MicroBitIOPinService *io;
MicroBitButtonService *btn;

// State
int connected = 0;

/**
 * @brief Sends a message with UART
 * 
 * @param s The message
 */
void sendString(ManagedString s)
{
    if (connected == 0)
        return;

    uart->send(s);
}

/**
 * @brief The event that is fired upon bluetooth connection.
 */
void onConnected(MicroBitEvent)
{
    connected = 1; // Set the connected flag
    printSmiley(GLAD_SMILEY);
}

/**
 * @brief The event that is fired upon bluetooth disconnection.
 */
void onDisconnected(MicroBitEvent)
{
    connected = 0; // Set the connected flag
    
    printSmiley(SAD_SMILEY);

    uBit.sleep(2000);
    printPairPattern();
}

/**
 * @brief Handler for incoming UART messages.
 */
void onDelim(MicroBitEvent)
{
    int beat = 200;
    ManagedString r = uart->readUntil("#");
    ManagedString soundNo = r.substring(1,1);
    playSound(getSound(soundNo), beat);
}

int main()
{
    // Initialise the micro:bit runtime.
    uBit.init();
    
    // Add listeners for events
    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, onConnected);
    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, onDisconnected);
    uBit.messageBus.listen(MICROBIT_ID_BLE_UART, MICROBIT_UART_S_EVT_DELIM_MATCH, onDelim);

    uBit.bleManager.setTransmitPower(7);

    // Initialise the micro:bit services.
    uart = new MicroBitUARTService(*uBit.ble, 32, 32);
    led = new MicroBitLEDService(*uBit.ble, uBit.display);
    io = new MicroBitIOPinService(*uBit.ble, uBit.io);
    btn = new MicroBitButtonService(*uBit.ble);
    accel = new MicroBitAccelerometerService(*uBit.ble, uBit.accelerometer);

    uart->eventOn("#");

    printSmiley(GLAD_SMILEY);

    uBit.sleep(400);
    printPairPatternAnimated();

    release_fiber();
}
