import "./style.css";
import { useTheme } from "@mui/material/styles";

const Loader = () => {
  const theme = useTheme();
  return (
    <div className="lds-facebook">
      <div style={{ backgroundColor: theme.palette.primary.main }}></div>
      <div style={{ backgroundColor: theme.palette.primary.main }}></div>
      <div style={{ backgroundColor: theme.palette.primary.main }}></div>
    </div>
  );
};

export default Loader;
