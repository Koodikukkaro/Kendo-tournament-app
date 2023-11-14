import React, { useState } from "react";
import { TextField, Checkbox, Button, FormControlLabel } from "@mui/material";

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
  });

  const [userPassword, setUserPassword] = useState<Password>({
    password: "Foobar123",
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: ""
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ): void => {
    const target = event.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setUserProfile((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const handlePasswordChange = (): void => {
    /* TODO:
    -check if newPassword and newPasswordConfirmation match
    -check if oldPassword and password match
    -error message is not all field filled
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
    <div>
      <p className="subtext">Edit your info</p>
      <div>
        <TextField
          label="First Name"
          value={userProfile.firstname}
          onChange={(e) => {
            handleInputChange(e, "firstname");
          }}
        />
      </div>
      <div>
        <TextField
          label="Last Name"
          value={userProfile.lastname}
          onChange={(e) => {
            handleInputChange(e, "lastname");
          }}
        />
      </div>
      <div>
        <TextField
          label="Username"
          value={userProfile.username}
          onChange={(e) => {
            handleInputChange(e, "username");
          }}
        />
      </div>
      <div>
        <TextField
          label="Email"
          type="email"
          value={userProfile.email}
          onChange={(e) => {
            handleInputChange(e, "email");
          }}
        />
      </div>
      <div>
        <TextField
          label="Tel"
          type="tel"
          value={userProfile.tel}
          onChange={(e) => {
            handleInputChange(e, "tel");
          }}
        />
      </div>
      <div>
        <TextField
          label="Nationality"
          value={userProfile.nationality}
          onChange={(e) => {
            handleInputChange(e, "nationality");
          }}
        />
      </div>
      <div>
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
      </div>
      <div>
        <TextField
          label="Club"
          placeholder="Club"
          value={userProfile.club}
          onChange={(e) => {
            handleInputChange(e, "club");
          }}
        />
      </div>
      <div>
        <TextField
          label="Rank"
          placeholder="Rank"
          value={userProfile.rank}
          onChange={(e) => {
            handleInputChange(e, "rank");
          }}
        />
      </div>
      <div>
        <TextField
          label="Suomisport ID"
          placeholder="Suomisport ID"
          value={userProfile.suomisport}
          onChange={(e) => {
            handleInputChange(e, "suomisport");
          }}
        />
      </div>
      <div>
        <Button
          variant="contained"
          onClick={handleGoBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSavingProfile}
        >
          Save changes
        </Button>
      </div>
      <br />
      <p className="subtext">Change password</p>
      <div>
        <TextField
          label="Old Password"
          type="password"
          value={userPassword.oldPassword}
          required
          onChange={(e) => {
            handleInputChange(e, "oldPassword");
          }}
        />
      </div>
      <div>
        <TextField
          label="New Password"
          type="password"
          value={userPassword.newPassword}
          required
          onChange={(e) => {
            handleInputChange(e, "newPassword");
          }}
        />
      </div>
      <div>
        <TextField
          label="Confirm New Password"
          type="password"
          value={userPassword.newPasswordConfirmation}
          required
          onChange={(e) => {
            handleInputChange(e, "newPasswordConfirmation");
          }}
        />
      </div>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePasswordChange}
      >
        Change password
      </Button>
    </div>
  );
};

export default Profile;
