import MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import MBSpecs from "../microbit-interfacing/MBSpecs";
import type ConnectionBehaviour from "./ConnectionBehaviour";

/**
 * Used for logging / Decorator pattern
 */
abstract class LoggingDecorator implements ConnectionBehaviour {

    // For preventing spam of accelerometer data
    private logTimer = new Date().getTime();
    private logInterval = 1000

    accelerometerChange(x: number, y: number, z: number): void {
        this.logTimed("X:", x, "Y:", y,"Z:",z)
    }

    buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {
        console.log("Button change", buttonState, button)
    }

    onAssigned(microbit: MicrobitBluetooth, name: string): void {
        console.log(name, " was assigned ")
        console.log(microbit)
    }

    onCancelledBluetoothRequest(): void {
        console.log("Device request was cancelled")
    }

    onConnected(name: string): void {
        console.log(name, " got connected via bluetooth")
    }

    onDisconnected(): void {
        console.log("disconnected via bluetooth")

    }

    onExpelled(manual?: boolean, bothExpelled?: boolean): void {
        console.log("Was expelled manually?:", manual, "both?:", bothExpelled)
    }

    private logTimed(...msg: (string | number)[]) {
        if (new Date().getTime() - this.logTimer > this.logInterval) {
            console.log(msg)
            this.logTimer = new Date().getTime()
        }
    }
    abstract isAssigned(): boolean
}

export default LoggingDecorator;