import { useTheme, styled, alpha } from "@mui/material";

const Heading = styled("div")(({ theme }) => ({
  fontSize: "20px",
  lineHeight: "15px",
  fontWeight: "600",
  color: theme.palette.text.primary,
  textAlign: "center",
  cursor: "pointer",
  marginBottom: "5px",
}));

const SubHeading = styled("div")(({ theme }) => ({
  fontSize: "11px",
  lineHeight: "13px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  textAlign: "center",
  cursor: "pointer",
  marginTop: "9px",
}));

export default function Ad(props) {
  const theme = useTheme();
  return (
    <div
      style={{
        width: "100%",
        flex: "1",
        margin: "10px 0px",
        padding: "20px",
        cursor: "pointer",
        backgroundColor: theme.palette.background.paper,
        border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
        borderRadius: "9px",
        boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading>Advertisement</Heading>
      <SubHeading>
        These will be community approved ads. The reveneu generated through
        these ads will be distributed between the Creators, DAO voters and will
        be used to pump the token price which will benifit the token holders /
        community.
      </SubHeading>
    </div>
  );
}
