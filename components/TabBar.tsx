import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import TabBarButton from "./TabBarButton";

const TabBar = ({ state, descriptors, navigation }) => {


  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (
          ["explore", "scanner/index", "scanner/FormScreen"].includes(
            route.name
          )
        )
          return null;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };
        // return (
        //   <TabBarButton
        //     key={route.name}
        //     style={styles.tabbarItem}
        //     onPress={onPress}
        //     onLongPress={onLongPress}
        //     isFocused={isFocused}
        //     routeName={route.name}
        //     color={isFocused ? "#6366f1" : "#004D40"}
        //     label={label}
        //   />
        // );







      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: "continuous",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
  },
});
export default TabBar;
