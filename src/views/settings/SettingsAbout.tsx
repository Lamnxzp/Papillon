import React, { useEffect } from "react";
import { Text, ScrollView, View, TouchableOpacity, StyleSheet, Image, Switch } from "react-native";
import type { Screen } from "@/router/helpers/types";
import { useTheme } from "@react-navigation/native";
import { ChevronLeft, Euro, MegaphoneOff, MessageCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeList, NativeItem, NativeListHeader } from "@/components/Global/NativeComponents";
import { NativeIcon } from "@/components/Global/NativeComponents";
import { NativeText } from "@/components/Global/NativeComponents";
import { LinearGradient } from "expo-linear-gradient";
import AppJSON from "../../../app.json";
import PackageJSON from "../../../package.json";
import AboutContainerCard from "@/components/Settings/AboutContainerCard";
import * as Linking from "expo-linking";
import teams from "@/utils/data/teams.json";
import Constants from "expo-constants";

const SettingsAbout: Screen<"SettingsAbout"> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  const [clickedOnVersion, setClickedOnVersion] = React.useState<number>(0);

  useEffect(() => {
    if (clickedOnVersion == 7) {
      navigation.navigate("SettingsFlags");
      setClickedOnVersion(0);
    }
  }, [clickedOnVersion]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingTop: 0,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <AboutContainerCard
        theme={theme}
      />

      <NativeListHeader
        label="Communauté"
      />

      <NativeList>
        <NativeItem
          onPress={() => navigation.navigate("SettingsDonorsList")}
          leading={<NativeIcon icon={<Euro />} color="#DEAB4A" />}
        >
          <NativeText variant="title">Donateurs</NativeText>
          <NativeText variant="subtitle">Voir la liste des donateurs</NativeText>
        </NativeItem>
        <NativeItem
          onPress={() => Linking.openURL("https://discord.gg/KjhVvMgTeJ")}
          leading={<NativeIcon icon={<MessageCircle />} color="#5865F2" />}
        >
          <NativeText variant="title">Serveur Discord</NativeText>
          <NativeText variant="subtitle">Rejoindre le serveur Discord</NativeText>
        </NativeItem>
      </NativeList>

      <NativeListHeader
        label="L'équipe Papillon"
      />
      <NativeList
      >
        {teams.map((team, index) => (
          <NativeItem
            onPress={team.link ? () => Linking.openURL(team.link) : undefined}
            chevron={team.link ? true : false}
            key={index}
            leading={<Image
              source={{ uri: team.ppimage }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 10,
              }}
            />}
          >
            <NativeText variant="title">{team.name}</NativeText>
            <NativeText variant="subtitle">{team.description}</NativeText>
          </NativeItem>
        ))}
      </NativeList>

      <NativeListHeader
        label="Informations"
      />

      <NativeList>
        <NativeItem
          onPress={() => setClickedOnVersion(clickedOnVersion + 1)}
          chevron={false}
        >
          <NativeText variant="title">
            Version de l'application
          </NativeText>
          <NativeText variant="subtitle">
            ver. {AppJSON.expo.version} {Constants.appOwnership === "expo" ? "(Expo Go)" : ""} {__DEV__ ? "(debug)" : ""}
          </NativeText>
        </NativeItem>
        <NativeItem>
          <NativeText variant="title">
            Version des dépendances
          </NativeText>
          <NativeText variant="subtitle">
            RN : {PackageJSON.dependencies["react-native"].split("^")[1]} | Expo : {PackageJSON.dependencies.expo.split("^")[1]}
          </NativeText>
        </NativeItem>
      </NativeList>

    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  title: {
    color: "#222222",
    fontSize: 15,
  },
  time: {
    color: "#3F3F3F",
    opacity: 0.5,
    textAlign: "right",
    fontFamily: "sfmedium",
    fontSize: 13,
    marginRight: 10,
  },
  message: {
    color: "#3F3F3F",
    fontFamily: "sfmedium",
    fontSize: 14,
    maxWidth: "85%",
    minWidth: "85%",
    lineHeight: 15,
    letterSpacing: -0.4,
  },

  overlay: {
    backgroundColor: "#EEF5F5",
    borderWidth: 1,
    borderColor: "#00000030",
    borderRadius: 20,
    height: 25,
    padding: 9,
    marginHorizontal: 20,
  },
});

export default SettingsAbout;