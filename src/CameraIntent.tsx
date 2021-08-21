/**
 * @format
 */

import React, { Component } from 'react';
import { Vibration, StyleSheet } from 'react-native';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import eventHandler from './eventHandler';
import { Props } from '../model/interfaces';
import { ShcDecoder } from './shcDecoder';
import { Alert } from 'react-native';
import { NotSHCException } from '../exceptions/NotSHCException';
import { InvalidIssException } from '../exceptions/InvalidIssException';

class CameraIntent extends Component<Props> {
    camera: RNCamera | null;
    isRead: boolean;
    shcDecoder: ShcDecoder;
    constructor(props: any) {
        super(props);
        this.camera = null;
        this.isRead = false;
        this.shcDecoder = new ShcDecoder();
    }

    async onBarCodeRead(scanResult: BarCodeReadEvent): Promise<void> {
        if (!this.isRead) {
            this.isRead = true;
            Vibration.vibrate(250);
            let shc = undefined;
            try {
                shc = await this.shcDecoder.decode(scanResult.data);
            } catch (e) {
                if (e instanceof NotSHCException || e instanceof InvalidIssException) {
                    Alert.alert('Une erreur s\'est produite...', e.message);
                } else {
                    Alert.alert('Une erreur s\'est produite...');
                }
            }
            this.props.navigation.goBack();
            eventHandler.emitter.emit('shcDecoded', shc);
        }
        return;
    }

    render() {
        return (
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={styles.camera}
                onBarCodeRead={this.onBarCodeRead.bind(this)}
                barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                type={RNCamera.Constants.Type.back}
                captureAudio={false}
            />
        );
    }
};

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        width: '100%',
    },
});

export default CameraIntent;
