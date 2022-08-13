/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useRoutes, Navigate, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { initializeContract } from "../utils/contractMethods";
import Search from "../pages/Search";
import PostDetail from "../pages/PostDetail";
import Followers from "../pages/Followers";
import Followings from "../pages/Followings";
import Web3 from "web3";
import { isAddressReserved } from "../utils/contractMethods";
import keccak256 from "keccak256";
import { useAppSelector } from "../hooks";

const ConnectedRoutes = () => {
  return useRoutes([
    {
      path: "/",
      children: [
        {
          path: "",
          element: <Navigate to={"/home"} />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "create",
          element: <CreatePost />,
        },
        {
          path: "profile",
          children: [{ path: "*", element: <Profile /> }],
        },
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "followers",
          children: [{ path: "*", element: <Followers /> }],
        },
        {
          path: "followings",
          children: [{ path: "*", element: <Followings /> }],
        },
        {
          path: "post",
          children: [{ path: "*", element: <PostDetail /> }],
        },
        {
          path: "*",
          element: <Home />,
        },
      ],
    },
  ]);
};

const NotConnectedRoutes = () => {
  return useRoutes([
    {
      path: "/",
      children: [
        {
          path: "",
          element: <Navigate to={"/home"} />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "profile",
          children: [{ path: "*", element: <Profile /> }],
        },
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "followers",
          children: [{ path: "*", element: <Followers /> }],
        },
        {
          path: "followings",
          children: [{ path: "*", element: <Followings /> }],
        },
        {
          path: "post",
          children: [{ path: "*", element: <PostDetail /> }],
        },
        {
          path: "*",
          element: <Home />,
        },
      ],
    },
  ]);
};

const Index = () => {
  const { account, library, active, chainId, deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contract = useAppSelector((state) => state.contractReducer.contract);

  const getSignature = async () => {
    if (library && account && active) {
      const timeConstant = 86400;

      const time = Math.floor(Math.floor(Date.now() / 1000) / timeConstant);
      const hash = keccak256(time.toString()).toString("hex");

      const web3 = new Web3(library.currentProvider);

      const signedMessage = await web3.eth.personal.sign(hash, account, "");

      dispatch({
        type: "SET_SIGNATURE",
        payload: signedMessage,
      });

      return signedMessage;
    }
  };

  const redirect = async () => {
    if (active && contract) {
      const username = await isAddressReserved(account, contract);
      if (!username) {
        navigate("/register");
      } else {
        await getSignature();
      }
    }
  };

  useEffect(() => {
    if (active && library) {
      initializeContract(library.currentProvider, (contract: any) => {
        dispatch({
          type: "SET_CONTRACT_INSTANCE",
          payload: contract,
        });
      });
    }
  }, [active, library]);

  useEffect(() => {
    if (active && contract) {
      redirect();
    }
  }, [active, contract]);

  useEffect(() => {
    if (chainId && chainId !== 4) {
      console.log("chainId : ", chainId);
      deactivate();
      alert(
        `Warning:\nYou are connected to wrong network please connect to "Rinkeby Test Network".`
      );
    }
  }, [account, active, chainId]);

  return <div>{active ? ConnectedRoutes() : NotConnectedRoutes()}</div>;
};

export default Index;
