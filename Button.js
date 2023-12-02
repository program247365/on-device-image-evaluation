import { View, Pressable, Text } from "react-native";
export default function Button({ label, theme, onPress }) {
  return (
    <View>
      <Pressable onPress={onPress} label={label}>
        <Text>{label}</Text>
      </Pressable>
    </View>
  );
}
