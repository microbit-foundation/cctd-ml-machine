/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// This script is used to setup different build configurations
// run by ` node prepEnv.js branded ` for ml-machine-branded config
import { copyFile } from 'node:fs/promises';

// Validate input
const args = process.argv;
if (args.length < 3) {
    throw new Error("Not enough arguments. Try 'node prepEnv.js branded' ")
}
if (args.length > 3) {
    throw new Error("Too many arguments. Try 'node prepEnv.js branded' ")
}

// Configure build script and validate input
const fileMoveTargets = {
    "branded": [
        // Set source(first) and destination(second)
        ['./src/__viteBuildVariants__/ml-machine/windi.config.js', './windi.config.js'],
        ['./src/__viteBuildVariants__/ml-machine/features.json', './features.json']
    ],
    "unbranded": [
        ['./src/__viteBuildVariants__/unbranded/windi.config.js', './windi.config.js'],
        ['./src/__viteBuildVariants__/unbranded/features.json', './features.json']
    ],
    "simple": [
        ['./src/__viteBuildVariants__/ml-machine-simple/windi.config.js', './windi.config.js'],
        ['./src/__viteBuildVariants__/ml-machine-simple/features.json', './features.json']
    ]
}
const availableTargets = Object.getOwnPropertyNames(fileMoveTargets);
const buildVariantTarget = args[2];
if (!availableTargets.includes(buildVariantTarget)) {
    const listTargets = availableTargets.map(target => `  node prepEnv.js ${target}`).join("\n") + "\n";
    const errorMessage = `Invalid build variant target!\nUse on of the following build targets: \n${listTargets}`;
    throw new Error(errorMessage);
}

// The actual work
const copyFiles = fileMoveTargets[buildVariantTarget];

copyFiles.forEach(element => {
    const source = element[0];
    const destination = element[1];
    copyFile(source, destination).then(() => {
        console.log("Copied ", element[0], " -> ", element[1])
    }).catch((err) => {
        console.error("Failed to move ", source, " to ", destination)
        throw new Error(err)
    })
});