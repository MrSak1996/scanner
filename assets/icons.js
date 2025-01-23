import FeatherIcon from "react-native-vector-icons/Feather";

export const icons = {
    index: (props) => (
      <FeatherIcon name="home" size={16} color={"#004D40"} {...props} />
    ),
    create: (props) => (
      <FeatherIcon name="grid" size={16} color={"#004D40"} {...props} />
    ),
    about: (props) => (
      <FeatherIcon name="user" size={16} color={"#004D40"} {...props} />
    ),
  };