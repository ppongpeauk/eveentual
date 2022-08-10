/*
  @author Pete Pongpeauk (ppongpeauk) <pete@restrafes.co>
*/

// core imports
import React, { useContext } from 'react';
import { db } from '../firebase';
import { ref, set, get, onValue } from 'firebase/database';

const StoreContext = React.createContext();
export function useStore() {
  return useContext(StoreContext);
}
export function StoreProvider({ children }) {
  async function joinParty(partyId, info) {
    // check if the party is full
    let party = await get(ref(db, `/parties/${partyId}`)).then(snapshot => {
      return snapshot.val();
    });
    if (party.partyMaxSize <= Object.keys(party.partyMembers).length) {
      return 'full';
    }
    // check if the user is already in the party
    let userAlreadyExists = false;
    Object.keys(party.partyMembers).forEach(member => {
      if (member.toLowerCase() === info.name.toLowerCase()) {
        userAlreadyExists = true;
      }
    });
    if (userAlreadyExists)
      return 'already in party';


    set(ref(db, `parties/${partyId}/partyMembers/${info.name}`), info);
    return 'success';
  }
  // main generate party function stack
  async function generateRandomIdentifier() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  async function generateParty(info) {
    /*
      info = {
        partyName: '',
        partyDate: '',
        partyTime: '',
        partyLocation: '',
        partyDescription: '',
        partyCreator: '',
        partyMaxSize: '',
        partyMembers: {},
      }
    */
    const randomId = await generateRandomIdentifier();
    // create a new party in the database
    let success = false;
    await set(ref(db, `parties/${randomId}`), info).then(() => {
      success = true;
    }).catch(error => {
      console.log(error);
    });
    if (success)
      return randomId;
    else
      return false;
  };

  // main party read stack
  async function getParty(info) {
    /*
      info = {
        partyId: '',
      }
    */
    let party = null;
    await get(ref(db, `parties/${info.partyId}`)).then(async (snapshot) => {
      if (await snapshot.exists()) {
        party = snapshot.val();
        // return snapshot.val();
      } else {
        return false;
      }
    }).catch((error) => {
      console.log(error);
      return false;
    });
    return party;
  }
  const store = {
    generateRandomIdentifier,
    generateParty,
    getParty,
    joinParty,
  };
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}