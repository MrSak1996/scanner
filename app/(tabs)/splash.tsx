import { View, Text, Image, useWindowDimensions,StyleSheet} from 'react-native'
import React , {useEffect} from 'react'
import {useRouter} from "expo-router";
import Icon from "../../assets/images/denr_logo.png";

const splash = () => {
  const router = useRouter();
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    setTimeout(() => {
      router.push("/(tabs)")
    })
  },[])
  return (
    <View style={style.container}>
      <Text style={style.splashText}>splash</Text>
      <Image 
        source={Icon}
        style={style.image}
        />
        <Text style={style.loadingText}>Loading...</Text>
    </View>
  )
}

export default splash

const style = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#5E5E5E",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  splashText:{
    fontSize:40,
    color:"#fff",
    fontWeight:600,
    fontFamily:"PoppinsLight"
  },
  image:{
    width:80,
    height:80
  },
  loadingText:{
    marginTop:20,
    color:"#fff"
  }
})