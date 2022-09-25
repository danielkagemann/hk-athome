/**
 * hk-athome is a simple accessory based on switch to signal
 * if someone is at home (on) or not(off)
 *
 * @author daniel kagemann
 */
import {
    Accessory,
    Categories,
    Characteristic,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    CharacteristicSetCallback,
    CharacteristicValue,
    HAPStorage,
    Service,
    uuid
} from "hap-nodejs";

let currentSwitchValue: boolean = false;

const accessoryUuid = uuid.generate("hap.kagemann.athome");
const accessory = new Accessory("Anwesend", accessoryUuid);
const switchService = new Service.Switch('Anwesend');

HAPStorage.setCustomStoragePath(process.env.STORAGEPATH ?? '.');

// 'On' characteristic is required
const onCharacteristic = switchService.getCharacteristic(Characteristic.On);

/**
 * return unicode symbol for on/off state
 */
const getStateSymbol = (): string => (currentSwitchValue ? '🏠' : '🚪');

// with the 'on' function we can add event handlers for different events, mainly the 'get' and 'set' event
onCharacteristic.on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
    console.log("...query current state " + getStateSymbol());
    callback(undefined, currentSwitchValue);
});
onCharacteristic.on(CharacteristicEventTypes.SET,
    (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        currentSwitchValue = value as boolean;
        console.log("...set state to " + getStateSymbol());
        callback();
    });

// adding the service to the accessory
accessory.addService(switchService);

// once everything is set up, we publish the accessory. Publish should always be the last step!
accessory.publish({
    username: "0a:d8:b5:bb:63:02",
    pincode: "300-92-008",
    port: 0,    // let server decide free port
    category: Categories.SWITCH, // value here defines the symbol shown in the pairing screen
});

console.log('hk-athome v1.0.0');
console.log("thanks. setup done!");
