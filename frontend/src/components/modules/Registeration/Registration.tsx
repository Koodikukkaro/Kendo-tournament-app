import React, { useState } from "react";
import "./registration.css";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    tel: "",
    password: "",
    passwordConfirmation: "",
    rank: "",
    club: "",
    suomisport: "",
    underage: false,
    guardianEmail: "",
    conditions: false
  });
  const RegistrationAPI = "http://localhost:8080/api/user/register";

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ): void => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  const onHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault(); // Prevent the default form submit behavior
    // mapping state variables to the expected payload keys
    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstname,
      lastName: formData.lastname,
      phoneNumber: formData.tel,
      clubName: formData.club,
      danRank: formData.rank,
      underage: formData.underage,
      guardiansEmail: formData.guardianEmail
    };
    // Perform the API call
    try {
      const response = await fetch(RegistrationAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        // TODO: display success message for 2 second maybe
        console.log(data);
        navigate("/login");
      } else {
        // TODO: display a message to the user
        const errorData = await response.json();
        console.error("Login failed:", errorData);
      }
    } catch (error) {
      // TODO: display a message to the user
      console.error("There was an error registering the user", error);
    }
  };

  return (
    <form id="registerForm" className="form" onSubmit={onHandleSubmit}>
      <h1 className="header">Create a KendoApp account</h1>
      <p className="subtext">
        Already have an account? <a href="url">Log in</a>{" "}
      </p>
      <p className="subtext">
        {" "}
        Fill in the fields below. Fields marked with * are required.
      </p>

      <div className="field">
        <label htmlFor="firstname"></label>
        <input
          type="text"
          name="firstname"
          id="firstname"
          placeholder="First name *"
          required
          value={formData.firstname}
          onChange={(e) => {
            handleInputChange(e, "firstname");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="lastname"></label>
        <input
          type="text"
          name="lastname"
          id="lastname"
          placeholder="Last name *"
          required
          value={formData.lastname}
          onChange={(e) => {
            handleInputChange(e, "lastname");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="username"></label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username *"
          required
          value={formData.username}
          onChange={(e) => {
            handleInputChange(e, "username");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="email"></label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email *"
          required
          value={formData.email}
          onChange={(e) => {
            handleInputChange(e, "email");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="tel"></label>
        <input
          type="tel"
          name="tel"
          id="tel"
          placeholder="Phone number * (e.g. +358...)"
          required
          value={formData.tel}
          onChange={(e) => {
            handleInputChange(e, "tel");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="password"></label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password *"
          required
          value={formData.password}
          onChange={(e) => {
            handleInputChange(e, "password");
          }}
        />
        <i className="fa-solid fa-eye" id="eye" />
      </div>
      <div className="field">
        <br />
        <label htmlFor="passwordConfirmation"></label>
        <input
          type="password"
          name="passwordConfirmation"
          id="passwordConfirmation"
          placeholder="Password again *"
          required
          value={formData.passwordConfirmation}
          onChange={(e) => {
            handleInputChange(e, "passwordConfirmation");
          }}
        />
        <i className="fa-solid fa-eye" id="eye" />
      </div>
      <div className="field">
        <br />
        <label htmlFor="rank"></label>
        <input
          type="text"
          name="rank"
          id="rank"
          placeholder="Rank"
          value={formData.rank}
          onChange={(e) => {
            handleInputChange(e, "rank");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="club"></label>
        <input
          type="text"
          name="club"
          id="club"
          placeholder="Club"
          value={formData.club}
          onChange={(e) => {
            handleInputChange(e, "club");
          }}
        />
      </div>
      <div className="field">
        <br />
        <label htmlFor="suomisport"></label>
        <input
          type="text"
          name="suomisport"
          id="suomisport"
          placeholder="Suomisport ID"
          value={formData.suomisport}
          onChange={(e) => {
            handleInputChange(e, "suomisport");
          }}
        />
      </div>
      <div className="field-checkbox">
        <input
          type="checkbox"
          name="underage"
          id="underage"
          checked={formData.underage}
          onChange={(e) => {
            handleInputChange(e, "underage");
          }}
        />
        <label htmlFor="underage">I&apos;m underage</label>
        {formData.underage && (
          <div className="field">
            <br />
            <label htmlFor="guardianEmail"></label>
            <input
              type="text"
              name="guardianEmail"
              id="guardianEmail"
              placeholder="Guardian's email"
              required
            />
          </div>
        )}
      </div>
      <div className="field-checkbox">
        <input
          type="checkbox"
          name="conditions"
          id="conditions"
          required
          checked={formData.conditions}
          onChange={(e) => {
            handleInputChange(e, "conditions");
          }}
        />
        <label htmlFor="conditions">
          By checking this box I agree to the{" "}
          <a href="url">terms and conditions</a> *
        </label>
      </div>
      <div className="field">
        <button type="submit" id="btnRegister">
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
