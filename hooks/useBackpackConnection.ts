import AsyncStorage from '@react-native-async-storage/async-storage';
import bs58 from 'bs58';
import { getRandomBytes } from 'expo-crypto';
import * as Linking from 'expo-linking';
import nacl from 'tweetnacl';


export const useBackpackConnection = async () => {
    try {
        // Generate per-connection DH secret using React Native compatible method
        const scalar = new Uint8Array(await getRandomBytes(32));
        const encodedScalar = bs58.encode(scalar);
        const keypair = nacl.box.keyPair.fromSecretKey(scalar);
        const pubkey = bs58.encode(keypair.publicKey);

        // Store the secret key for later decryption
        await AsyncStorage.setItem('backpack_secret_key', encodedScalar);



        // Create connection URL
        const params = new URLSearchParams({
            dapp_encryption_public_key: pubkey,
            cluster: 'mainnet-beta',
            app_url: 'exp://localhost:8081',
            redirect_link: 'exp://localhost:8081/--/onConnectBackpack',
        });

        const backpackUrl = `https://backpack.app/ul/v1/connect?${String(params)}`;

        // Open Backpack app directly
        await Linking.openURL(backpackUrl);



    } catch (error) {
        console.error('Failed to connect to Backpack:', error);
    }
};
