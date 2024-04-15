import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, Button, Pressable, SafeAreaView, Image, TouchableOpacity } from "react-native"
import MapView, { Callout, Marker } from 'react-native-maps'
import SlidingUpPanel from "rn-sliding-up-panel";
import * as Location from 'expo-location';
import { db, auth } from '../firebaseConfig';
import { Firestore, collection, getDocs,doc, query, where, updateDoc } from "firebase/firestore";

import { Icon } from 'react-native-elements'


const Search = () => {
    const [markersArray, setMarkersArray] = useState([])
    const [deviceLatitude, setDeviceLatitude] = useState(37.78825)
    const [deviceLongitude, setDeviceLongitude] = useState(-122.4324)
    const latitudeDelta = 0.0922
    const longitudeDelta = 0.0421

    const [title, setTitle] = useState('San Francisco')
    const [desc, setDesc] = useState('Home of Apple and Facebook')
    const [deviceLocation, setDeviceLocation] = useState({ lat: 37.78825, lng: -122.4324 });
    const [currAddress, setCurrAddress] = useState(null);

    const [searchLoacation, setSearchLocation] = useState('')
    const [mapCoords, setMapCoords] = useState({})
    const [cars, setData] = useState([]);
    const [currentCar, setCurrentCar] = useState({})
    const [picture, setPicture] = useState(0)


    const MARKERS_ARRAY = [
        {
            lat: 37.78825,
            lng: -122.4344,
            name: "San Francisco",
            desc: "Home of Apple and Facebook",
        },
        {
            lat: 37.78849,
            lng: -122.40679,
            name: "Union Square",
            desc: "A central meeting square surrounded by shops.",
        },
        {
            lat: 40.759211,
            lng: -73.984638,
            name: "current location",
            desc: "for vibes",
        }
    ];

    const fetchCars = async () => {
        try {


            const q = query(collection(db, "cars"), where("status", "==", "OPEN"));
            const querySnapshot = await getDocs(q);
            
            const resultsFromFirestore = [];
            
            querySnapshot.forEach((doc) => {
                const itemToAdd = {
                    id: doc.id,
                    ...doc.data()
                }
                resultsFromFirestore.push(itemToAdd);
            });
            //console.log(`resultsFromFirestore: ${resultsFromFirestore}`)
            setData(resultsFromFirestore);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const getCurrentLocation = async () => {
        try {
            // 1. get permissions 
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert(`Permission to access location was denied`)
                return
            }
            // alert("Permission granted")

            // 2. if permission granted, then get the location            
            // 3. do something with the retreived location
            let location = await Location.getCurrentPositionAsync()
            // alert(JSON.stringify(location))
            // console.log(location)
            // display the location in the UI
            setDeviceLocation({ lat: location.coords.latitude, lng: location.coords.longitude })
            setDeviceLatitude(location.coords.latitude)
            setDeviceLongitude(location.coords.longitude)
            setMapCoords({ lat: location.coords.latitude, lng: location.coords.longitude })
        } catch (err) {
            console.log(err)
        }
    }

    const doForwardGeocode = async () => {
        try {
            // 0. on android, permissions must be granted
            // 1. do geocoding
            // console.log(`Attempting to geocode: ${searchLoacation}`)
            const geocodedLocation = await Location.geocodeAsync(searchLoacation)
            // 2. Check if a result is found
            const result = geocodedLocation[0]
            if (result === undefined) {
                alert("No coordinates found")
                return
            }
            // 3. do something with results 
            // console.log(result)           
            // alert(JSON.stringify(result))
            // update state variable to an object that contains the lat/lng
            // (alternatively you could have created 2 separate state variables)
            setMapCoords({ lat: result.latitude, lng: result.longitude })

        } catch (err) {
            console.log(err)
        }
    }

    const doReverseGeocode = async (lat, lng) => {
        alert("reverse geocode button clicked")
        try {
            // 0. on android, permissions must be granted
            // 1. do geocoding
            const coords = {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
            }
            // 2. check if result found
            const postalAddresses = await Location.reverseGeocodeAsync(coords, {})

            const result = postalAddresses[0]
            if (result === undefined) {
                alert("No results found.")
                return
            }
            console.log(result)
            alert(JSON.stringify(result))

            // 3. do something with results

            // output the street address and number to the user interace
            const output = `${result.streetNumber} ${result.street}, ${result.city}, ${result.region}`
            // save it to a state variable to display on screen
            setCurrAddress(output)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCurrentLocation()
        
        this._panel.hide()
    }, [])
    useEffect(() => {
        fetchCars()
        setMarkersArray(MARKERS_ARRAY)
    }, [cars])

    const updatePicture = () => {
        if (currentCar.carImage.length -1 === picture) {
            setPicture(0)
        }
        else {
            setPicture(picture+1)
        }

    }
   


    const bookCar = async() => {

        try {

            const insertedDocument = await updateDoc(doc(db, "cars", currentCar.id), {status:"PENDING",renterEmail:auth.currentUser.email,renterImage:"https://images.unsplash.com/photo-1712242467502-678b72cc8b5b?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"});
         
            alert('Booking request sent: Awaiting Confirmation')
        } catch (err) {
            console.log(err)
        }
        // update current car with renter == currentuser.email and status == "PENDING"
    }

    return (
        <View style={styles.container}>
            {/* 3. MapView */}

            <View>
                <MapView
                    style={{ height: "100%", width: "100%" }}
                    region={{
                        latitude: mapCoords.lat,
                        longitude: mapCoords.lng,
                        latitudeDelta: 0.3822,
                        longitudeDelta: 0.1421,
                    }}
                >
                    {
                        // loop through the markers array            
                        cars.map(
                            // currItemInArray == the current item we are iterating over
                            // pos = position in the array             
                            (currItem, pos) => {
                                // console.log(`current item: ${currItem.latitude}`)
                                // console.log(`current item: ${currItem.longitude}`)

                                const coords = {
                                    latitude: currItem.latitude,
                                    longitude: currItem.longitude
                                }

                                return (
                                    <Marker
                                        key={pos}
                                        coordinate={coords}
                                        // title={currItem.make}
                                        // description={currItem.model}
                                        onPress={() => {
                                            setCurrentCar(currItem)
                                            setMapCoords({lat:currItem.latitude, lng: currItem.longitude})
                                            setPicture(0)
                                            this._panel.show(250)
                                        }}
                                        onDeselect={() => {
                                            this._panel.hide()
                                        }}
                                    >
                                        <Pressable style={styles.marker}  >
                                            <Text>{"$" + currItem.price}</Text>
                                        </Pressable>

                                    </Marker>
                                )
                            }
                        )
                    }

                </MapView>
            </View>
            <View>
                <SlidingUpPanel
                    draggableRange={{ top: 400, bottom: 0 }} // Customize the range
                    showBackdrop={true} // Set to true for a modal-like effect
                    ref={(c) => (this._panel = c)}
                    visible={false} // Set to true if you want it visible on load
                >
                    {/* Your slide-up panel content */}

                    <View style={styles.panelView}>
                        <View>
                            <Text style={styles.title}>{currentCar.make}</Text>
                            <Text>{currentCar.model}</Text>

                            <Pressable onPress={updatePicture}>
                            {currentCar.carImage ?  <Image source={{ uri: currentCar.carImage[picture].url_full }} style={{ height: 200, width: 'auto' }} /> : <Text>Nothing</Text>}
                            </Pressable>
                        </View>

                        <View>
                            <Text style={{fontWeight:'bold'}}>{"$" + currentCar.price}</Text>

                            <Text>{"Pick Up: " + currentCar.address}</Text>
                        </View>
                        <View style={styles.btn}>
                            <Pressable onPress={bookCar}>
                                <Text style={styles.btnLabel}>Book now</Text>
                            </Pressable>
                        </View>
                    </View>
                    {/* You can use this._panel.show() and this._panel.hide() to control visibility */}
                </SlidingUpPanel>
            </View>
            <View style={styles.searchBar}>
                <TextInput style={{ flex: 1 }} value={searchLoacation} onChangeText={setSearchLocation} placeholder="Search city" />
                {/* <Icon name='search'/> */}
                <Pressable onPress={doForwardGeocode}>

                    <Icon name='search' />

                </Pressable>
                <Pressable onPress={() => {
                    setMapCoords(deviceLocation)
                }}>

                    <Icon name='home' />

                </Pressable>
            </View>


        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // padding: 20,
    },
    map: {
        height: "90%",
        width: "100%",
    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        paddingVertical: 10,
        marginVertical: 10,
        // height:50,
        alignItems: 'center',
        backgroundColor: 'black',
        color:'white'
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center",
        color:'white',
        fontWeight:'bold'
    },
    tb: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: "#efefef",
        color: "#333",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 10,
    },
    panelView: {
        backgroundColor: 'white',
        height: '100%',
        padding: 20,
        borderRadius: 15,
        // backgroundColor: 'beige'
    },
    marker: {
        backgroundColor: 'white',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderWidth: 1,
        borderColor: 'black'

    },

    searchBar: {
        flexDirection: 'row',
        position: 'absolute',
        top: "7%",
        alignSelf: 'center',
        width: '70%',
        // height: 30,
        borderRadius: 10,

        backgroundColor: 'white',
        padding: 4,
        borderColor: 'black',
        borderWidth: 1
    },

    detailsRow: {
        width: '90%',
        flexDirection: "row",
        justifyContent: "space-between"

    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        alignContent: "center",
        // textAlign: "center"
    },
    subtitle: {
        fontSize: 20,
    }
});

export default Search

