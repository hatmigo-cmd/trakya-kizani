import type { ComponentType } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { HumorLevel } from "../types/chat";
import { HUMOR_LEVEL_INFO } from "../types/chat";
import { folk, levelColors, radius, spacing, typography } from "../lib/theme";
import { CoffeeCupIcon, FlameIcon, NecktieIcon, TeaGlassIcon } from "./icons/TrakyaIcons";

const LEVELS: HumorLevel[] = [1, 2, 3, 4];

const LEVEL_ICONS: Record<HumorLevel, ComponentType<{ size?: number }>> = {
  1: NecktieIcon,
  2: TeaGlassIcon,
  3: CoffeeCupIcon,
  4: FlameIcon,
};

interface Props {
  value: HumorLevel;
  onChange: (level: HumorLevel) => void;
}

export function HumorLevelPicker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {LEVELS.map((level) => {
        const info = HUMOR_LEVEL_INFO[level];
        const palette = levelColors[level];
        const Icon = LEVEL_ICONS[level];
        const selected = level === value;
        return (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            style={[
              styles.card,
              { borderColor: selected ? palette.base : folk.panelLine },
              selected && { backgroundColor: palette.tint, borderColor: palette.base },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: selected ? palette.base : folk.bg800 }]}>
              <Icon size={22} />
            </View>
            <View style={styles.textCol}>
              <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: palette.base }]}>
                  <Text style={styles.badgeText}>{level}</Text>
                </View>
                <Text style={[styles.title, selected && { color: palette.deep }]}>
                  {info.title}
                </Text>
              </View>
              <Text style={[styles.description, selected && styles.descriptionSelected]}>
                {info.description}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: folk.panel,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  title: { ...typography.subtitle, color: folk.heading },
  description: {
    ...typography.caption,
    color: folk.textSoft,
    marginTop: 2,
  },
  descriptionSelected: { color: folk.ink },
});
