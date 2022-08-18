import { FC, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import FieldFileInput from "../../components/FieldFileInput";
import Button from "../../components/Button";
import { create } from "ipfs-http-client";
import { createAccount } from "../../utils/contractMethods";
import CustomModal from "../../components/CustomModal";
import Loader from "../../components/Loader";
import { useAppSelector } from "../../hooks";
import { useWeb3React } from "@web3-react/core";
import { useTheme } from "@mui/material/styles";

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
  height: "fit-content",
  margin: "60px auto",
  backgroundColor: theme.palette.background.paper,
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "9px",
  boxShadow: "0 0 1rem 0 " + alpha("#000", 0.2),
  padding: "30px 20px",

  [theme.breakpoints.down("sm")]: {
    width: "90%",
    padding: "15px",
    marginTop: "50px",
  },
}));

const Heading = styled("div")(({ theme }) => ({
  fontSize: "25px",
  fontWeight: "700",
  color: theme.palette.text.primary,
  textAlign: "center",
  marginBottom: "15px",
}));

const Label = styled("div")(({ theme }) => ({
  fontSize: "17px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  textAlign: "left",
  width: "100%",
  marginTop: "10px",
  marginBottom: "3px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const Input = styled("input")(({ theme }) => ({
  fontSize: "17px",
  fontWeight: "400",
  color: theme.palette.text.primary,
  margin: "5px 0px",
  marginTop: "0px",
  padding: "7px 14px",
  width: "100%",
  backgroundColor: theme.palette.background.default,
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "5px",
  marginBottom: "0px",

  ":focus": {
    outline: "none",
  },
}));

const TextArea = styled("textarea")(({ theme }) => ({
  fontSize: "17px",
  fontWeight: "400",
  color: theme.palette.text.primary,
  margin: "5px 0px",
  marginTop: "0px",
  padding: "7px 14px",
  width: "100%",
  backgroundColor: theme.palette.background.default,
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "5px",
  overflowY: "auto",
  resize: "vertical",
  minHeight: "100px",
  marginBottom: "0px",

  "::-webkit-scrollbar": {
    width: "5px",
    background: alpha(theme.palette.primary.main, 0.1),
  },

  "::-webkit-scrollbar-thumb": {
    borderRadius: "5px",
    background: theme.palette.primary.main,
  },
}));

const Index: FC = () => {
  const [selectedFile, setSelectedFile] = useState<any>();
  const [displayName, setDisplayName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  const { account } = useWeb3React();

  const [modalText] = useState<string>("Registering");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const contract = useAppSelector((state) => state.contractReducer.contract);

  const theme = useTheme();

  const uploadToIPFS = async () => {
    const projectId = "2DFPFIAaXx9w2afULnEiEsSk6VF";
    const projectSecret = "9efe90a3f717625277f8464bc47952f1";

    const auth =
      "Basic " +
      Buffer.from(projectId + ":" + projectSecret).toString("base64");

    const options = {
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    };
    const client = create(options); //create("https://ipfs.infura.io:5001/api/v0");
    const added = await client.add(selectedFile);
    const url = added.cid.toString();
    return url;
  };

  async function createUser() {
    const isValid = !/[^a-zA-Z0-9]/.test(userName.trim());

    if (!isValid) {
      setInvalidInput(true);
      return;
    }

    if (!account) {
      alert("Connect Wallet!");
      return;
    }

    setInvalidInput(false);

    setLoading(true);
    try {
      const image = await uploadToIPFS();
      await createAccount(
        [userName, displayName, bio, image],
        account!,
        contract,
        async () => {
          setLoading(false);
          navigate("/");
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Body>
      <MainDiv>
        <Heading>Register</Heading>
        <Label>
          Username:
          <span style={{ fontSize: "10px" }}>
            <span
              style={{
                color: theme.palette.primary.main,
                fontSize: "13px",
              }}
            >
              *
            </span>
            (should be lowercase, no spaces.)
          </span>
        </Label>
        <Input
          style={invalidInput ? { border: "3px solid red" } : {}}
          placeholder="Enter username"
          onChange={(e) => {
            setUserName(e.target.value.toLowerCase().replaceAll(" ", ""));
          }}
          value={userName}
        />
        <Label>Display Name:</Label>
        <Input
          placeholder="Enter display name"
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
        />
        <Label>Bio:</Label>
        <TextArea
          placeholder="Enter bio"
          onChange={(e) => {
            setBio(e.target.value);
          }}
        />

        <Label style={{ marginTop: "4px", marginBottom: "1px" }}>
          Profile Picture:
        </Label>
        <div style={{ height: "fit-content" }}>
          <FieldFileInput onFileSelect={setSelectedFile} />
        </div>
        <Button
          onClick={createUser}
          style={{ width: "100%", marginTop: "25px", marginBottom: "0px" }}
        >
          Register
        </Button>
        <CustomModal open={loading} handleClose={() => {}}>
          <Loader />
          <div style={{ width: "100%", height: "30px" }} />
          <Heading>{modalText}</Heading>
        </CustomModal>
      </MainDiv>
    </Body>
  );
};

export default Index;
