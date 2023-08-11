import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

export const VerintButton = (props) => {
    const { title = 'Need Title', style = {}, textStyle = {}, onPress } = props;

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={[styles.text, textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        height: 46,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.25,
        marginTop: 20,
        backgroundColor: '#2b65f2',
        shadowColor: '#000000',
        shadowOffset: { height: 3, width: 0 },
    },

    text: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});
