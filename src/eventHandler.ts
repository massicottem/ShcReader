import { NativeEventEmitter, NativeModules } from 'react-native';

const { NativeEventHandler } = NativeModules;

const emitter = new NativeEventEmitter(NativeEventHandler);

export default {
    emitter
};
