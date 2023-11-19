import React, { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Container,
  Typography
} from "@mui/material";
import "../../common/Style/common.css";
import "./profile.css";
import Footer from "components/common/Footer/Footer";
// import {UserService} from "../../../../../backend/server/src/controllers/userController";

interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  tel: string;
  nationality: string;
  inNationalTeam: boolean;
  club: string;
  rank: string;
  suomisport: string;
}
interface Password {
  password: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    /* fetch calls for info, just now some example data */
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    tel: "",
    nationality: "",
    inNationalTeam: false,
    club: "",
    rank: "",
    suomisport: ""
  });

  const [userPassword, setUserPassword] = useState<Password>({
    password: "Foobar123",
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: ""
  });

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        /*
        const userId = "123";
        const userData = await UserService.getUserById(userId);

        const mappedUserData: UserProfile = {
          firstname: userData.firstName,
          lastname: userData.lastName,
          email: userData.email,
          username: userData.userName,
          tel: userData.phoneNumber,
          nationality: userData.nationality,
          inNationalTeam: userData.inNationalTeam,
          club: userData.clubName,
          rank: userData.danRank,
          suomisport: userData.suomisport
        };
        */

        const mappedUserData: UserProfile = {
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@gmail.com",
          username: "KendoMaster123",
          tel: "0401234567",
          nationality: "FIN",
          inNationalTeam: true,
          club: "Seinäjoki Kendo Club",
          rank: "someRank",
          suomisport: "1234567"
        };

        setUserProfile(mappedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    void fetchUserData();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ): void => {
    const target = event.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    if (
      value === "oldPassword" ||
      value === "newPassword" ||
      value === "newPasswordConfirmation"
    ) {
      setUserPassword((prevData) => ({
        ...prevData,
        [fieldName]: value
      }));
    } else {
      setUserProfile((prevData) => ({
        ...prevData,
        [fieldName]: value
      }));
    }
  };

  const handlePasswordChange = (): void => {
    /* TODO:
    -check if newPassword and newPasswordConfirmation match
    -check if oldPassword and user password match
    -error message if not all fields filled
    -saving newPassword to users password field */
  };

  const handleSavingProfile = (): void => {
    /* update user info */
  };

  const handleGoBack = (): void => {
    /* go back to the previous page */
    /* TODO: add a question if really want to leave for a case where changed data but click back */
  };

  return (
    <Container component="main" maxWidth="xs">
      <form id="profileForm" className="form">
        <Typography variant="h5" className="header" fontWeight="bold">
          Edit your info
        </Typography>
        <div>
          <TextField
            label="First Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.firstname}
            onChange={(e) => {
              handleInputChange(e, "firstname");
            }}
          />
          <br />
          <TextField
            label="Last Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.lastname}
            onChange={(e) => {
              handleInputChange(e, "lastname");
            }}
          />
          <br />
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.username}
            onChange={(e) => {
              handleInputChange(e, "username");
            }}
          />
          <br />
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.email}
            onChange={(e) => {
              handleInputChange(e, "email");
            }}
          />
          <br />
          <TextField
            label="Tel"
            type="tel"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.tel}
            onChange={(e) => {
              handleInputChange(e, "tel");
            }}
          />
          <br />
          <TextField
            label="Nationality"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.nationality}
            onChange={(e) => {
              handleInputChange(e, "nationality");
            }}
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={userProfile.inNationalTeam}
                onChange={(e) => {
                  handleInputChange(e, "inNationalTeam");
                }}
                name="inNationalTeam"
                id="inNationalTeam"
              />
            }
            label="I'm in the maajoukkuerinki"
          />
          <br />
          <TextField
            label="Club"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.club}
            onChange={(e) => {
              handleInputChange(e, "club");
            }}
          />
          <br />
          <TextField
            label="Rank"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.rank}
            onChange={(e) => {
              handleInputChange(e, "rank");
            }}
          />
          <br />
          <TextField
            label="Suomisport ID"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userProfile.suomisport}
            onChange={(e) => {
              handleInputChange(e, "suomisport");
            }}
          />
          <br />
          <Button id="button" variant="contained" onClick={handleGoBack}>
            Back
          </Button>
          <Button id="button" variant="contained" onClick={handleSavingProfile}>
            Save changes
          </Button>
        </div>
        <br />
        <p className="subtext">Change password</p>
        <div>
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={userPassword.oldPassword}
            required
            onChange={(e) => {
              handleInputChange(e, "oldPassword");
            }}
          />
          <br />
          <TextField
            label="New Password"
            type="password"
            value={userPassword.newPassword}
            required
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => {
              handleInputChange(e, "newPassword");
            }}
          />
          <br />
          <TextField
            label="Confirm New Password"
            type="password"
            value={userPassword.newPasswordConfirmation}
            required
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => {
              handleInputChange(e, "newPasswordConfirmation");
            }}
          />
        </div>
        <Button id="buttonpw" onClick={handlePasswordChange}>
          Change password
        </Button>
      </form>
      <br />
      <Footer />
    </Container>
  );
};

export default Profile;
