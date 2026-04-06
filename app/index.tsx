import { View, Text, Button, Alert } from "react-native";

function HomeScreen() {

  const pressMe =() => {
    Alert.alert("Hello Saurabh")
  }
  return(
    <View>
      <Text style={{ fontSize: 25 }}>Hello From HomeScreen</Text>
      <Button title="Hello" onPress={pressMe}/>
    </View>
  )
}

export default HomeScreen;