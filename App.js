import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import { StyleSheet, Text, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "./ImageViewer";
import Button from "./Button";

// TensorFlow.js
import * as tf from "@tensorflow/tfjs";
//import "tfjs-react-native-para-patch";
import "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as FileSystem from "expo-file-system";

const getImageSize = async (imageUri) => {
  try {
    const asset = Asset.fromURI(imageUri);
    await asset.downloadAsync();
    console.log("asset", asset);
    const { width, height } = asset;

    return { image: { width, height } };
    console.log("Image Dimensions:", width, "x", height);
  } catch (error) {
    console.log("Error getting image size:", error);
  }
};

const getImageArrayBuffer = async (filePath) => {
  try {
    // Read the image file and get its contents as an ArrayBuffer
    const fileContent = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = new Uint32Array(Buffer.from(fileContent, "base64"));

    if (arrayBuffer.length <= 0) {
      console.error("Failed to create a Uint32Array from file content");
      return null;
    }

    return arrayBuffer;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};

export default function App() {
  const [isTFReady, setIsTFReady] = useState(false);
  //const image = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // TODO: load that damn model, and use it to predict the image
  // https://github.com/tensorflow/tfjs-models/tree/master/mobilenet
  // when we get the result put it in the model result!
  const [modelResult, setModelResult] = useState("");

  const load = async (imageUri) => {
    console.log("loading");
    console.log("imageUri", imageUri);
    try {
      //   const { image: dimensions } = await getImageSize(
      // imageUri.replace("file://", "")
      // );

      // Start inference and show result.
      // const image = require("./basketball.jpg");
      const imageDataArrayBuffer = await getImageArrayBuffer(imageUri);

      console.log("imageDataArrayBuffer");
      // const imageAssetPath = Image.resolveAssetSource(image);
      // const response = await fetch(SelectedImage, {}, { isBinary: true });

      //       const imageDataArrayBuffer = await SelectedImage.arrayBuffer();
      // const imageDataArrayBuffer = await response.arrayBuffer();
      const imageData = new Uint8Array(imageDataArrayBuffer);
      console.log("got past imageData");
      // const imageTensor = decodeJpeg(imageData);
      console.log(" got past imageTensor");
      try {
        // Load mobilenet.
        await tf.ready();
        const model = await mobilenet.load();
        setIsTFReady(true);

        const prediction = await model.classify({
          data: imageData,
          width: 1668, //TODO: get the width and height from the image
          height: 1668,
        });
        if (prediction && prediction.length > 0) {
          console.log("prediction", prediction);
          setModelResult(
            `${prediction[0].className} (${prediction[0].probability.toFixed(
              3
            )})`
          );
        }
      } catch (err) {
        console.log("Prediction error", err);
      }
    } catch (err) {
      console.log("some other error", err);
    }
  };

  const PlaceholderImage = require("./assets/splash.png");
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      //do the tensorflow stuff here
      load(result.assets[0].uri);
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
