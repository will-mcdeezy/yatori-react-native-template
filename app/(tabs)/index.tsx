import { StyleSheet, TouchableOpacity } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useBackpackConnection } from "@/hooks/useBackpackConnection";
import { Link } from "expo-router";

export default function HomeScreen() {
  const connectToBackpack = useBackpackConnection;

  const handleConnectWallet = async () => {
    try {
      await connectToBackpack();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

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
        <ThemedText type="subtitle">🔗 Connect Your Wallet</ThemedText>
        <ThemedText>
          Connect to <ThemedText type="defaultSemiBold">Solflare</ThemedText> or{" "}
          <ThemedText type="defaultSemiBold">Backpack</ThemedText> to start
          using your Solana dApp.
        </ThemedText>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={handleConnectWallet}
        >
          <ThemedText style={styles.buttonText}>Connect Backpack</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">💰 Token Operations</ThemedText>
        <ThemedText>
          Send and receive <ThemedText type="defaultSemiBold">USDC</ThemedText>,{" "}
          <ThemedText type="defaultSemiBold">USDT</ThemedText>, and{" "}
          <ThemedText type="defaultSemiBold">BONK</ThemedText> tokens with ease.
        </ThemedText>
        <ThemedView style={styles.tokenGrid}>
          <ThemedView style={styles.tokenCard}>
            <ThemedText type="defaultSemiBold">USDC</ThemedText>
            <ThemedText style={styles.tokenBalance}>$0.00</ThemedText>
          </ThemedView>
          <ThemedView style={styles.tokenCard}>
            <ThemedText type="defaultSemiBold">USDT</ThemedText>
            <ThemedText style={styles.tokenBalance}>$0.00</ThemedText>
          </ThemedView>
          <ThemedView style={styles.tokenCard}>
            <ThemedText type="defaultSemiBold">BONK</ThemedText>
            <ThemedText style={styles.tokenBalance}>0</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">🌐 Explore Features</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction
              title="View Transactions"
              icon="list.bullet"
              onPress={() => console.log("View transactions")}
            />
            <Link.MenuAction
              title="Token Swap"
              icon="arrow.triangle.2.circlepath"
              onPress={() => console.log("Token swap")}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Settings"
                icon="gear"
                onPress={() => console.log("Settings")}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to discover all the Solana dApp features and Yatori API integrations.`}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">⚡ Yatori API Integration</ThemedText>
        <ThemedText>
          Access comprehensive Solana data through Yatori&apos;s powerful API.
          Get real-time token prices, transaction history, and blockchain
          analytics.
        </ThemedText>
        <TouchableOpacity style={styles.apiButton}>
          <ThemedText style={styles.buttonText}>
            Explore API Features
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
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
  apiButton: {
    backgroundColor: "#14F195",
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
  tokenBalance: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
});
