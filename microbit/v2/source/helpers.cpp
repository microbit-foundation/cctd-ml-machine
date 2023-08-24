/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

#include "MicroBit.h" 
#include "codebook.h"
#include "utilities.h"

extern MicroBit uBit;
typedef __uint8_t uint8_t ;

/**
 * @brief Blinks the display for 150 milliseconds.
 */
void blink() {
    MicroBitImage img = uBit.display.image.clone();
    uBit.display.clear();
    uBit.sleep(150);
    uBit.display.image.paste(img);
    uBit.sleep(100);
}

/**
 * @brief Prints a smiley found in smileys.h
 * 
 * @param smiley an array of integers that represents the brightness levels of each LED.
 */
void printSmiley(const char * smiley) {
    MicroBitImage outputImage(smiley);
    uBit.display.print(outputImage);
}

/**
 * @brief Prints the pairing pattern on the LED display instantly.
 */
void printPairPattern() {
    ManagedString name = ManagedString(microbit_friendly_name());
    MicroBitImage image(5,5);
    for (int i = 0; i < MICROBIT_NAME_LENGTH; i++) {
        for (int j = 0; j < MICROBIT_NAME_CODE_LETTERS; j++) {
            if (name.charAt(i) == CODEBOOK[i][j]) {
                for (int k = 0; k < j+1; k++) {
                    // Adding the sleep command sort of animates the display
                    image.setPixelValue(i, 4-k, 100);
                }
            }
        }
    }
    uBit.display.image.paste(image);
}

/**
 * @brief Prints the pairing pattern on the LED display in an animated fashion.
 */
void printPairPatternAnimated() {
    const uint8_t levels[] = {10, 40, 100}; // brightness levels over each iteration
    const uint8_t intervals[] = {80, 30, 30}; // sleep intervals between each LED change
    ManagedString name = ManagedString(microbit_friendly_name());
    MicroBitImage image(5,5);

    for (int i = 0; i < sizeof(levels); i++) {
        uint8_t brightnessLevel = levels[i];
        uint8_t sleep = intervals[i];
        for (int i = 0; i < MICROBIT_NAME_LENGTH; i++) {
            for (int j = 0; j < MICROBIT_NAME_CODE_LETTERS; j++) {
                if (name.charAt(i) == CODEBOOK[i][j]) {
                    for (int k = 0; k < j+1; k++) {
                        // Adding the sleep command sort of animates the display
                        image.setPixelValue(i, 4-k, brightnessLevel);
                        uBit.sleep(sleep);
                        uBit.display.image.paste(image);
                    }
                }
            }
        }
    }
    uBit.sleep(200);
    blink(); blink();
}