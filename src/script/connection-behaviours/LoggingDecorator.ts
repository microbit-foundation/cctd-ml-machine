import MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import MBSpecs from "../microbit-interfacing/MBSpecs";
import type ConnectionBehaviour from "./ConnectionBehaviour";

class LoggingDecorator implements ConnectionBehaviour {

    private logTimer = new Date().getTime();
    private logInteval = 1000

    accelerometerChange(x: number, y: number, z: number): void {
        this.logTimed("X:", x, "Y:", y,"Z:",z)
    }

    buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {
    }

    isAssigned(): boolean {
        return false;
    }

    onAssigned(microbit: MicrobitBluetooth, name: string): void {
    }

    onCancelledBluetoothRequest(): void {
    }

    onConnected(name: string): void {
    }

    onDisconnected(): void {
    }

    onExpelled(manual?: boolean, bothExpelled?: boolean): void {
    }

    private logTimed(...msg: (string | number)[]) {
        if (new Date().getTime() - this.logTimer > this.logInteval) {
            console.log(msg)
            this.logTimer = new Date().getTime()
        }
    }
}