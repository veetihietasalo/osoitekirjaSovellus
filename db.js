import * as SQLite from 'expo-sqlite';

// Phone: SQLite. The web build picks up db.web.js instead, since expo-sqlite has no web support in SDK 49.
export const openDatabase = () => SQLite.openDatabase('addresses.db');

export const createTable = (db) => new Promise((resolve, reject) => {
  db.transaction(
    tx => {
      tx.executeSql('create table if not exists addresses (id integer primary key not null, address text not null);');
    },
    reject,
    resolve
  );
});

export const insertAddress = (db, address) => new Promise((resolve, reject) => {
  db.transaction(
    tx => {
      tx.executeSql('insert into addresses (address) values (?)', [address], (_, result) => {
        resolve(result);
      },
      (_, error) => {
        reject(error);
      });
    }
  );
});
  
export const fetchAddresses = (db, setter) => {
  db.transaction(
    tx => {
      tx.executeSql('select * from addresses', [], (_, { rows }) => {
        setter(rows._array);
      });
    }
  );
};

  
  export const deleteAddress = (db, id, callback) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from addresses where id = ?;`, [id]);
      },
      null,
      callback
    );
  };
  