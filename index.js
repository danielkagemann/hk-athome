/**
 * hk-athome is a simple accessory based on switch to signal
 * if someone is at home (on) or not(off)
 *
 * @author daniel kagemann
 */
const hap = require("hap-nodejs");
const state = {
    atHome: true
};

const accessoryUuid = hap.uuid.generate("hap.kagemann.athome");
const accessory = new hap.Accessory("Anwesenheit", accessoryUuid);
const switchService = new hap.Service.Switch('Anwesenheit');

// 'On' characteristic is required
const onCharacteristic = switchService.getCharacteristic(hap.Characteristic.On);

const getStateSymbol = () => state.atHome ? '🏠' : '🚪';

// with the 'on' function we can add event handlers for different events, mainly the 'get' and 'set' event
onCharacteristic.on(hap.CharacteristicEventTypes.GET, callback => {
    console.log("...query current state " + getStateSymbol());
    callback(undefined, state.atHome);
});
onCharacteristic.on(hap.CharacteristicEventTypes.SET, (value, callback) => {
    state.atHome = value;
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
    category: hap.Categories.SWITCH, // value here defines the symbol shown in the pairing screen
});

console.log("thanks. setup done!");
