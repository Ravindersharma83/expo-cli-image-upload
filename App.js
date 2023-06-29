import { Button, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';

const App = () => {
  const [image,setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const pickImage = async ()=>{
    try {
      setIsLoading(true);
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (result !== null && !result.cancelled) {
        // setImage(result.assets[0].uri);
        const uploadUrl = await uploadImageAsync(result.assets[0].uri);
        setImage(uploadUrl);
      } else {
        setImage(null);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error occurred:', error);
      setIsLoading(false);
    }
  }

  const uploadImageAsync = async (uri)=>{
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(storage, `Images/image-${Date.now()}`);
      const result = await uploadBytes(storageRef,blob);
      // We're done with the blob, close and release it
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error : ${error}`);
    }
  }

  const deleteImage = async ()=>{
    setIsLoading(true);
    const deleteRef = ref(storage,image);
    try {
      deleteObject(deleteRef).then(()=>{
        setImage(null);
        setIsLoading(false);
      })
    } catch (error) {
      alert(`Error : ${error}`);
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
    <View className="px-6 w-full">
      {!image ? (
        <>
        <TouchableOpacity onPress={pickImage} className="w-full h-64 border-2 border-dashed border-gray-200 rounded-md bg-gray-50 flex items-center justify-center">
            {isLoading ? 
            <View className="flex items-center justify-center">
             <ActivityIndicator
               color={"#ff0000"}
               animating
               size={"large"}
             />
            </View> : 
            <Text className="text-xl text-gray-700 font-semibold">Pick an Image</Text>}
        </TouchableOpacity>
        </>
      ) : (
        <>
          {image && (
            <View className="w-full h-64  rounded-md overflow-hidden flex items-center justify-center">
              <Image source={{uri:image}} className="w-full h-full"/>
            </View>
          )}
          <Button title='Delete this image' onPress={deleteImage}/>
        </>
      )}
    </View>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({})