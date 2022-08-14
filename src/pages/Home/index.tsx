import { useEffect, useState } from "react";
import axios from "axios";
import { alpha, styled } from "@mui/material";

import Post, { SinglePost } from "../../components/Post/index";
import Header from "../../components/Header/index";
import FloatingActionButton from "../../components/FloatingActionButton";
import SearchButton from "../../components/SearchButton";
import Ad from "../../components/Ad";
import TopCreator from "../../components/TopCreators";
import UpcomingFeatures from "../../components/UpcomingFeatures";

import { useAppSelector } from "../../hooks";
import PostSkeleton from "../../components/Skeletons/PostSkeleton";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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
  padding: "75px 0px",
  margin: "auto",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "75px 10px",
  },
}));

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

const Heading = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  textAlign: "center",
}));

const getSkeleton = () => {
  return (
    <>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  );
};

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<SinglePost[]>([]);
  const [fetchData, setFetchData] = useState<boolean>(false);
  const { account } = useWeb3React();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const changesModalVisible = useAppSelector(
    (state) => state.userReducer.changesModalVisible
  );

  const getPosts = async () => {
    setLoading(true);
    await axios({
      url: `https://socialblocks.herokuapp.com/posts/getPosts/${account}`,
      method: "get",
    }).then((response) => {
      if (response?.data) {
        setPosts(response.data.sort((a, b) => Number(b._id) - Number(a._id)));

        dispatch({ type: "SET_CHANGES_MODAL_VISIBLE", payload: false });

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (fetchData) {
      console.log("fetching data again");

      getPosts();

      setFetchData(false);
    }
  }, [fetchData]);

  useEffect(() => {
    if (changesModalVisible) {
      console.log("timeout set");

      setTimeout(() => {
        setFetchData(true);
      }, 20000);
    }
  }, [changesModalVisible]);

  return (
    <Body>
      <Header />
      <MainDiv>
        {loading ? (
          getSkeleton()
        ) : posts.length === 0 ? (
          <Heading
            style={{
              marginTop: "30px",
              fontWeight: "400",
              fontSize: "25px",
            }}
          >
            <br />
            Your feed is empty!
            <br />
            <span
              style={{ fontWeight: "700", cursor: "pointer" }}
              onClick={() => {
                navigate("/search");
              }}
            >
              Search &#38; Follow
            </span>
            <br />
            Creators to see their Art.
            <br />
          </Heading>
        ) : (
          posts.map((item, i) => <Post key={i} post={item} />)
        )}
      </MainDiv>
      <AdDiv>
        <Ad />
        <Ad />
        <Ad />
      </AdDiv>
      <SuggestionsDiv>
        <TopCreator />
        <UpcomingFeatures />
      </SuggestionsDiv>
      <SearchButton />
      <FloatingActionButton />
    </Body>
  );
}
