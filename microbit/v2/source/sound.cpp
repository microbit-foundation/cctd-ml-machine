/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
#include "MicroBit.h"
#include "utilities.h"
#include "sounds.h"
extern MicroBit uBit;

/**
 * @brief Plays a single note for a specified amount of time.
 * 
 * @param note The note
 * @param time Time to play it for
 */
void playNote(Note note, int time)
{
    // Disable RUN_MIC
    uBit.io.runmic.setDigitalValue(0);

    uBit.io.speaker.setAnalogValue(512);

    uBit.io.speaker.setAnalogPeriodUs(note);
    uBit.sleep(time);

    uBit.io.speaker.setAnalogValue(0);
}

/**
 * @brief Plays a series of notes with some interval inbetween each note.
 * 
 * @param notes An array of notes to play
 * @param beat The time between each note.
 */
void playSound(Note notes[], int beat) {
    for (int i = 0; i < sizeof(notes); i++) {
        Note note = notes[i];
        playNote(note, beat);
    }
}

/**
 * @brief Returns one of the sounds in sounds.h. 
 * Note: adding new sounds needs you to modify this function aswell.
 * @param soundNo The string indicating sound number such as the string "0" or "5"
 * @return Note* The array of notes that can be played
 */
Note * getSound(ManagedString soundNo) {
    if (soundNo == "0") {
        return SOUND_0;
    }
    if (soundNo == "1") {
        return SOUND_1;
    }
    if (soundNo == "2") {
        return SOUND_2;
    }
    if (soundNo == "3") {
        return SOUND_3;
    }
    if (soundNo == "4") {
        return SOUND_4;
    }
    if (soundNo == "5") {
        return SOUND_5;
    }
    return DEV_ERR;
}