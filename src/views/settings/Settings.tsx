import type { Screen } from "@/router/helpers/types";
import React, { useEffect, useLayoutEffect, useState } from "react";

import {Alert, Image, Platform, Text, View} from "react-native";

import { useAccounts, useCurrentAccount } from "@/stores/account";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import AppJSON from "../../../app.json";

import Reanimated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue
} from "react-native-reanimated";

import {
  Bell,
  Cable,
  HandCoins,
  Info,
  Laptop,
  LogOut,
  Palette,
  Paperclip,
  Puzzle,
  Route,
  Settings as SettingsLucide,
  Sparkles,
  SwatchBook,
  WandSparkles
} from "lucide-react-native";

import { NativeIcon, NativeItem, NativeList, NativeListHeader, NativeText } from "@/components/Global/NativeComponents";
import ModalHandle from "@/components/Modals/ModalHandle";
import AccountContainerCard from "@/components/Settings/AccountContainerCard";
import { useTheme } from "@react-navigation/native";
import {get_settings_widgets} from "@/addons/addons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AddonPlacementManifest} from "@/addons/types";

const Settings: Screen<"Settings"> = ({ route, navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const account = useCurrentAccount(store => store.account!);
  const [ addons, setAddons ] = useState<Array<AddonPlacementManifest>>([]);
  const [devModeEnabled, setDevModeEnabled] = useState(false);

  const removeAccount = useAccounts((store) => store.remove);

  useEffect(() => {
    AsyncStorage.getItem("devmode")
      .then((res) => {
        let value = {enabled: false};
        if (res)
          value = JSON.parse(res);
        setDevModeEnabled(value.enabled);
      });
  }, []);

  useEffect(() => {
    if(route.params?.view) {
      navigation.navigate(route.params.view);
    }
  }, [route.params]);

  useEffect(() => {
    // on focus
    const unsubscribe = navigation.addListener("focus", async () => {
      setTimeout(() => {
        get_settings_widgets().then((addons) => {
          setAddons(addons);
        });
      }, 1);
    });

    return unsubscribe;
  }, []);

  const tabs = [
    {
      icon: <SettingsLucide />,
      label: "Général",
      tabs: [
        {
          icon: <Bell />,
          color: "#CF0029",
          label: "Notifications",
          onPress: () => navigation.navigate("SettingsNotifications"),
        },
        {
          icon: <Cable />,
          color: "#D79400",
          label: "Services externes",
          onPress: () => navigation.navigate("SettingsExternalServices"),
        },
      ],
    },
    {
      icon: <Palette />,
      label: "Personnalisation",
      tabs: [
        {
          icon: <SwatchBook />,
          color: "#5C9441",
          label: "Matières",
          onPress: () => navigation.navigate("SettingsSubjects"),
        },
        {
          icon: <Sparkles />,
          color: "#295787",
          label: "Icône de l'application",
          onPress: () => navigation.navigate("SettingsIcons"),
          android: false,
        },
        {
          icon: <Palette />,
          color: "#3B117E",
          label: "Thème de couleur",
          onPress: async () => {
            if (Platform.OS === "ios") {
              navigation.goBack();
            }
            setTimeout(() => {
              navigation.navigate("ColorSelector", { settings: true });
            }, 10);
          }
        },
      ],
    },
    {
      icon: <Laptop />,
      label: "Avancé",
      tabs: [
        {
          icon: <Route />,
          color: "#7E1174",
          label: "Onglets & Navigation",
          onPress: async () => {
            if (Platform.OS === "ios") {
              navigation.goBack();
            }
            setTimeout(() => {
              navigation.navigate("SettingsTabs");
            }, 10);
          },
        },
        {
          icon: <Puzzle />,
          color: "#bf547d",
          label: "Extensions",
          description: "Disponible prochainement",
          onPress: () => navigation.navigate("SettingsAddons"),
          disabled: true,
        },
        {
          icon: <WandSparkles />,
          color: "#58A3C3",
          label: "Papillon Magic",
          onPress: () => navigation.navigate("SettingsMagic"),
        }
      ],
    },
    {
      icon: <Laptop />,
      label: "Projet Papillon",
      tabs: [
        {
          icon: <HandCoins />,
          color: "#CBA024",
          label: "Soutenir Papillon",
          onPress: () => {},
          disabled: true,
        },
        {
          icon: <Info />,
          color: "#888888",
          label: "À propos de Papillon",
          onPress: () => navigation.navigate("SettingsAbout"),
        },
      ],
    },
    {
      tabs: [
        {
          icon: <LogOut />,
          color: "#CF0029",
          label: "Se déconnecter",
          onPress: () => {
            Alert.alert("Se déconnecter", "Êtes-vous sûr de vouloir vous déconnecter ?", [
              {
                text: "Annuler",
                style: "cancel",
              },
              {
                text: "Se déconnecter",
                style: "destructive",
                onPress: () => {
                  removeAccount(account.localID);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "AccountSelector" }],
                  });
                },
              },
            ]);
          },
        },
      ]
    }
  ];

  const translationY = useSharedValue(0);
  const [scrolled, setScrolled] = useState(false);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
    const yOffset = event.contentOffset.y;

    runOnJS(setScrolled)(yOffset > 30);
  });

  // show header on Android
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Platform.OS === "android",
    });
  });

  return (
    <>
      {!scrolled && Platform.OS === "ios" &&
        <Reanimated.View
          exiting={FadeOut.duration(100)}
          entering={FadeIn.duration(100)}
          style={{
            zIndex: 1000,
          }}
        >
          <ModalHandle theme={theme} />
        </Reanimated.View>
      }

      <Reanimated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 48 : 16,
          paddingHorizontal: 16,
          paddingBottom: Platform.OS === "ios" ? 16 : insets.bottom + 16,
        }}
      >
        <AccountContainerCard
          account={account}
          onPress={() => navigation.navigate("SettingsProfile")}
        />
        {addons.length > 0 &&
            <>
              <NativeListHeader label={"Extensions"}/>
              <NativeList>
                {addons.map((addon, index) => (
                  <NativeItem
                    key={index}
                    onPress={() => navigation.navigate("AddonSettingsPage", { addon, from: "Settings" })}
                    leading={
                      <Image
                        source={addon.manifest.icon == "" ? require("../../../assets/images/addon_default_logo.png"): {uri: addon.manifest.icon}}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          borderWidth: 1,
                          borderColor: "#00000015",
                          marginLeft: -6,
                        }}
                      />
                    }
                  >
                    <NativeText variant="title" numberOfLines={1}>
                      {addon.manifest.name}
                    </NativeText>
                  </NativeItem>
                ))}
              </NativeList>
            </>
        }
        {tabs.map((tab, index) => (
          <View key={index}>
            {tab.label &&
          <NativeListHeader
            key={index}
            label={tab.label}
          />
            }
            <NativeList>
              {tab.tabs.map((subtab, index) => (
                (Platform.OS === "android" && subtab.android === false) ? <View key={index}/> :
                  <NativeItem
                    key={index}
                    onPress={subtab.onPress}
                    disabled={subtab.disabled}
                    leading={
                      <NativeIcon
                        icon={subtab.icon}
                        color={subtab.color}
                        style={{
                          marginLeft: -6,
                        }}
                      />
                    }
                  >
                    <NativeText variant="title">
                      {subtab.label}
                    </NativeText>
                    {subtab.description &&
                      <NativeText variant="subtitle" style={{marginTop: -3}}>
                        {subtab.description}
                      </NativeText>
                    }
                  </NativeItem>
              ))}
            </NativeList>
          </View>
        ))}

        {devModeEnabled == true && (
          <View>
            <NativeListHeader label={"Développeur"}/>
            <NativeList>
              <NativeItem
                onPress={() => navigation.navigate("SettingsDevLogs")}
                leading={
                  <NativeIcon
                    icon={<Paperclip/>}
                    color={"#000"}
                    style={{
                      marginLeft: -6,
                    }}
                  />
                }
              >
                <NativeText variant="title">
                  Logs
                </NativeText>
              </NativeItem>
            </NativeList>
          </View>
        )}

        <Text
          style={{
            color: colors.text + "60",
            fontFamily: "medium",
            fontSize: 12.5,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          version {AppJSON.expo.version} {"\n"}
          fabriqué avec ❤️ par l'équipe Papillon
        </Text>
      </Reanimated.ScrollView>
    </>
  );
};

export default Settings;