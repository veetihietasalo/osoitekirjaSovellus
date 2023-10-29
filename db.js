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
        console.log("Data fetched from DB:", rows._array);
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
  