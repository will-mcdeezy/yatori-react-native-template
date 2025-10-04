import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface TokenInfo {
  name: string;
  symbol: string;
  mintAddress: string;
  description: string;
}

const tokens: TokenInfo[] = [
  {
    name: "USD Coin",
    symbol: "USDC",
    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    description: "USD Coin is a fully collateralized US dollar stablecoin",
  },
  {
    name: "PayPal USD",
    symbol: "PYUSD",
    mintAddress: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
    description: "PayPal's USD stablecoin",
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    mintAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    description: "Tether USD stablecoin",
  },
  {
    name: "Bonk",
    symbol: "BONK",
    mintAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    description: "Bonk token on Solana",
  },
  {
    name: "Crown",
    symbol: "CROWN",
    mintAddress: "GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG",
    description: "Crown token on Solana",
  },
  {
    name: "Solana",
    symbol: "SOL",
    mintAddress: "So11111111111111111111111111111111111111112",
    description: "Native Solana token",
  },
];

export default function ExploreScreen() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (address: string, tokenName: string) => {
    try {
      await Clipboard.setString(address);
      setCopiedAddress(address);
      Alert.alert("Copied!", `${tokenName} mint address copied to clipboard`);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
      Alert.alert("Error", "Failed to copy address to clipboard");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#000000",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#FFFFFF",
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 24,
      color: "#E0E0E0",
      opacity: 0.7,
    },
    tokenCard: {
      backgroundColor: "#1A1A1A",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#333333",
    },
    tokenHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    tokenName: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    tokenSymbol: {
      fontSize: 14,
      fontWeight: "500",
      color: "#9945FF",
      backgroundColor: "#333333",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    tokenDescription: {
      fontSize: 14,
      color: "#E0E0E0",
      opacity: 0.7,
      marginBottom: 12,
    },
    mintAddressContainer: {
      backgroundColor: "#333333",
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    mintAddressLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: "#E0E0E0",
      opacity: 0.6,
      marginBottom: 4,
    },
    mintAddress: {
      fontSize: 12,
      fontFamily: "monospace",
      color: "#FFFFFF",
      lineHeight: 16,
    },
    copyButton: {
      backgroundColor: "#9945FF",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
    },
    copyButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: 14,
    },
    copiedButton: {
      backgroundColor: "#10B981",
    },
    copiedButtonText: {
      color: "#FFFFFF",
    },
  });

  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.title}>🌙 Token Mint Addresses</ThemedText>
      <ThemedText style={styles.subtitle}>
        Copy mint addresses for Solana tokens. Tap any address to copy it to
        your clipboard.
      </ThemedText>

      {tokens.map((token) => (
        <ThemedView key={token.symbol} style={styles.tokenCard}>
          <ThemedView style={styles.tokenHeader}>
            <ThemedText style={styles.tokenName}>{token.name}</ThemedText>
            <ThemedText style={styles.tokenSymbol}>{token.symbol}</ThemedText>
          </ThemedView>

          <ThemedText style={styles.tokenDescription}>
            {token.description}
          </ThemedText>

          <ThemedView style={styles.mintAddressContainer}>
            <ThemedText style={styles.mintAddressLabel}>
              Mint Address:
            </ThemedText>
            <ThemedText style={styles.mintAddress}>
              {token.mintAddress}
            </ThemedText>
          </ThemedView>

          <TouchableOpacity
            style={[
              styles.copyButton,
              copiedAddress === token.mintAddress && styles.copiedButton,
            ]}
            onPress={() => copyToClipboard(token.mintAddress, token.name)}
          >
            <ThemedText
              style={[
                styles.copyButtonText,
                copiedAddress === token.mintAddress && styles.copiedButtonText,
              ]}
            >
              {copiedAddress === token.mintAddress
                ? "✓ Copied!"
                : "Copy Address"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ))}
    </ScrollView>
  );
}
