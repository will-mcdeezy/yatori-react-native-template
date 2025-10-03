import { StyleSheet, TouchableOpacity } from "react-native";

import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#14F195", dark: "#0F0F23" }}
      headerImage={
        <ThemedView style={styles.headerContent}>
          <IconSymbol
            size={80}
            color="#FFFFFF"
            name="bitcoinsign.circle.fill"
            style={styles.headerIcon}
          />
          <ThemedText type="title" style={styles.headerTitle}>
            Solana Features
          </ThemedText>
        </ThemedView>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Explore Solana dApp
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Discover the powerful features of your Solana dApp with Yatori
        integration.
      </ThemedText>
      <Collapsible title="🔗 Wallet Integration">
        <ThemedText>
          Connect to <ThemedText type="defaultSemiBold">Solflare</ThemedText>{" "}
          and <ThemedText type="defaultSemiBold">Backpack</ThemedText> wallets
          seamlessly. The template includes pre-configured wallet connection
          components.
        </ThemedText>
        <TouchableOpacity style={styles.featureButton}>
          <ThemedText style={styles.buttonText}>Connect Solflare</ThemedText>
        </TouchableOpacity>
        <ExternalLink href="https://docs.solflare.com/">
          <ThemedText type="link">Solflare Documentation</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="💰 Token Operations">
        <ThemedText>
          Built-in support for{" "}
          <ThemedText type="defaultSemiBold">USDC</ThemedText>,{" "}
          <ThemedText type="defaultSemiBold">USDT</ThemedText>, and{" "}
          <ThemedText type="defaultSemiBold">BONK</ThemedText> tokens. Send,
          receive, and swap tokens with ease.
        </ThemedText>
        <ThemedView style={styles.tokenList}>
          <ThemedView style={styles.tokenItem}>
            <ThemedText type="defaultSemiBold">USDC</ThemedText>
            <ThemedText style={styles.tokenAddress}>
              EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.tokenItem}>
            <ThemedText type="defaultSemiBold">USDT</ThemedText>
            <ThemedText style={styles.tokenAddress}>
              Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.tokenItem}>
            <ThemedText type="defaultSemiBold">BONK</ThemedText>
            <ThemedText style={styles.tokenAddress}>
              DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ExternalLink href="https://docs.solana.com/developing/programming-model/overview">
          <ThemedText type="link">Solana Token Program</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="🌐 Yatori API Integration">
        <ThemedText>
          Access comprehensive Solana data through Yatori&apos;s powerful API.
          Get real-time prices, transaction history, and blockchain analytics.
        </ThemedText>
        <ThemedView style={styles.apiFeatures}>
          <ThemedText type="defaultSemiBold">Available Endpoints:</ThemedText>
          <ThemedText>• Token prices and market data</ThemedText>
          <ThemedText>• Transaction history and analytics</ThemedText>
          <ThemedText>• Wallet balance tracking</ThemedText>
          <ThemedText>• DeFi protocol integrations</ThemedText>
        </ThemedView>
        <TouchableOpacity style={styles.apiButton}>
          <ThemedText style={styles.buttonText}>Test API Connection</ThemedText>
        </TouchableOpacity>
        <ExternalLink href="https://docs.yatori.com/">
          <ThemedText type="link">Yatori API Documentation</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="📱 Cross-Platform Support">
        <ThemedText>
          Your Solana dApp works seamlessly on{" "}
          <ThemedText type="defaultSemiBold">iOS</ThemedText>,{" "}
          <ThemedText type="defaultSemiBold">Android</ThemedText>, and{" "}
          <ThemedText type="defaultSemiBold">Web</ThemedText>. Built with Expo
          for maximum compatibility.
        </ThemedText>
        <ThemedView style={styles.platformGrid}>
          <ThemedView style={styles.platformCard}>
            <IconSymbol name="iphone" size={32} color="#007AFF" />
            <ThemedText type="defaultSemiBold">iOS</ThemedText>
          </ThemedView>
          <ThemedView style={styles.platformCard}>
            <IconSymbol name="desktopcomputer" size={32} color="#3DDC84" />
            <ThemedText type="defaultSemiBold">Android</ThemedText>
          </ThemedView>
          <ThemedView style={styles.platformCard}>
            <IconSymbol name="globe" size={32} color="#FF6B6B" />
            <ThemedText type="defaultSemiBold">Web</ThemedText>
          </ThemedView>
        </ThemedView>
      </Collapsible>

      <Collapsible title="🎨 Modern UI Components">
        <ThemedText>
          Beautiful, responsive design with{" "}
          <ThemedText type="defaultSemiBold">dark/light mode</ThemedText>{" "}
          support. Themed components automatically adapt to user preferences.
        </ThemedText>
        <ThemedView style={styles.uiFeatures}>
          <ThemedText>• Solana-themed color palette</ThemedText>
          <ThemedText>• Responsive token cards</ThemedText>
          <ThemedText>• Animated transitions</ThemedText>
          <ThemedText>• Accessibility support</ThemedText>
        </ThemedView>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn about theming</ThemedText>
        </ExternalLink>
      </Collapsible>
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
  headerIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  featureButton: {
    backgroundColor: "#9945FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  apiButton: {
    backgroundColor: "#14F195",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  tokenList: {
    marginTop: 12,
    gap: 8,
  },
  tokenItem: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tokenAddress: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    fontFamily: Fonts.mono,
  },
  apiFeatures: {
    marginTop: 12,
    gap: 4,
  },
  platformGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  platformCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  uiFeatures: {
    marginTop: 12,
    gap: 4,
  },
});
