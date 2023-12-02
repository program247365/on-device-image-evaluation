import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "./ImageViewer";
import Button from "./Button";
export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modelResult, setModelResult] = useState("");

  const PlaceholderImage = require("./assets/splash.png");
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };
  return (
    <View style={styles.container}>
      <Text>Image Picker</Text>
      <Button
        style={{ backgroundColor: "pink" }}
        label="Choose a photo"
        onPress={pickImageAsync}
      />
      {selectedImage && (
        <>
          <Text>Image Data from Model:</Text>
          <Text>{modelResult}</Text>
        </>
      )}
      <ImageViewer
        placeholderImageSource={PlaceholderImage}
        selectedImage={selectedImage}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
