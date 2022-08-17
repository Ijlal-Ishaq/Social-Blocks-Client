import { styled, alpha } from "@mui/system";
import { FC, useState } from "react";
import { create } from "ipfs-http-client";
import FieldFileInput from "../../../../components/FieldFileInput";
import Button from "../../../../components/Button";
import { updateAccount } from "../../../../utils/contractMethods";
import CustomModal from "../../../../components/CustomModal";
import Loader from "../../../../components/Loader";
import { useAppSelector } from "../../../../hooks";
import { useWeb3React } from "@web3-react/core";

const Container = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  padding: "30px 20px",
  overflowY: "auto",

  "::-webkit-scrollbar": {
    width: "7px",
    background: alpha(theme.palette.primary.main, 0.1),
  },

  "::-webkit-scrollbar-thumb": {
    borderRadius: "3px",
    background: theme.palette.primary.main,
    height: "100px",
  },

  [theme.breakpoints.down("sm")]: {
    "::-webkit-scrollbar": {
      width: "7px",
      background: alpha(theme.palette.primary.main, 0.1),
      display: "none",
    },
  },
}));

const Heading = styled("div")(({ theme }) => ({
  fontSize: "17px",
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
  marginBottom: "5px",
}));

const Input = styled("input")(({ theme }) => ({
  fontSize: "17px",
  fontWeight: "500",
  color: theme.palette.text.primary,
  margin: "5px 0px",
  marginTop: "0px",
  padding: "7px 14px",
  width: "100%",
  backgroundColor: theme.palette.background.default,
  border: "solid 2px " + alpha(theme.palette.text.primary, 0.5),
  borderRadius: "5px",
}));

const TextArea = styled("textarea")(({ theme }) => ({
  fontSize: "17px",
  fontWeight: "500",
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

  "::-webkit-scrollbar": {
    width: "5px",
    background: alpha(theme.palette.primary.main, 0.1),
  },

  "::-webkit-scrollbar-thumb": {
    borderRadius: "5px",
    background: theme.palette.primary.main,
  },
}));

type Prop = {
  image: string;
  displayName: string;
  bio: string;
  username: string;
  handleClose: () => void;
  reloadData: () => void;
};

const Index: FC<Prop> = (props) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [image] = useState(props.image);
  const [displayName, setDisplayName] = useState(props.displayName);
  const [bio, setBio] = useState(props.bio);
  const [loading, setLoading] = useState<boolean>(false);
  const { account } = useWeb3React();

  const contract = useAppSelector((state) => state.contractReducer.contract);

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

  async function updateUser() {
    if (!account) {
      alert("Connect Wallet!");
      return;
    }
    setLoading(true);
    try {
      const img = selectedFile ? await uploadToIPFS() : image;

      console.log("img", img, props.username, displayName, bio);

      await updateAccount(
        [props.username, displayName, bio, img],
        account,
        contract,
        () => {
          props.reloadData();
          setLoading(false);
          props.handleClose();
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container>
      <Heading style={{ fontSize: "30px" }}>Edit Profile</Heading>
      <div
        style={{
          width: "115px",
          height: "115px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <FieldFileInput
          onFileSelect={setSelectedFile}
          previewImage={image}
          circleShape={true}
        />
      </div>
      <Label style={{ marginTop: "20px" }}>Display Name</Label>
      <Input
        placeholder="Enter display name"
        value={displayName}
        onChange={(e) => {
          setDisplayName(e.target.value);
        }}
      />
      <Label>Bio</Label>
      <TextArea
        placeholder="Enter bio"
        value={bio}
        onChange={(e) => {
          setBio(e.target.value);
        }}
      />
      <Button onClick={updateUser}>Submit</Button>
      <CustomModal open={loading} handleClose={() => {}}>
        <Loader />
        <div style={{ width: "100%", height: "30px" }} />
        <Heading>Editing Profile</Heading>
      </CustomModal>
    </Container>
  );
};

export default Index;
