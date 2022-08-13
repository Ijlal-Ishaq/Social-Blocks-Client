import { useTheme, alpha } from "@mui/material";

export default function Ad(props) {
  const theme = useTheme();
  return (
    <div
      style={{
        width: "100%",
        flex: "1",
        margin: "10px 0px",
        cursor: "pointer",
        backgroundColor: theme.palette.background.paper,
        border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
        borderRadius: "9px",
        boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
      }}
    ></div>
  );
}
