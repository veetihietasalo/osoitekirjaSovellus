import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Input, ListItem} from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import { createTable, insertAddress, fetchAddresses, deleteAddress } from './db';

const db = SQLite.openDatabase('addresses.db');

export default function Places({ navigation }) {
  const [address, setAddress] = useState('');
  const [addresses, setAddresses] = useState([]);

  // Create the table on a fresh install, then show what's already saved.
  useEffect(() => {
    createTable(db)
      .then(updateList)
      .catch(error => console.log("Could not create the addresses table:", error));
  }, []);

  const saveAddress = async () => {
    try {
      await insertAddress(db, address);
      updateList();
    } catch (error) {
      console.log("Database operation failed:", error);
    }
  };


  const updateList = () => {
    fetchAddresses(db, setAddresses);
  };

  const deleteItem = (id) => {
    deleteAddress(db, id, () => updateList());
  };
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