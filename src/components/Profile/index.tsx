import React from "react";
import { styled, alpha } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const MainDiv = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  marginLeft: "auto",
  marginRight: "auto",
  margin: "13px 0px",
  backgroundColor: theme.palette.background.paper,
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "9px",
  boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
  cursor: "pointer",

  [theme.breakpoints.down("sm")]: {},
}));

const PostHeader = styled("div")(({ theme }) => ({
  width: "100%",
  height: "fit-content",
  display: "flex",
  padding: "9px",
  alignItems: "center",
  justifyContent: "flex-start",
}));

const PostPicture = styled("img")(({ theme }) => ({
  width: "50px",
  height: "50px",
  objectFit: "cover",
  borderRadius: "40px",
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  cursor: "pointer",
}));

const PostDisplayname = styled("div")(({ theme }) => ({
  fontSize: "17px",
  fontWeight: "400",
  color: theme.palette.text.primary,
  textAlign: "left",
  marginLeft: "15px",
  cursor: "pointer",
}));

const PostUsername = styled("div")(({ theme }) => ({
  fontSize: "13px",
  fontWeight: "700",
  color: theme.palette.text.primary,
  textAlign: "left",
  marginLeft: "15px",
  cursor: "pointer",
}));

type Props = {
  image;
  displayName;
  userName;
  address;
};

const Profile: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <MainDiv onClick={() => navigate(`/profile/${props.address}`)}>
      <PostHeader>
        <PostPicture src={props.image} />
        <div>
          <PostDisplayname>{props.displayName}</PostDisplayname>
          <PostUsername>@{props.userName}</PostUsername>
        </div>
        <MoreVertIcon
          style={{
            marginLeft: "auto",
            height: "30px",
            width: "30px",
            cursor: "pointer",
          }}
        />
      </PostHeader>
    </MainDiv>
  );
};

export default Profile;
