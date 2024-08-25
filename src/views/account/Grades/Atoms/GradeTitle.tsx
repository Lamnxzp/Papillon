import { NativeItem, NativeList, NativeText } from "@/components/Global/NativeComponents";
import { getSubjectData } from "@/services/shared/Subject";
import { getCourseSpeciality } from "@/utils/format/format_cours_name";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export const GradeTitle = ({ grade, subjectData }) => {
  const theme = useTheme();

  return (
    <NativeList>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: subjectData.color + "35",
        }}
      >
        <NativeText
          style={{
            fontSize: 24,
            lineHeight: 32,
          }}
        >
          {subjectData.emoji}
        </NativeText>

        <NativeText
          variant="overtitle"
          style={{
            flex: 1,
          }}
          numberOfLines={1}
        >
          {subjectData.pretty}
        </NativeText>

        {getCourseSpeciality(grade.subjectName) && (
          <NativeText
            variant="subtitle"
            style={{
              textAlign: "right",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderColor: theme.colors.text + "55",
              borderWidth: 1,
              borderRadius: 8,
              borderCurve: "continuous",
              maxWidth: 120,
            }}
            numberOfLines={1}
          >
            {getCourseSpeciality(grade.subjectName)}
          </NativeText>
        )}

        <NativeText
          variant="subtitle"
        >
          {new Date(grade.timestamp).toLocaleDateString("fr-FR", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </NativeText>
      </View>

      <View
        style={{
          width: "100%",
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <NativeText
            numberOfLines={2}
            variant={!grade.description ? "subtitle" : "default"}
            style={grade.description && {
              lineHeight: 20,
              fontSize: 16,
              textAlignVertical: "center",
            }}
          >
            {grade.description || `Note rendue le ${new Date(grade.timestamp).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            })}`}
          </NativeText>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <NativeText
            style={{
              fontSize: 22,
              lineHeight: 26,
              fontFamily: "semibold",
            }}
          >
            {!grade.student.disabled && parseFloat(grade.student.value).toFixed(2) || "N. not"}
          </NativeText>

          <NativeText
            style={{
              fontSize: 16,
              lineHeight: 16,
              opacity: 0.6,
              marginBottom: 1,
            }}
          >
            /{parseFloat(grade.outOf.value).toFixed(0)}
          </NativeText>
        </View>
      </View>
    </NativeList>
  );
};