import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { getRandomBytes } from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, TouchableOpacity } from "react-native";
import nacl from "tweetnacl";

// Developer Note: This is where you should save the wallet connection state
// to your preferred state management solution (Redux, Zustand, Context, etc.)
// This data will be used for future transaction payloads and wallet operations

interface WalletConnectionData {
  publicKey: string;
  connectedAt: number;
  walletType: "backpack";
  session: string;
  backpackPubKey: string;
  // Add other relevant connection data here
}

// Decrypt payload function for Backpack connection
const decryptPayload = (
  data: string,
  nonce: string,
  sharedSecret?: Uint8Array
) => {
  if (!sharedSecret) {
    throw new Error("missing shared secret");
  }
  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );
  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};

// Derive shared secret function
export const derivedShared = (walletPubKey: string, scala: string) => {
  const localSecret = bs58.decode(scala);

  const sharedSecretDapp = nacl.box.before(
    bs58.decode(walletPubKey),
    localSecret
  );

  return sharedSecretDapp;
};

// Encrypt payload function
export const encryptPayload = async (
  payload: any,
  sharedSecret?: Uint8Array
) => {
  if (!sharedSecret) {
    return;
  }
  const nonce = new Uint8Array(await getRandomBytes(32));
  Alert.alert("Nonce:", nonce.toString());
  const encryptedPayload = nacl.box.after(
    //@ts-ignore
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );
  return {
    nonce: nonce,
    encryptedPayload: encryptedPayload,
  };
};

export default function OnConnectBackpack() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [connectionData, setConnectionData] =
    useState<WalletConnectionData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Prevent multiple executions
    if (isProcessing) return;

    // Check if we already have connection data
    if (connectionData) return;
    console.log("Backpack connection response:", params);
    console.log("All params received:", JSON.stringify(params, null, 2));

    try {
      setIsProcessing(true);

      // Extract Backpack connection data from URL parameters
      const backpackPubKey = params.wallet_encryption_public_key as string;
      const data = params.data as string;
      const nonce = params.nonce as string;

      console.log("Extracted backpackPubKey:", backpackPubKey);
      console.log("Extracted data:", data);
      console.log("Extracted nonce:", nonce);

      if (backpackPubKey && data && nonce) {
        // Get the stored secret key from the connection process
        AsyncStorage.getItem("backpack_secret_key")
          .then((storedSecretKey) => {
            if (!storedSecretKey) {
              throw new Error(
                "No secret key found. Connection may have failed."
              );
            }

            // Derive shared secret
            const sharedSecretDapp = derivedShared(
              backpackPubKey,
              storedSecretKey
            );
            console.log("Shared secret derived");

            // Decrypt the connection data
            const connectData = decryptPayload(data, nonce, sharedSecretDapp);
            console.log("Decrypted connection data:", connectData);
            console.log("Session from decrypted data:", connectData.session);
            console.log("Session type:", typeof connectData.session);

            // Create connection data object
            const walletData: WalletConnectionData = {
              publicKey: connectData.public_key,
              connectedAt: Date.now(),
              walletType: "backpack",
              session: connectData.session,
              backpackPubKey: backpackPubKey,
            };

            // Save to AsyncStorage for persistence across app sessions
            // TODO: Replace this with your preferred state management solution
            AsyncStorage.setItem(
              "wallet_connection_data",
              JSON.stringify(walletData)
            )
              .then(() => {
                // Also save the wallet encryption public key separately for easy access
                return AsyncStorage.setItem(
                  "wallet_encryption_public_key",
                  backpackPubKey
                );
              })
              .then(() => {
                console.log("Wallet connection data saved:", walletData);
                console.log(
                  "Wallet encryption public key saved:",
                  backpackPubKey
                );
                setConnectionData(walletData);
                setShowModal(true);
              })
              .catch((error) => {
                console.error("Failed to save wallet data:", error);
                Alert.alert("Error", "Failed to save wallet connection data");
              });
          })
          .catch((error) => {
            console.error("Failed to process connection:", error);
            Alert.alert("Connection Failed", error.message);
            setIsProcessing(false);
            router.replace("/(tabs)");
          });
      } else {
        Alert.alert(
          "Connection Failed",
          "Missing required connection parameters from Backpack"
        );
        setIsProcessing(false);
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Connection processing error:", error);
      Alert.alert("Connection Failed", "Failed to process Backpack connection");
      setIsProcessing(false);
      router.replace("/(tabs)");
    }
  }, [params, router, isProcessing, connectionData]);

  const handleCloseModal = () => {
    setShowModal(false);
    router.replace("/(tabs)");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Processing Backpack Connection...</ThemedText>
      <ThemedText>Please wait...</ThemedText>

      {/* Connection State Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>
            ✅ Wallet Connected Successfully!
          </ThemedText>

          <ThemedView style={styles.connectionInfo}>
            <ThemedText type="subtitle">Connection Details:</ThemedText>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.titleText}>Wallet Type:</ThemedText>
              <ThemedText style={styles.infoText}>
                {connectionData?.walletType.toUpperCase()}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.titleText}>Address:</ThemedText>
              <ThemedText style={styles.infoText}>
                {connectionData?.publicKey || "Unknown"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.titleText}>Connected At:</ThemedText>
              <ThemedText style={styles.infoText}>
                {connectionData?.connectedAt
                  ? new Date(connectionData.connectedAt).toLocaleString()
                  : "Unknown"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.titleText}>Status:</ThemedText>
              <ThemedText style={styles.infoText}>🟢 CONNECTED</ThemedText>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <ThemedText style={styles.buttonText}>Continue to App</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#14F195",
  },
  connectionInfo: {
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoRow: {
    flexDirection: "column",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  titleText: {
    color: "#D1D5DB",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  infoText: {
    color: "#14F195",
    fontSize: 14,
    fontFamily: "monospace",
  },
  closeButton: {
    backgroundColor: "#9945FF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#9945FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
