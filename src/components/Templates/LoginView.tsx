import React, { useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeItem, NativeList, NativeListHeader, NativeText } from "../Global/NativeComponents";
import { AlertTriangle, Eye, EyeOff, Info } from "lucide-react-native";
import { useTheme } from "@react-navigation/native";
import ButtonCta from "../FirstInstallation/ButtonCta";

export interface LoginViewCustomInput {
  identifier: string,
  title: string,
  placeholder?: string,
  secureTextEntry?: boolean,
  value?: string,
};

const LoginView: React.FC<{
  serviceIcon: any;
  serviceName: string;
  loading?: boolean;
  error?: string | null;
  onLogin: (username: string, password: string, customFields: Record<string, string>) => unknown
  customFields?: LoginViewCustomInput[];
}> = ({
  serviceIcon,
  serviceName,
  loading = false,
  error = null,
  onLogin,
  customFields = [],
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [customFieldsInputs, setCustomFields] = useState<LoginViewCustomInput[]>(customFields.map((field) => ({
    ...field,
    value: "",
  })));

  const [showPassword, setShowPassword] = useState(false);

  const actionLogin = async () => {
    const customFieldsDict = customFieldsInputs.reduce((acc, field) => {
      acc[field.identifier] = field.value;
      return acc;
    }, {} as Record<string, string>);

    onLogin(username, password, customFieldsDict);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={insets.top + 64}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        overflow: "visible",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          overflow: "visible",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 14,
            margin: 4,
          }}
        >
          <Image
            source={serviceIcon}
            style={{
              width: 42,
              height: 42,
              borderRadius: 80,
            }}
          />
          <View>
            <NativeText
              style={{
                fontSize: 16,
                fontFamily: "medium",
                opacity: 0.5,
              }}
            >
              Se connecter au service
            </NativeText>
            <NativeText
              style={{
                fontSize: 20,
                lineHeight: 24,
                fontFamily: "semibold",
              }}
            >
              {serviceName}
            </NativeText>
          </View>
        </View>

        <NativeList inline>
          <NativeItem
            icon={<Info />}
          >
            <NativeText variant="subtitle">
              Papillon n'est pas affilié à {serviceName}. La politique de confidentialité de {serviceName} s'applique.
            </NativeText>
          </NativeItem>
        </NativeList>

        {error && (
          <NativeList
            style={{
              backgroundColor: "#eb403422",
            }}
          >
            <NativeItem
              icon={<AlertTriangle />}
            >
              <NativeText variant="subtitle">
                {error}
              </NativeText>
            </NativeItem>
          </NativeList>
        )}

        <NativeListHeader label="Identifiant" />
        <NativeList>
          <NativeItem>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Nom d'utilisateur"
              placeholderTextColor={theme.colors.text + "55"}
              style={{
                fontSize: 16,
                fontFamily: "medium",
                flex: 1,
              }}
            />
          </NativeItem>
        </NativeList>

        <NativeListHeader label="Mot de passe" />
        <NativeList>
          <NativeItem>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mot de passe"
                placeholderTextColor={theme.colors.text + "55"}
                style={{
                  fontSize: 16,
                  fontFamily: "medium",
                  flex: 1,
                }}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ?
                  <EyeOff
                    color={theme.colors.text + "55"}
                  />
                  :
                  <Eye
                    color={theme.colors.text + "55"}

                  />
                }
              </TouchableOpacity>
            </View>
          </NativeItem>
        </NativeList>

        {customFieldsInputs.map((field, index) => (
          <View key={"c" + index}>
            <NativeListHeader label={field.title} />

            <NativeList>
              <NativeItem>
                <TextInput
                  value={field.value}
                  onChangeText={(text) => {
                    setCustomFields(customFieldsInputs.map((f, i) => {
                      if (i === index) {
                        return {
                          ...f,
                          value: text,
                        };
                      }
                      return f;
                    }));
                  }}
                  placeholder={field.placeholder}
                  placeholderTextColor={theme.colors.text + "55"}
                  style={{
                    fontSize: 16,
                    fontFamily: "medium",
                    flex: 1,
                  }}
                  secureTextEntry={field.secureTextEntry}
                />
              </NativeItem>
            </NativeList>
          </View>
        ))}

        <ButtonCta
          primary
          value="Se connecter"
          onPress={actionLogin}
          style={{
            marginTop: 24,
          }}
          icon={loading && <ActivityIndicator />}
        />

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginView;