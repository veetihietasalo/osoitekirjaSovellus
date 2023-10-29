import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Input, ListItem} from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import { insertAddress, fetchAddresses, deleteAddress } from './db';

const db = SQLite.openDatabase('addresses.db');

export default function Places({ navigation }) {
  const [address, setAddress] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    if (shouldUpdate) {
      updateList();
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);
  
  const saveAddress = async () => {
    try {
      await insertAddress(db, address);
      updateList();
    } catch (error) {
      console.log("Database operation failed:", error);
    }
  };


  const updateList = async () => {
    console.log("Starting to update list");
    await fetchAddresses(db, setAddresses);
    console.log("Updated Addresses in updateList:", addresses);
  };

  const deleteItem = (id) => {
    deleteAddress(db, id, () => updateList());
  };
  console.log("Addresses state before rendering FlatList:", addresses);
  return (
    <View>
      <Input placeholder='Enter Address' onChangeText={text => setAddress(text)} value={address} />
      <Button title="Save" onPress={saveAddress} />
      
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={addresses}
        renderItem={({ item }) =>  (  
          <ListItem  onPress={() => navigation.navigate('MapQuest', { address: item.address })}>
          <ListItem.Content>
          <ListItem.Title style={{ color: 'black' }}>{item.address}</ListItem.Title>
          </ListItem.Content>
          <ListItem onLongPress={() => deleteItem(item.id)} containerStyle={{borderWidth: 2, borderColor: 'red'}}></ListItem>
          </ListItem>
        )}
      />
    </View>
  );};