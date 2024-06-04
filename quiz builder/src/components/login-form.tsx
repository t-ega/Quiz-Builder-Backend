import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ApiRequest from "../utils/api-request";
import { ENDPOINTS } from "../utils/endpoints";
import { IComponentProps } from "../utils/interfaces";
import { LoginSchema } from "../utils/validations/auth";

const LoginForm = (props: IComponentProps) => {
  const { displayErrors } = props;
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [user, setuser] = useState(null);

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email: input.email,
      password: input.password,
    };

    const validation = LoginSchema.safeParse(data);
    if (validation.error) {
      const { formErrors, fieldErrors } = validation.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
      return;
    }

    try {
      await ApiRequest.post(ENDPOINTS.LOGIN, validation.data);
      navigate("/");
    } catch (error: any) {
      const message = ApiRequest.extractApiErrors(error);
      displayErrors(message);
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
