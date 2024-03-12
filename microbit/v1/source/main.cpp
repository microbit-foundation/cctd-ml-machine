/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
#include "MicroBit.h"
#include "MicroBitUARTService.h"
#include "MicroBitAccelerometerService.h"
#include "MicroBitMagnetometerService.h"
#include "MicroBitIOPinService.h"
#include "MicroBitLEDService.h"
#include "MicroBitButtonService.h"

MicroBit uBit;

MicroBitAccelerometerService *accel;
MicroBitMagnetometerService *magnet;
MicroBitUARTService *uart;
MicroBitLEDService *led;
MicroBitIOPinService *io;
MicroBitButtonService *btn;
MicroBitImage pairPtn;
int connected = 0;

// For now manually increment this by one for each build. Used by app to determine the capabilities of the microbit
int buildNumber = 1; 

const uint8_t CODEBOOK[MICROBIT_NAME_LENGTH][MICROBIT_NAME_CODE_LETTERS] =
    {
        {'z', 'v', 'g', 'p', 't'},
        {'u', 'o', 'i', 'e', 'a'},
        {'z', 'v', 'g', 'p', 't'},
        {'u', 'o', 'i', 'e', 'a'},
        {'z', 'v', 'g', 'p', 't'}
    };

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
    const uint8_t smiley[] {
                          0, 0, 0, 0, 0,
                          0, 1, 0, 1, 0,
                          0, 0, 0, 0, 0,
                          1, 0, 0, 0, 1,
                          0, 1, 1, 1, 0, };

    MicroBitImage happy(5,5,smiley);
    uBit.display.print(happy);

    for (size_t i = 0; i < 12; i++)
    {
        if (!connected) {
            break;
        }
        uBit.sleep(1000);
        uart->send(ManagedString("id_prop")); // MUST be sent before vi_ message
        uart->send(ManagedString("vi_") + ManagedString(buildNumber));
    }
}

/**
 * @brief The event that is fired upon bluetooth disconnection.
 */
void onDisconnected(MicroBitEvent)
{
    connected = 0; // Set the connected flag

    const uint8_t smiley[] {
                          0, 0, 0, 0, 0,
                          0, 1, 0, 1, 0,
                          0, 0, 0, 0, 0,
                          0, 1, 1, 1, 0,
                          1, 0, 0, 0, 1, };

    MicroBitImage unHappy(5,5,smiley);
    uBit.display.print(unHappy);

    uBit.sleep(2000);
    uBit.display.image.paste(pairPtn);
}

MicroBitImage getPairPattern() {
    ManagedString name = uBit.getName();
    MicroBitImage image(5,5);
    for (int i = 0; i < MICROBIT_NAME_LENGTH; i++) {
        for (int j = 0; j < MICROBIT_NAME_CODE_LETTERS; j++) {
            if (name.charAt(i) == CODEBOOK[i][j]) {
                for (int k = 0; k < j+1; k++) {
                    image.setPixelValue(i, 4-k, 1);
                }
            }
        }
    }
    return image;
}

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
    magnet = new MicroBitMagnetometerService(*uBit.ble, uBit.compass);

    pairPtn = getPairPattern();

    uBit.display.image.paste(pairPtn);

    release_fiber();
}
