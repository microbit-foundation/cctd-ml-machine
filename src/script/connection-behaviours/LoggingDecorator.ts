import MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import MBSpecs from "../microbit-interfacing/MBSpecs";
import type ConnectionBehaviour from "./ConnectionBehaviour";

/**
 * Used for logging / Decorator pattern
 */
abstract class LoggingDecorator implements ConnectionBehaviour {
    private enableLogging: boolean = location.hostname == "localhost" && false

    onReady(): void {
        this.enableLogging && console.log("Is ready!")
    }

    // For preventing spam of accelerometer data
    private logTimer = new Date().getTime();
    private logInterval = 1000

    accelerometerChange(x: number, y: number, z: number): void {
        // this.enableLogging && this.logTimed("X:", x, "Y:", y,"Z:",z)
    }

    buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {
        this.enableLogging && console.log("Button change", buttonState, button)
    }

    onAssigned(microbit: MicrobitBluetooth, name: string): void {
        this.enableLogging && console.log(name, " was assigned ")
        this.enableLogging && console.log(microbit)
    }

    onCancelledBluetoothRequest(): void {
        this.enableLogging && console.log("Device request was cancelled")
    }

    onConnected(name: string): void {
        this.enableLogging && console.log(name, " got connected via bluetooth")
    }

    onDisconnected(): void {
        this.enableLogging && console.log("disconnected via bluetooth")

    }

    onExpelled(manual?: boolean, bothExpelled?: boolean): void {
        this.enableLogging && console.log("Was expelled manually?:", manual, "both?:", bothExpelled)
    }

    private logTimed(...msg: (string | number)[]) {
        if (new Date().getTime() - this.logTimer > this.logInterval) {
            console.log(msg)
            this.logTimer = new Date().getTime()
        }
    }
}

export default LoggingDecorator;