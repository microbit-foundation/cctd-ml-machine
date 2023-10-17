/**
 * @jest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from "svelte/store";
import { t } from "../i18n";

describe('Initialization tests', () =>{
    beforeEach( () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        global.window = Object.create(window);
    });

    test('Default language is set to english', () => {
        const getText = get(t);
        const translatedText = getText("alert.isRecording");

        expect(translatedText).toBe("You are currently recording!");
    });
});
