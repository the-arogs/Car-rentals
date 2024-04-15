import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Image, Text, Pressable, Dimensions, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { db,auth } from '../firebaseConfig';
import { Firestore, collection, getDocs,doc, query, where, updateDoc } from "firebase/firestore";


const windowWidth = Dimensions.get("window").width;

const Reservation = ({ navigation, route }) => {
    const {id} = route.params
    const { address } = route.params
    const {carImage} = route.params
    const {make} = route.params
    const {model} = route.params
    const {trim} = route.params
    const {image} = route.params
    const {label} = route.params
    const {seatingCapacity} = route.params
    const { license } = route.params
    const { price } = route.params
    const { status } = route.params
    const { confirmationCode } = route.params
    const {date} = route.params
    const {ownerId} = route.params
    const {ownerImage} = route.params

    const [confirmation,setConfirmationCode] = useState(confirmationCode)
    const [approval,setApproval] = useState(status)

    const [hasConfirmation, setHasConfirmation] = useState(false)
    const [pendingConfirmation, setPendingConfirmation] = useState(false)

    const [picture, setPicture] = useState(0)

    const checkConfirmation = () => {
        setHasConfirmation(confirmation !== "")
        setPendingConfirmation(status !== "OPEN")
    }

    const updatePicture = () => {
        if (carImage.length-1 === picture) {
            setPicture(0)
        }
        else {
            setPicture(picture+1)
        }

    }
    const generateConfirmation = () => {
        const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ023456789023456789';
        let result = ""
        const length = 6

        let counter = 0
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
             counter += 1;
        };

        setConfirmationCode(result)
        setApproval("APPROVED")

  
    }

    const decline = async () => {
        // consult if booking rejected should delete request or change status to REJECTED
        setApproval("OPEN")
        setConfirmationCode("")
        try {

            const insertedDocument = await updateDoc(doc(db, "cars", id), {status:"OPEN",renterEmail:"",renterImage:""});
         
            alert('Booking Cancelled')
        } catch (err) {
            console.log(err)
        }



    }

    useEffect(() => {
        checkConfirmation()

    }, [confirmation])


    const nav = useNavigation();

    return (
        <View style={styles.container}>
            <Pressable onPress={updatePicture}>
            <Image
                style={styles.image}
                source={{ uri: carImage[picture].url_full }}
            />
            </Pressable>
            <View style = {styles.content}>
                <View>
                    <Text style={styles.title}>
                        {label}
                    </Text>
                    <Text style={styles.license}>{license}</Text>
                </View>

                <View style={styles.detailsRow}>
                <Text>Reservation: {date.slice(0,15)}</Text>
                    <Text>Price: ${price}</Text>
                </View>

                <View style={styles.detailsRow}>
                    <Text>Status: {approval}</Text>

                    {hasConfirmation ? (
                        <Text>Confirmation: {confirmation}</Text>
                    ) : (
                        <Text>Awaiting Confirmation</Text>
                    )}

                </View>
                {approval !== "OPEN" ? (
                <View>
 
                    <Pressable onPress={decline} style = {styles.declineButton}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
                    
                </View>):(null)}
            </View>

            <View>


                <View style={styles.ownerbar}>
                    <Image
                        style={styles.imageProfile}
                        source={{ uri: ownerImage}}
                    />

                    <View>
                        <Text style={styles.subtitle}>Owner</Text>
                        <Text>{ownerId}</Text>
                    </View>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center"

    },

    detailsRow: {
        width: windowWidth * 0.90,
        flexDirection: "row",
        justifyContent: "space-between"

    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        alignContent: "center",
        textAlign: "center"
    },
    subtitle: {
        fontSize: 20,
    },

    license: {
        alignContent: "center",
        textAlign: "center",
        marginBottom: 10
    },

    image: {
        width: windowWidth,
        aspectRatio: 1

    },
    imageProfile: {
        width: 100,
        height: 100,
        borderRadius: 100
    },
    ownerbar: {
        marginTop: 15,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        height:"45%"
    },

    declineButton:{
        padding:10,
        paddingHorizontal:50,
        backgroundColor: "#ff4757",
        borderRadius:5,
        marginTop:10,
        

    },
    buttonText:{
        fontWeight:"bold",
        textAlign:"center"

    }

});

export default Reservation;