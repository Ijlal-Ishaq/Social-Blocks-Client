import { FC, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "../../../components/Button";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useTheme } from "@emotion/react";

const MainDiv = styled("div")(({ theme }) => ({
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

const Heading = styled("div")(({ theme }) => ({
  fontSize: "25px",
  fontWeight: "700",
  color: theme.palette.text.primary,
  textAlign: "center",
  marginBottom: "15px",
}));

const RadioIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 20,
  height: 20,
  border: "solid 2px " + theme.palette.text.primary,
  margin: "4px",
}));

const RadioCheckIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 20,
  height: 20,
  backgroundColor: theme.palette.primary.main,
  border: "solid 2px " + theme.palette.text.primary,
  margin: "4px",
}));

const Index: FC<any> = (props) => {
  const [status, setStatus] = useState("2");
  const [price, setPrice] = useState("");
  const theme = useTheme();
  const [bidDuration, setBidDuration] = useState<number>(0);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus((event.target as HTMLInputElement).value);
  };

  return (
    <MainDiv>
      <Heading>Change Status &#38; Price.</Heading>
      <Label>Title :</Label>
      <Heading
        style={{ textAlign: "left", fontWeight: "700", fontSize: "23px" }}
      >
        {props?.title}
      </Heading>
      <Label>Description :</Label>
      <Heading
        style={{ textAlign: "left", fontWeight: "500", fontSize: "17px" }}
      >
        ~&nbsp;{props?.description}
      </Heading>

      <Label>Status :</Label>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={status}
        onChange={handleStatusChange}
      >
        <FormControlLabel
          value="2"
          control={
            <Radio
              icon={<RadioIcon />}
              checkedIcon={<RadioCheckIcon />}
              sx={{
                "&:hover": {
                  bgcolor: "transparent",
                },
                //@ts-ignore
                color: theme.palette.text.primary,
                "&.Mui-checked": {
                  //@ts-ignore
                  color: theme.palette.primary.main,
                },
              }}
              disableRipple
            />
          }
          label="Not For Sale"
        />
        <FormControlLabel
          value="1"
          control={
            <Radio
              icon={<RadioIcon />}
              checkedIcon={<RadioCheckIcon />}
              sx={{
                "&:hover": {
                  bgcolor: "transparent",
                },
                //@ts-ignore
                color: theme.palette.text.primary,
                "&.Mui-checked": {
                  //@ts-ignore
                  color: theme.palette.primary.main,
                },
              }}
              disableRipple
            />
          }
          label="Biddable"
        />
        <FormControlLabel
          value="0"
          control={
            <Radio
              icon={<RadioIcon />}
              checkedIcon={<RadioCheckIcon />}
              sx={{
                "&:hover": {
                  bgcolor: "transparent",
                },
                //@ts-ignore
                color: theme.palette.text.primary,
                "&.Mui-checked": {
                  //@ts-ignore
                  color: theme.palette.primary.main,
                },
              }}
              disableRipple
            />
          }
          label="Buyable"
        />
      </RadioGroup>
      {status === "0" && (
        <>
          <Label>Price (Eth) :</Label>
          <Input
            placeholder="Enter price."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
          />
        </>
      )}
      {status === "1" && (
        <>
          <Label>Base Price (Eth) :</Label>
          <Input
            placeholder="Enter base price."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
          />
          <Label>Bidding Duration (days) :</Label>
          <Input
            placeholder="Bidding duration in days."
            value={bidDuration ? bidDuration : 0}
            onChange={(e) => setBidDuration(parseInt(e.target.value))}
            type="number"
          />
        </>
      )}
      <Button
        style={{ width: "100%", marginTop: "25px", marginBottom: "0px" }}
        onClick={() => {
          props.changeStatus(status, price, bidDuration);
        }}
      >
        Sumbit Changes
      </Button>
    </MainDiv>
  );
};

export default Index;
