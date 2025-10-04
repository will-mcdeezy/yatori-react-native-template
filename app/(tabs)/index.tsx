import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import nacl from "tweetnacl";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useBackpackConnection } from "@/hooks/useBackpackConnection";

interface WalletConnectionData {
  publicKey: string;
  connectedAt: number;
  walletType: "backpack";
  session: string;
  backpackPubKey: string;
}

// Derive shared secret function
const derivedShared = (walletPubKey: string, scala: string) => {
  const localSecret = bs58.decode(scala);
  const sharedSecretDapp = nacl.box.before(
    bs58.decode(walletPubKey),
    localSecret
  );
  return sharedSecretDapp;
};

// Get random bytes function
const getRandomBytes = (length: number): Promise<Uint8Array> => {
  return new Promise((resolve) => {
    const bytes = new Uint8Array(length);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    resolve(bytes);
  });
};

// Encrypt payload function
const encryptPayload = async (payload: any, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) {
    return;
  }
  const nonce = await getRandomBytes(24);
  console.log("Generated nonce:", nonce);

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

// Note: generateWalletKeypair removed - we use the saved wallet_encryption_public_key instead

// Note: navigateTo removed - using Expo Linking directly

// Get latest blockhash from Solana mainnet
const getLatestBlockhash = async () => {
  try {
    console.log("Fetching latest blockhash from Solana mainnet...");

    const response = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getLatestBlockhash",
        params: [
          {
            commitment: "confirmed",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Blockhash response:", data);

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    const blockhash = data.result.value.blockhash;
    console.log("Latest blockhash retrieved:", blockhash);
    return blockhash;
  } catch (error) {
    console.error("Failed to get latest blockhash:", error);
    throw error;
  }
};

export default function HomeScreen() {
  const connectToBackpack = useBackpackConnection;
  const [connectionData, setConnectionData] =
    useState<WalletConnectionData | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedToken, setSelectedToken] = useState<"USDC" | "PYUSD" | "USDT">(
    "USDC"
  );
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Check for existing connection data
    const checkConnection = async () => {
      try {
        const storedData = await AsyncStorage.getItem("wallet_connection_data");
        if (storedData) {
          const data = JSON.parse(storedData);
          setConnectionData(data);
          console.log("Found existing connection:", data);
        }
      } catch (error) {
        console.error("Failed to load connection data:", error);
      }
    };

    checkConnection();
  }, []);

  const handleConnectWallet = async () => {
    try {
      await connectToBackpack();
      // Connection data will be updated via the onConnectBackpack screen
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      // Clear all wallet-related data from AsyncStorage
      await AsyncStorage.multiRemove([
        "wallet_connection_data",
        "wallet_encryption_public_key",
        "backpack_secret_key",
      ]);

      // Reset all state
      setConnectionData(null);
      setShowSendModal(false);
      setRecipientAddress("");
      setIsTransferring(false);
      setSelectedToken("USDC");

      console.log("Wallet disconnected and all data cleared");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      Alert.alert("Error", "Failed to disconnect wallet");
    }
  };

  const handleSendUSDC = () => {
    console.log("handleSendUSDC called, connectionData:", connectionData);
    if (!connectionData) {
      Alert.alert("Error", "Please connect your wallet first");
      return;
    }
    setSelectedToken("USDC");
    setShowSendModal(true);
  };

  const handleSendPYUSD = () => {
    console.log("handleSendPYUSD called, connectionData:", connectionData);
    if (!connectionData) {
      Alert.alert("Error", "Please connect your wallet first");
      return;
    }
    setSelectedToken("PYUSD");
    setShowSendModal(true);
  };

  const handleSendUSDT = () => {
    console.log("handleSendUSDT called, connectionData:", connectionData);
    if (!connectionData) {
      Alert.alert("Error", "Please connect your wallet first");
      return;
    }
    setSelectedToken("USDT");
    setShowSendModal(true);
  };

  const handleTokenTransfer = async (tokenType: "USDC" | "PYUSD" | "USDT") => {
    console.log("handleUSDCTransfer called!");
    console.log("connectionData:", connectionData);
    console.log("recipientAddress:", recipientAddress);

    if (!connectionData?.publicKey) {
      Alert.alert("Error", "No wallet connected");
      return;
    }

    if (!recipientAddress.trim()) {
      Alert.alert("Error", "Please enter a recipient address");
      return;
    }

    console.log("Starting USDC transfer process...");
    setIsTransferring(true);

    try {
      console.log("Initiating USDC transfer...");

      // Define token configurations
      const tokenConfigs = {
        USDC: {
          mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          amount: "10000", // 1 cent USDC = 10,000 lamports
          name: "USDC",
        },
        PYUSD: {
          mintAddress: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
          amount: "10000", // 1 cent PYUSD = 10,000 lamports
          name: "PYUSD",
        },
        USDT: {
          mintAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          amount: "10000", // 1 cent USDT = 10,000 lamports
          name: "USDT",
        },
      };

      const tokenConfig = tokenConfigs[tokenType];
      const transferPayload = {
        from_address: connectionData.publicKey,
        to_address: recipientAddress.trim(),
        token_mint_address: tokenConfig.mintAddress,
        amount: tokenConfig.amount,
      };

      console.log("Transfer payload:", transferPayload);

      const response = await fetch("https://kouba.io/token-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const transactionData = await response.json();
      console.log("Transaction data received:", transactionData);

      // Process the transaction data
      const transaction = transactionData.data;
      console.log("Raw transaction data:", transaction);

      // Get latest blockhash
      const blockhash = await getLatestBlockhash();
      console.log("Retrieved blockhash:", blockhash);

      // Deserialize the transaction
      const deserializedTx = Transaction.from(transaction);
      console.log("Deserialized transaction:", deserializedTx);

      // Update the recent blockhash
      deserializedTx.recentBlockhash = blockhash;
      console.log("Updated transaction with blockhash");

      // Serialize the transaction
      const serializedTransaction = deserializedTx.serialize({
        requireAllSignatures: false,
      });
      console.log("Serialized transaction:", serializedTransaction);

      // Validate session before creating payload
      if (!connectionData.session) {
        throw new Error("No session found in connection data");
      }

      // Try using the session as-is first (most common case)
      const payload = {
        session: connectionData.session,
        // @ts-ignore
        transaction: bs58.encode(serializedTransaction),
        // Add additional fields that might be expected
      };
      console.log("Created payload:", payload);
      console.log("Session value:", connectionData.session);
      console.log("Session type:", typeof connectionData.session);
      console.log("Session length:", connectionData.session?.length);
      console.log("Full connection data:", connectionData);

      // Recreate the same dapp keypair that was used during connection
      const storedSecretKey = await AsyncStorage.getItem("backpack_secret_key");
      if (!storedSecretKey) {
        throw new Error("No secret key found for shared secret derivation");
      }

      const secretKeyBytes = bs58.decode(storedSecretKey);
      const dappKeyPair = nacl.box.keyPair.fromSecretKey(secretKeyBytes);
      console.log("Recreated dapp keypair from stored secret key");

      // Derive shared secret using the backpack public key and our secret key
      const sharedSecret = derivedShared(
        connectionData.backpackPubKey, // Use the backpack public key
        storedSecretKey // Use our stored secret key
      );
      console.log(
        "Derived shared secret using backpackPubKey and stored secret key"
      );
      console.log("Stored secret key length:", storedSecretKey.length);
      console.log("Shared secret derived:", sharedSecret);
      console.log("Shared secret length:", sharedSecret.length);

      // Encrypt the payload
      const encryptedResult = await encryptPayload(payload, sharedSecret);
      if (!encryptedResult) {
        Alert.alert("Error", "Failed to encrypt transaction payload");
        return;
      }
      console.log("Encrypted payload:", encryptedResult);

      // Get the redirect link from connection params (should be exp://...)
      const redirectLink = "exp://localhost:8081"; // Fallback to default expo URL
      console.log("Using redirect link:", redirectLink);

      // Create URL parameters for backpack wallet
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey), // Use the dapp keypair public key
        cluster: "mainnet-beta",
        nonce: bs58.encode(encryptedResult.nonce),
        redirect_link: redirectLink, // Use the exp:// redirect link from connection
        payload: bs58.encode(encryptedResult.encryptedPayload),
      });

      const backpackUrl = `https://backpack.app/ul/v1/signAndSendTransaction?${String(
        params
      )}`;
      console.log("Backpack URL:", backpackUrl);

      await Linking.openURL(backpackUrl);

      Alert.alert(
        "Redirecting to Backpack",
        "Opening Backpack wallet to sign and send the transaction...",
        [{ text: "OK" }]
      );

      // Close the modal and reset form
      setShowSendModal(false);
      setRecipientAddress("");
    } catch (error) {
      console.error("USDC transfer error:", error);
      Alert.alert(
        "Transfer Failed",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsTransferring(false);
    }
  };

  console.log("Current showSendModal state:", showSendModal);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#9945FF", dark: "#0F0F23" }}
      headerImage={
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Yatori
          </ThemedText>
          <ThemedText type="subtitle" style={styles.headerSubtitle}>
            Solana dApp Template
          </ThemedText>
        </ThemedView>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Yatori! 🚀</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🔗 Wallet Connection</ThemedText>
        {connectionData ? (
          <ThemedView>
            <ThemedText style={styles.connectedText}>
              ✅ Connected to {connectionData.walletType.toUpperCase()}
            </ThemedText>
            <ThemedText style={styles.addressText}>
              Address: {connectionData.publicKey}
            </ThemedText>
            <ThemedText style={styles.connectedAtText}>
              Connected: {new Date(connectionData.connectedAt).toLocaleString()}
            </ThemedText>
            <TouchableOpacity
              style={styles.reconnectButton}
              onPress={handleConnectWallet}
            >
              <ThemedText style={styles.reconnectButtonText}>
                Reconnect Wallet
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={handleDisconnectWallet}
            >
              <ThemedText style={styles.disconnectButtonText}>
                Disconnect Wallet
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <ThemedView>
            <ThemedText>
              Connect to{" "}
              <ThemedText type="defaultSemiBold">Solflare</ThemedText> or{" "}
              <ThemedText type="defaultSemiBold">Backpack</ThemedText> to start
              using your Solana dApp.
            </ThemedText>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnectWallet}
            >
              <ThemedText style={styles.buttonText}>
                Connect Backpack
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">💰 Token Operations</ThemedText>
        <ThemedText>
          Send and receive <ThemedText type="defaultSemiBold">USDC</ThemedText>,{" "}
          <ThemedText type="defaultSemiBold">PYUSD</ThemedText>,{" "}
          <ThemedText type="defaultSemiBold">USDT</ThemedText>,{" "}
          <ThemedText type="defaultSemiBold">BONK</ThemedText>,{" "}
          <ThemedText type="defaultSemiBold">CROWN</ThemedText>, and{" "}
          <ThemedText type="defaultSemiBold">SOL</ThemedText> tokens with ease.
        </ThemedText>
        <ThemedView style={styles.tokenGrid}>
          <ThemedView style={styles.tokenCard}>
            <ThemedText style={styles.tokenName}>USDC</ThemedText>
            <ThemedText style={styles.tokenBalance}>$0.00</ThemedText>
            {connectionData && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendUSDC}
              >
                <ThemedText style={styles.sendButtonText}>
                  Send $0.01
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
          <ThemedView style={styles.tokenCard}>
            <ThemedText style={styles.tokenName}>PYUSD</ThemedText>
            <ThemedText style={styles.tokenBalance}>$0.00</ThemedText>
            {connectionData && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendPYUSD}
              >
                <ThemedText style={styles.sendButtonText}>
                  Send $0.01
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
          <ThemedView style={styles.tokenCard}>
            <ThemedText style={styles.tokenName}>USDT</ThemedText>
            <ThemedText style={styles.tokenBalance}>$0.00</ThemedText>
            {connectionData && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendUSDT}
              >
                <ThemedText style={styles.sendButtonText}>
                  Send $0.01
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.tokenGrid}>
          <ThemedView style={[styles.tokenCard, styles.disabledTokenCard]}>
            <ThemedText style={[styles.tokenName, styles.disabledTokenName]}>
              BONK
            </ThemedText>
            <ThemedText
              style={[styles.tokenBalance, styles.disabledTokenBalance]}
            >
              0
            </ThemedText>
            <TouchableOpacity
              style={[styles.sendButton, styles.disabledButton]}
              disabled={true}
            >
              <ThemedText
                style={[styles.sendButtonText, styles.disabledButtonText]}
              >
                Coming Soon
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={[styles.tokenCard, styles.disabledTokenCard]}>
            <ThemedText style={[styles.tokenName, styles.disabledTokenName]}>
              CROWN
            </ThemedText>
            <ThemedText
              style={[styles.tokenBalance, styles.disabledTokenBalance]}
            >
              0
            </ThemedText>
            <TouchableOpacity
              style={[styles.sendButton, styles.disabledButton]}
              disabled={true}
            >
              <ThemedText
                style={[styles.sendButtonText, styles.disabledButtonText]}
              >
                Coming Soon
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={[styles.tokenCard, styles.disabledTokenCard]}>
            <ThemedText style={[styles.tokenName, styles.disabledTokenName]}>
              SOL
            </ThemedText>
            <ThemedText
              style={[styles.tokenBalance, styles.disabledTokenBalance]}
            >
              0
            </ThemedText>
            <TouchableOpacity
              style={[styles.sendButton, styles.disabledButton]}
              disabled={true}
            >
              <ThemedText
                style={[styles.sendButtonText, styles.disabledButtonText]}
              >
                Coming Soon
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">⚡ Yatori API Integration</ThemedText>
        <ThemedText>
          Access raw, unsigned Solana transaction data through Yatori&apos;s
          Arrow API.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          {`Tap to explore the complete Yatori API documentation and discover all Solana dApp features.`}
        </ThemedText>

        <TouchableOpacity
          style={styles.exploreButton}
          onPress={async () => {
            try {
              await Linking.openURL("https://yatori.io/docs");
            } catch (error) {
              console.error("Failed to open yatori.io/docs:", error);
              Alert.alert("Error", "Failed to open documentation");
            }
          }}
        >
          <ThemedText type="subtitle">🌐 Explore Features</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Send USDC Modal */}
      <Modal
        visible={showSendModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onShow={() => console.log("Modal is now visible")}
        onDismiss={() => console.log("Modal dismissed")}
      >
        <ThemedView style={styles.sendModalContainer}>
          <ThemedText type="title" style={styles.sendModalTitle}>
            Send $0.01 {selectedToken}
          </ThemedText>

          <ThemedView style={styles.sendModalContent}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>
                Recipient Address:
              </ThemedText>
              <TextInput
                ref={textInputRef}
                style={styles.addressInput}
                value={recipientAddress}
                onChangeText={setRecipientAddress}
                placeholder="Paste recipient's wallet address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                showSoftInputOnFocus={false}
                contextMenuHidden={false}
                selectTextOnFocus={true}
                editable={true}
                keyboardType="default"
                returnKeyType="done"
                blurOnSubmit={true}
                onFocus={(e) => {
                  // Allow focus for context menu, but prevent keyboard
                  console.log("TextInput focused");
                }}
                onTouchStart={() => {
                  // Ensure context menu is available
                  console.log("TextInput touched");
                }}
              />
            </ThemedView>

            <ThemedView style={styles.transferInfo}>
              <ThemedText style={styles.transferInfoText}>
                💰 Amount: $0.01 {selectedToken}
              </ThemedText>
              <ThemedText style={styles.transferInfoText}>
                🌐 Network: Solana Mainnet
              </ThemedText>
              <ThemedText style={styles.transferInfoText}>
                ⚡ Transaction will be signed in Backpack wallet
              </ThemedText>
            </ThemedView>

            <TouchableOpacity
              style={[
                styles.transferButton,
                isTransferring && styles.transferButtonDisabled,
              ]}
              onPress={() => {
                console.log("Transfer button pressed!");
                handleTokenTransfer(selectedToken);
              }}
              disabled={isTransferring}
            >
              <ThemedText style={styles.transferButtonText}>
                {isTransferring
                  ? "Processing..."
                  : `Send $0.01 ${selectedToken}`}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowSendModal(false);
              setRecipientAddress("");
            }}
          >
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#E0E0E0",
    textAlign: "center",
    marginTop: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 12,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: "#9945FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
  },
  exploreButton: {
    backgroundColor: "#9945FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  tokenGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  tokenCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tokenName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  tokenBalance: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  connectedText: {
    fontSize: 16,
    color: "#14F195",
    fontWeight: "600",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "monospace",
    marginBottom: 4,
  },
  connectedAtText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  reconnectButton: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  reconnectButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  disconnectButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  disconnectButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: "#14F195",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  sendModalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  sendModalTitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#14F195",
  },
  sendModalContent: {
    flex: 1,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#D1D5DB",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },
  addressInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: "monospace",
    color: "#1F2937",
    textAlignVertical: "top",
  },
  transferInfo: {
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  transferInfoText: {
    color: "#D1D5DB",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  transferButton: {
    backgroundColor: "#14F195",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#14F195",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  transferButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  transferButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledTokenCard: {
    opacity: 0.5,
    backgroundColor: "#F3F4F6",
  },
  disabledTokenName: {
    color: "#9CA3AF",
  },
  disabledTokenBalance: {
    color: "#D1D5DB",
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
});
