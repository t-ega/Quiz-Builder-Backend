import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ApiRequest from "../utils/api-request";
import { ENDPOINTS } from "../utils/endpoints";
import ErrorCard from "./error-card";

const LoginForm = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [error, seterror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([""]);
  const [user, setuser] = useState(null);

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email: input.email,
      password: input.password,
    };
    // TODO: Use Zod for data validation.
    if (input.email !== "" && input.password !== "") {
      try {
        const response = await ApiRequest.post(ENDPOINTS.LOGIN, data);
        // TODO: Store in redux store.
        const userData = response.data.username;
        setuser(userData);
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
      {user && <Navigate to={"/"} />}
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
              <label className="">Password</label>
              <input
                className="input-control"
                type="password"
                placeholder="***************"
                name="password"
                value={input.password}
                onChange={handleInput}
              />
            </div>
            <p className="forgot-password">
              <Link to="">Forgot password?</Link>
            </p>

            <button className="btn">Login</button>
          </div>
          <div>
            Are you new? <Link to="/auth/signup">Create an Account</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
