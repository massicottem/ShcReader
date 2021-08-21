/**
 * @format
 */

import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, SafeAreaView, ScrollView, Text, Dimensions, EmitterSubscription } from 'react-native';
import eventHandler from './eventHandler';
import { Props, State } from '../model/interfaces';
import { SmartHealthCard } from '../model/smartHealthCard';

class Home extends Component<Props, State> {
    private eventListener: EmitterSubscription;

    constructor(props: any) {
        super(props);
        this.state = { shc: undefined };
        this.eventListener = eventHandler.emitter.addListener('shcDecoded', (data) => {
            this.cameraCallback(data);
        });
    }

    componentWillUnmount(): void {
        this.eventListener.remove();
    }

    private openCamera(): void {
        this.props.navigation.navigate('CameraIntent');
    }

    private cameraCallback(shc: SmartHealthCard): void {
        this.setState({ shc: shc });
    }

    render() {
        const separator = <View
            style={{
                borderBottomColor: '#b0b3b5',
                borderBottomWidth: 1,
                marginBottom: 4,
            }}
        />

        const emptyView =
            <View style={styles.emptyView}>
                <Image
                    style={styles.qrScanImage}
                    source={require('../assets/img/qrScan.png')}
                />
                <Text style={styles.emptyTitle}>Commencez par scanner un passeport vaccinal</Text>
            </View>

        const authenticPassport =
            <View style={styles.validityInfo}>
                <Image
                    style={{
                        tintColor: '#10B981',
                        width: width * 0.2,
                        height: width * 0.25,
                        marginTop: 5
                    }}
                    source={require('../assets/img/check.png')}
                />
                <Text style={styles.textValidity}>Ce passeport est a été émis par le Gouvernement du Québec et est authentique.</Text>
            </View>

        const onlyOneDose =
            <View style={styles.validityInfo}>
                <Image
                    style={{
                        tintColor: '#f0bf00',
                        width: width * 0.25,
                        height: width * 0.23,
                        marginTop: 5
                    }}
                    source={require('../assets/img/warn.png')}
                />
                <Text style={styles.textValidity}>Ce passeport est authentique mais cette personne n'a reçu qu'une seule dose de vaccin...</Text>
            </View>

        const invalidPassport =
            <View style={styles.validityInfo}>
                <Image
                    style={{
                        tintColor: '#cf1100',
                        width: width * 0.25,
                        height: width * 0.25,
                        marginTop: 5
                    }}
                    source={require('../assets/img/failed.png')}
                />
                <Text style={styles.textValidity}>L'authenticité de ce passeport n'a pas pu être vérifiée...</Text>
            </View>

        const scannedShc =
            <ScrollView style={styles.scrollView}>
                <View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Identification</Text>
                        {separator}
                        <View style={styles.row}>
                            <View style={styles.vaccineInfo}>
                                <Text style={styles.label}>Nom</Text>
                                <Text style={styles.text}>{this.state.shc?.payload.name}, {this.state.shc?.payload.firstName}</Text>
                                <Text style={styles.label}>Date de naissance</Text>
                                <Text style={styles.text}>{this.state.shc?.payload.birthDate}</Text>
                                <Text style={styles.label}>Genre</Text>
                                <Text style={styles.text}>{this.state.shc?.payload.gender}</Text>
                            </View>
                            <View style={styles.validityInfo}>
                                {this.state.shc?.trustable ? (this.state.shc?.payload.secondDose ? authenticPassport : onlyOneDose) : invalidPassport}
                            </View>
                        </View>

                    </View>
                    <Text style={styles.sectionTitle}>Immunisation</Text>
                    {separator}
                    <View style={styles.section}>
                        <Text style={styles.label}>Date de la première dose</Text>
                        <Text style={styles.text}>{this.state.shc?.payload.firstDose.occurrenceDate}</Text>
                        <Text style={styles.label}>Lieu</Text>
                        <Text style={styles.text}>{this.state.shc?.payload.firstDose.location}</Text>
                        <View style={styles.row}>
                            <View style={styles.vaccineInfo}>
                                <Text style={styles.label}>Vaccin reçu</Text>
                                <Text style={styles.text}>{this.state.shc?.payload.firstDose.vaccineName} {this.state.shc?.payload.firstDose.vaccineCode ?
                                    `(${this.state.shc?.payload.firstDose.vaccineCode})` : ''}</Text>
                            </View>
                            <View style={styles.vaccineInfo}>
                                <Text style={styles.label}>Numéro de lot</Text>
                                <Text style={styles.text}>{this.state.shc?.payload.firstDose.lotNumber}</Text>
                            </View>
                        </View>
                    </View>
                    {separator}
                    {this.state.shc?.payload.secondDose ?
                        <View style={styles.section}>
                            <Text style={styles.label}>Date de la deuxième dose</Text>
                            <Text style={styles.text}>{this.state.shc?.payload.secondDose?.occurrenceDate}</Text>
                            <Text style={styles.label}>Lieu</Text>
                            <Text style={styles.text}>{this.state.shc?.payload.secondDose?.location}</Text>
                            <View style={styles.row}>
                                <View style={styles.vaccineInfo}>
                                    <Text style={styles.label}>Vaccin reçu</Text>
                                    <Text style={styles.text}>{this.state.shc?.payload.secondDose?.vaccineName} {this.state.shc?.payload.secondDose?.vaccineCode ?
                                        `(${this.state.shc?.payload.secondDose.vaccineCode})` : ''}</Text>
                                </View>
                                <View style={styles.vaccineInfo}>
                                    <Text style={styles.label}>Numéro de lot</Text>
                                    <Text style={styles.text}>{this.state.shc?.payload.secondDose?.lotNumber}</Text>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={styles.section}>
                            <Text style={styles.text}>⚠ Cette personne n'a pas encore reçu sa deuxième dose. ⚠</Text>
                        </View>

                    }
                </View>
            </ScrollView>

        return (
            <View style={styles.background}>
                <SafeAreaView style={styles.container}>
                    {this.state.shc ? scannedShc : emptyView}
                    <View style={styles.scanBtnView}>
                        <TouchableOpacity
                            style={styles.scanBtn}
                            onPress={this.openCamera.bind(this)}>
                            <Text style={styles.scanBtnTxt}>Scanner un passeport vaccinal</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#d5d9db',
    },
    qrScanImage: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: 10,
        marginBottom: 60,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
        marginVertical: 16,
    },
    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        color: '#151617',
        fontFamily: 'Nunito-SemiBold',
        fontSize: 25,
        textAlign: 'center',
    },
    scrollView: {
        flex: 0.8,
    },
    scanBtnView: {
        flex: 0.1,
        justifyContent: 'flex-end',
    },
    scanBtn: {
        backgroundColor: '#5786c9',
        borderRadius: 7.5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        elevation: 4,
    },
    scanBtnTxt: {
        color: '#ffffff',
        fontFamily: 'Nunito-SemiBold',
        fontSize: 14,
        alignSelf: 'center',
        textTransform: 'uppercase',
    },
    sectionTitle: {
        color: '#151617',
        fontFamily: 'Nunito-SemiBold',
        fontSize: 20,
    },
    section: {
        marginBottom: 10,
    },
    label: {
        color: '#5786c9',
        fontFamily: 'Nunito-SemiBold',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 4,
    },
    text: {
        color: '#151617',
        fontFamily: 'Nunito-SemiBold',
        fontSize: 16,
    },
    textValidity: {
        color: '#151617',
        fontFamily: 'Nunito-SemiBold',
        fontSize: 13,
        marginTop: 3,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
    },
    vaccineInfo: {
        flex: 0.5,
    },
    validityInfo: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Home;
