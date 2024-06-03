import React, { useState } from "react";
import { ENDPOINTS } from "../utils/endpoints";
import ApiRequest from "../utils/api-request";
import ErrorCard from "./error-card";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  const [error, seterror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([""]);

  const [input, setInput] = useState({
    email: "",
    companyName: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email: input.email,
      password: input.password,
      username: input.companyName,
    };

    if (input.email !== "" && input.password !== "") {
      try {
        const response = await ApiRequest.post(ENDPOINTS.SIGNUP, data);
        const userData = response.data.user;
        return userData;
      } catch (error: any) {
        if (error.response && error.response.data) {
          const { errors } = error.response.data;
          seterror(true);
          setErrorMessages(errors || []);

          setTimeout(() => {
            seterror(false);
            setErrorMessages([]);
          }, 10000);
        } else {
          setErrorMessages(["An error occurred during signup."]);
        }
        return;
      }
    }
    alert("please provide a valid input");
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      {error && errorMessages && (
        <ErrorCard message={"An error occured"} errors={errorMessages} />
      )}
      <form onSubmit={handleSubmitEvent}>
        <div className="form">
          <div>
            <div className="entry">
              <label className="">Email</label>
              <input
                className="input-control"
                type="text"
                name="email"
                onChange={handleInput}
                value={input.email}
                placeholder="johndoe@gmail.com"
              />
            </div>
            <div className="entry">
              <label className="">
                Company Name(Displayed when sending your quiz)
              </label>
              <input
                className="input-control"
                type="text"
                name="companyName"
                onChange={handleInput}
                value={input.companyName}
                placeholder="Neuron Tech"
              />
            </div>
            <div className="entry">
              <label className="">Password</label>
              <input
                className="input-control"
                type="password"
                name="password"
                onChange={handleInput}
                value={input.password}
                placeholder="***************"
              />
            </div>
            <div className="entry">
              <label className="">Password Confrimation</label>
              <input
                className="input-control"
                type="password"
                name="passwordConfirmation"
                onChange={handleInput}
                value={input.passwordConfirmation}
                placeholder="***************"
              />
            </div>
            <button className="btn">Sign Up</button>
          </div>
          <div>
            Have an account? <Link to="/auth/login">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
