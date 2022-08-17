import React from "react";
import { styled, alpha } from "@mui/material";

const MainDiv = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  marginLeft: "auto",
  marginRight: "auto",
  margin: "7px 0px",
  backgroundColor: theme.palette.background.paper,
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "9px",
  // boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
  cursor: "pointer",
  overflow: "hidden",
  padding: "9px",

  [theme.breakpoints.down("sm")]: {},
}));

const Heading = styled("div")(({ theme }) => ({
  fontSize: "15px",
  lineHeight: "15px",
  fontWeight: "600",
  color: theme.palette.primary.main,
  textAlign: "left",
  cursor: "pointer",
  marginBottom: "5px",
}));

const SubHeading = styled("div")(({ theme }) => ({
  fontSize: "13px",
  lineHeight: "13px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  textAlign: "left",
  cursor: "pointer",
}));

type Props = {
  title;
  description;
};

const Feature: React.FC<Props> = (props) => {
  return (
    <MainDiv>
      <Heading>{props.title}</Heading>
      <SubHeading>{props.description}</SubHeading>
    </MainDiv>
  );
};

export default Feature;
