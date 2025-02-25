import { Canvas, DiffRect, RoundedRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;
const outerRadius = 0;
const innerRadius = 50;

// Define outer rectangle (full-screen overlay)
const outer = rrect(rect(0, 0, width, height), outerRadius, outerRadius);

// Define inner rectangle (cutout)
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  innerRadius,
  innerRadius
);

export const Overlay = () => {
  return (
    <Canvas
      style={
        Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
      }
    >
      {/* Dark overlay with cutout */}
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />

      {/* Border around the cutout */}
      <RoundedRect
        rect={inner}
        color="white" // Border color
        style="stroke" // Outline instead of fill
        strokeWidth={4} // Border thickness
      />
    </Canvas>
  );
};
