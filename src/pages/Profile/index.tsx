/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Post from "../../components/Post";
import { styled, alpha } from "@mui/system";
import Header from "../../components/Header";
import axios from "axios";
import CustomModal from "../../components/CustomModal";
import CustomFormModal from "../../components/CustomFormModal";
import { useWeb3React } from "@web3-react/core";
import Button from "../../components/Button";
import EditModal from "./components/EditModal";
import CreateIcon from "@mui/icons-material/Create";
import { useTheme } from "@emotion/react";
import Transparent from "../../assets/transparent.png";
import { useMediaQuery } from "@mui/material";
import UserDetailsSkeleton from "../../components/Skeletons/UserDetailsSkeleton";
import PostSkeleton from "../../components/Skeletons/PostSkeleton";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { injected } from "../../utils/connector";
import { useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import Ad from "../../components/Ad";
import TopCreator from "../../components/TopCreators";
import UpcomingFeatures from "../../components/UpcomingFeatures";

const Body = styled("div")(({ theme }) => ({
  width: "100vw",
  maxHeight: "100vh",
  overflowY: "auto",

  "::-webkit-scrollbar": {
    width: "13px",
    background: alpha(theme.palette.primary.main, 0.1),
  },

  "::-webkit-scrollbar-thumb": {
    borderRadius: "3px",
    background: theme.palette.primary.main,
    height: "150px",
  },

  [theme.breakpoints.down("sm")]: {
    "::-webkit-scrollbar": {
      width: "13px",
      background: alpha(theme.palette.primary.main, 0.1),
      display: "none",
    },
  },
}));

const MainDiv = styled("div")(({ theme }) => ({
  width: "450px",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "100px 0px",
  paddingTop: "70px",
  textAlign: "center",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "90px 10px",
    paddingTop: "60px",
  },
}));

const ProfilePicture = styled("img")(({ theme }) => ({
  width: "130px",
  height: "130px",
  margin: "15px auto",
  marginTop: "30px",
  borderRadius: "100%",
  boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  cursor: "pointer",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
}));

const Heading = styled("div")(({ theme }) => ({
  fontSize: "27px",
  lineHeight: "27px",
  fontWeight: "300",
  color: theme.palette.text.primary,
  textAlign: "center",
  marginTop: "-10px",
  lineBreak: "anywhere",
}));

const SubHeading = styled("div")(({ theme }) => ({
  fontSize: "20px",
  lineHeight: "20px",
  marginTop: "5px",
  fontWeight: "700",
  color: theme.palette.text.primary,
  textAlign: "center",
  lineBreak: "anywhere",
}));

const Bio = styled("div")(({ theme }) => ({
  fontSize: "15px",
  lineHeight: "15px",
  fontWeight: "500",
  marginTop: "10px",
  color: theme.palette.text.primary,
  textAlign: "center",
  lineBreak: "anywhere",
}));

const InfoContainer = styled("div")(({ theme }) => ({
  width: "100%",
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  margin: "20px 0px",
  padding: "8px",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-around",
}));

const InfoTab = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "800",
  width: "100px",
  margin: "3px 0px",
  cursor: "pointer",
}));

const PostTypeContainer = styled("div")(({ theme }) => ({
  width: "100%",
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  margin: "15px 0px",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-around",
  padding: "3px",
}));

const PostTypeTab = styled("div")<{ active?: boolean }>(
  ({ theme, active }) => ({
    fontSize: "17px",
    lineHeight: "17px",
    fontWeight: "500",
    width: "calc(50% - 4px)",
    padding: "10px 0px",
    borderRadius: "5px",
    color: active ? theme.palette.background.paper : theme.palette.text.primary,
    backgroundColor: active ? alpha(theme.palette.text.primary, 0.5) : "none",
    cursor: "pointer",
    textAlign: "center",
  })
);

const AdDiv = styled("div")(({ theme }) => ({
  position: "fixed",
  top: "65px",
  left: "0",
  height: "calc(100vh - 65px)",
  width: "calc(50vw - 233px)",

  display: "flex",
  flexDirection: "column",

  padding: "30px 70px",

  [theme.breakpoints.down("md")]: {
    padding: "30px 20px",
  },

  [theme.breakpoints.down("smd")]: {
    display: "none",
  },
}));

const SuggestionsDiv = styled("div")(({ theme }) => ({
  position: "fixed",
  top: "65px",
  right: "14px",
  height: "calc(100vh - 65px)",
  width: "calc(50vw - 235px)",

  display: "flex",
  flexDirection: "column",

  padding: "20px 70px",

  [theme.breakpoints.down("md")]: {
    padding: "20px 20px",
  },

  [theme.breakpoints.down("smd")]: {
    display: "none",
  },
}));

export default function LetterAvatars() {
  const [createdPosts, setCreatedPosts] = useState<any[]>([]);
  const [createdPostsLoading, setCreatedPostsLoading] = useState(true);
  const [ownedPosts, setOwnedPosts] = useState<any[]>([]);
  const [ownedPostsLoading, setOwnedPostsLoading] = useState(true);
  const [postType, setPostType] = useState<string>("owned");
  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const [fetchData, setFetchData] = useState<boolean>(false);
  const [loadDataModalStatus, setLoadDataModalStatus] = useState(false);

  const [likes, setLikes] = useState(100);

  const [address, setAddress] = useState("");
  const [user, setUser] = useState<any>(null);
  const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
  const { account, activate } = useWeb3React();
  const theme = useTheme();
  //@ts-ignore
  const isMobile = useMediaQuery(theme?.breakpoints?.down("sm"));
  const navigate = useNavigate();
  const signature = useAppSelector((state) => state.userReducer.signature);
  const walletAddress = useAppSelector(
    (state) => state.userReducer.walletAddress
  );

  const getCreatedPosts = async () => {
    const result = await axios.get(
      "https://socialblocks.herokuapp.com/posts/getUserPosts?address=" +
        address +
        "&type=creator"
    );
    setCreatedPosts(result.data.sort((a, b) => Number(b._id) - Number(a._id)));
    setTimeout(() => {
      setOwnedPostsLoading(false);
    }, 500);
  };

  const getOwnedPosts = async () => {
    const result = await axios.get(
      "https://socialblocks.herokuapp.com/posts/getUserPosts?address=" +
        address +
        "&type=owner"
    );
    setOwnedPosts(result.data.sort((a, b) => Number(b._id) - Number(a._id)));
    setTimeout(() => {
      setOwnedPostsLoading(false);
    }, 500);
  };

  const getUserDetails = async () => {
    const result = await axios.get(
      "https://socialblocks.herokuapp.com/users/details?address=" + address
    );

    setUser({ ...result.data });
    setLoadDataModalStatus(false);

    setTimeout(() => {
      setCreatedPostsLoading(false);
    }, 500);
  };

  useEffect(() => {
    setAddress(window.location.href.split("/")[4].toLowerCase());
  }, [window.location.href]);

  useEffect(() => {
    if (address && address !== "") {
      getUserDetails();
      getCreatedPosts();
      getOwnedPosts();
    }
  }, [address]);

  useEffect(() => {
    if (user?.followers?.includes(walletAddress?.toLowerCase())) {
      setFollowStatus(true);
    }
  }, [user]);

  useEffect(() => {
    let count = 0;
    createdPosts.forEach((e) => {
      count += e?.likesArray?.length;
    });
    setLikes(count);
  }, [createdPosts]);

  const follow = async () => {
    if (!account) {
      await activate(injected);
      return;
    }
    setFollowStatus(true);
    let result = await axios.post(
      "https://socialblocks.herokuapp.com/users/follow",
      {
        userAddress: walletAddress?.toLowerCase(),
        followUser: user?.address,
        signature,
      }
    );
    setUser((state) => ({
      ...state,
      followers: [...state.followers, walletAddress?.toLowerCase()],
    }));
    setFollowStatus(true);
  };

  const unFollow = async () => {
    if (!account) {
      await activate(injected);
      return;
    }
    setFollowStatus(false);
    let result = await axios.post(
      "https://socialblocks.herokuapp.com/users/unfollow",
      {
        userAddress: walletAddress?.toLowerCase(),
        followUser: user?.address,
        signature,
      }
    );
    setFollowStatus(false);
  };

  const reloadData = async () => {
    setLoadDataModalStatus(true);
    setTimeout(() => {
      let user_address = address;
      setAddress("");
      setAddress(user_address);
    }, 20000);
  };

  return (
    <Body>
      <Header />
      <MainDiv>
        {user ? (
          <>
            <ProfilePicture
              src={Transparent}
              style={{
                backgroundImage: `url(${user?.image})`,
              }}
            />
            <Heading>{user?.displayName}</Heading>
            <SubHeading>@{user?.userName}</SubHeading>
            <Bio>{user?.bio}</Bio>
            <Button
              style={{ marginBottom: "0px", marginTop: "25px" }}
              onClick={() => {
                if (user?.address?.toLowerCase() === account?.toLowerCase()) {
                  setEditModalStatus(true);
                } else if (followStatus) {
                  unFollow();
                } else {
                  follow();
                }
              }}
            >
              {user?.address?.toLowerCase() === account?.toLowerCase()
                ? "Edit Profile"
                : followStatus
                ? "Unfollow"
                : "follow"}
            </Button>
            <InfoContainer>
              <InfoTab>
                <div>{ownedPosts.length}</div>
                <div style={{ fontSize: "15px", fontWeight: "500" }}>Posts</div>
              </InfoTab>
              <InfoTab
                onClick={() => {
                  navigate(`/followers/${user?.address}`);
                }}
              >
                <div>{user?.followers?.length}</div>
                <div style={{ fontSize: "15px", fontWeight: "500" }}>
                  Followers
                </div>
              </InfoTab>
              {!isMobile ? (
                <InfoTab
                  onClick={() => {
                    navigate(`/followings/${user?.address}`);
                  }}
                >
                  <div>{user?.following?.length}</div>
                  <div style={{ fontSize: "15px", fontWeight: "500" }}>
                    Following
                  </div>
                </InfoTab>
              ) : null}

              <InfoTab>
                <div>{likes}</div>
                <div style={{ fontSize: "15px", fontWeight: "500" }}>Likes</div>
              </InfoTab>
            </InfoContainer>
          </>
        ) : (
          <UserDetailsSkeleton />
        )}

        <PostTypeContainer>
          <PostTypeTab
            active={postType === "owned" ? true : false}
            onClick={() => {
              setPostType("owned");
            }}
          >
            Owned Posts
          </PostTypeTab>
          <PostTypeTab
            active={postType === "created" ? true : false}
            onClick={() => {
              setPostType("created");
            }}
          >
            Created Posts
          </PostTypeTab>
        </PostTypeContainer>

        {createdPosts.length > 0 && postType === "created" ? (
          createdPosts.map((item: any, index: number) => (
            <Post key={index} post={item} />
          ))
        ) : createdPostsLoading && postType === "created" ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : postType === "created" ? (
          <SubHeading>
            <br />
            No Created Posts.
          </SubHeading>
        ) : null}

        {ownedPosts.length > 0 && postType === "owned" ? (
          ownedPosts.map((item: any, index: number) => (
            <Post key={index} post={item} />
          ))
        ) : ownedPostsLoading && postType === "owned" ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : postType === "owned" ? (
          <SubHeading>
            <br />
            No Owned Posts.
          </SubHeading>
        ) : null}
      </MainDiv>

      <CustomFormModal
        open={editModalStatus}
        handleClose={() => {
          setEditModalStatus(false);
        }}
      >
        <EditModal
          image={user?.image}
          username={user?.userName}
          displayName={user?.displayName}
          bio={user?.bio}
          handleClose={() => {
            setEditModalStatus(false);
          }}
          reloadData={reloadData}
        />
      </CustomFormModal>
      <CustomModal
        open={loadDataModalStatus}
        handleClose={() => {
          setLoadDataModalStatus(false);
        }}
      >
        <Loader />
        <br /> <br />
        <Heading style={{ fontWeight: "400", fontSize: "20px" }}>
          Changes might take 10-15 secs to Reflect, you can{" "}
          <span
            style={{
              fontWeight: "700",
              fontSize: "25px",
              textDecoration: "underline",
              textDecorationThickness: "3px",
              cursor: "pointer",
            }}
            onClick={() => {
              setLoadDataModalStatus(false);
            }}
          >
            close
          </span>
          this Modal.
        </Heading>
      </CustomModal>

      <AdDiv>
        <Ad />
        {/* <Ad /> */}
        {/* <Ad /> */}
      </AdDiv>
      <SuggestionsDiv>
        <TopCreator />
        <UpcomingFeatures />
        {/* <Ad /> */}
      </SuggestionsDiv>
    </Body>
  );
}
