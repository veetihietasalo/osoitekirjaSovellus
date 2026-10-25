// Web version of db.js. expo-sqlite has no web support in SDK 49, so on the web the addresses
// live in this browser's localStorage. Same functions and arguments as db.js, so Places.js
// works unchanged.
const KEY = 'osoitekirja.addresses';

const read = () => {
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

const write = (rows) => window.localStorage.setItem(KEY, JSON.stringify(rows));

export const openDatabase = () => ({ storage: 'localStorage', key: KEY });

export const createTable = () => Promise.resolve();

export const insertAddress = (db, address) => new Promise((resolve, reject) => {
  try {
    const rows = read();
    const id = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
    rows.push({ id, address });
    write(rows);
    resolve({ insertId: id, rowsAffected: 1 });
  } catch (error) {
    reject(error);
  }
});

export const fetchAddresses = (db, setter) => {
  setter(read());
};

export const deleteAddress = (db, id, callback) => {
  try {
    write(read().filter((row) => row.id !== id));
  } catch (error) {
    console.error('Could not delete the address:', error);
  }
  if (callback) callback();
};
