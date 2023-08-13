/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
#include "utilities.h"
#ifndef SOUNDS_H_INCLUDED
#define SOUNDS_H_INCLUDED

// C E G C5 C5 C C5 C5
Note SOUND_0 [] = {
    Note::C, Note::E, Note::G, Note::C5, Note::C5, Note::C, Note::C5, Note::C5
};
// C C C C - - - - 
Note SOUND_1[] = {
    Note::C, Note::C, Note::C, Note::C
};
// C5 C5 C5 C5 - - - - 
Note SOUND_2[] = {
    Note::C5, Note::C5, Note::C5, Note::C5
};
// C5 A B G A F G E 
Note SOUND_3[] = {
    Note::C5, Note::A, Note::B, Note::G, Note::A, Note::F, Note::G, Note::E
};
// D D C C - - - - 
Note SOUND_4[] = {
    Note::D, Note::D, Note::C, Note::C
};
// G G E E G G E E
Note SOUND_5[] = {
    Note::G, Note::G, Note::E, Note::E, Note::G, Note::G, Note::E, Note::E
};

// DEV ERROR SOUND
Note DEV_ERR[] = {
    Note::A, Note::B, Note::C, Note::D, Note::E, Note::F, Note::G,
    Note::A3, Note::B3, Note::C3, Note::D3, Note::E3, Note::F3, Note::G3,
    Note::A4, Note::B4, Note::C4, Note::D4, Note::E4, Note::F4, Note::G4
};

#endif