import { styled, alpha } from "@mui/material/styles";
import ConnectButton from "../ConnectButton/index";
import { useNavigate } from "react-router-dom";
import Logo1 from "../../assets/Green Logo small.png";
import Logo2 from "../../assets/Red Logo small.png";
import { useTheme } from "@mui/system";
import { useMediaQuery } from "@mui/material";
import { injected } from "../../utils/connector";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";

const Header = styled("div")(({ theme }) => ({
  width: "100%",
  height: "65px",
  padding: "7px 20px",
  backgroundColor: theme.palette.background.paper,
  borderBottom: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "fixed",
  top: "0px",
  zIndex: "1000",
}));

const Logo = styled("img")(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: "left",
  cursor: "pointer",
  height: "40px",
}));

const Input = styled("input")<{ isSearchPage? }>(({ theme, isSearchPage }) => ({
  fontSize: "15px",
  fontWeight: "400",
  color: theme.palette.text.primary,
  padding: "7px 21px",
  width: "400px",
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "10px",
  margin: "7px 0px",
  marginLeft: "auto",
  marginRight: "auto",

  ":focus": {
    outline: "none",
  },

  [theme.breakpoints.down("smd")]: {
    display: isSearchPage ? "block" : "none",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const Heading = styled("div")(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "400",
  color: theme.palette.text.primary,
}));

export default function HeaderComponent(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("smd"));

  const { activate } = useWeb3React();

  const getErrorMessage = (error: any) => {
    if (error instanceof NoEthereumProviderError) {
      return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
    } else if (error instanceof UnsupportedChainIdError) {
      return `You're connected to an unsupported network. Please switch to Mumbai Testnet.`;
    } else if (error instanceof UserRejectedRequestError) {
      return "Please authorize this website to access your Ethereum account.";
    } else {
      console.error(error);
      return "An unknown error occurred. Check the console for more details.";
    }
  };

  const activateMetamaskWallet = async () => {
    try {
      await activate(injected, (err) => {
        alert(getErrorMessage(err));
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Header>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        {props?.isSearchPage ? (
          <>
            {!isTab ? (
              <>
                <Logo
                  onClick={() => {
                    navigate("/");
                  }}
                  src={theme.palette.mode === "dark" ? Logo1 : Logo2}
                />
                &nbsp; &nbsp;
                <Heading
                  onClick={() => {
                    navigate("/");
                  }}
                  style={{ fontWeight: "700" }}
                >
                  Social Blocks
                </Heading>
              </>
            ) : null}
          </>
        ) : (
          <>
            <Logo
              onClick={() => {
                navigate("/");
              }}
              src={theme.palette.mode === "dark" ? Logo1 : Logo2}
            />
            {!isMobile ? (
              <>
                &nbsp; &nbsp;
                <Heading style={{ fontWeight: "700" }}>Social Blocks</Heading>
              </>
            ) : null}
          </>
        )}
      </div>
      <Input
        placeholder="Search Users..."
        autoFocus={props?.isSearchPage ? true : false}
        isSearchPage={props?.isSearchPage}
        onClick={() => {
          if (
            window.location.href.split("/")[3] !== "search" &&
            !props.followPage
          ) {
            navigate("/search");
          }
        }}
        onChange={(e) => {
          if (props?.isSearchPage) {
            props?.setSearchValue(e.target.value);
          }
        }}
      />
      {props?.isSearchPage ? (
        !isTab ? (
          <div>
            <ConnectButton connectMetamask={() => activateMetamaskWallet()} />
          </div>
        ) : null
      ) : (
        <div>
          <ConnectButton connectMetamask={() => activateMetamaskWallet()} />
        </div>
      )}
    </Header>
  );
}
