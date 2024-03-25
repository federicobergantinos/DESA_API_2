import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import walletTheme from "../constants/Theme";
import Icon from "./Icon";
import ConfirmationModal from "./ConfirmationModal";
import {useNavigation} from "@react-navigation/native";

const DropdownMenu = (recipeId) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation()

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const editRecipe = () => {
        const id = recipeId.recipeId
        navigation.navigate("CreateRecipe", { recipeId: id })
        setMenuVisible(false);
    };

    const deleteRecipe = () => {
        setModalVisible(true)
        setMenuVisible(false);
    };

    return (
        <View style={styles.container}>
            <ConfirmationModal recipeId={recipeId.recipeId} visible={modalVisible} setShowModal={setModalVisible}/>
            <TouchableOpacity onPress={toggleMenu}>
                <Icon
                    family="Feather"
                    name="more-vertical"
                    size={25}
                    onPress={() => setMenuVisible(true)}
                    color={walletTheme.COLORS.WHITE}
                />
            </TouchableOpacity>
            {menuVisible && (
                <View style={styles.dropdown}>
                    <TouchableOpacity onPress={editRecipe} style={[styles.option, styles.border]}>
                        <Text style={styles.optionText}>Editar receta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteRecipe} style={styles.option}>
                        <Text style={[styles.optionText, styles.deleteOption]}>Borrar receta</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    menuTrigger: {
        fontSize: 24,
        color: 'black',
    },
    dropdown: {
        width: 100,
        position: 'absolute',
        top: 30, // Adjust this value to position the dropdown below the trigger
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        zIndex: 1,
    },
    option: {
        padding: 10,
    },
    border: {
        borderBottomWidth: 1,
        borderColor: walletTheme.COLORS.BORDER
    },
    optionText: {
        fontSize: 16,
        color: 'black',
    },
    deleteOption: {
        color: 'red',
    },
});

export default DropdownMenu;
