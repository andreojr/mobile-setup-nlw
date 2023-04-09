import { ActivityIndicator, View } from "react-native";

export function Loading() {

    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#000000'}}>
            <ActivityIndicator color="#3E1086" />
        </View>
    );
}