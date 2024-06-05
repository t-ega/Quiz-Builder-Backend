import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiRequest from "../utils/api-request";
import { IComponentProps } from "../utils/interfaces";
import { LoginSchema } from "../utils/validations/auth";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api-requests/auth";
import LoadingButton from "./loading-button";

const LoginForm = (props: IComponentProps) => {
  const { displayErrors } = props;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: login,
  });

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = LoginSchema.safeParse({ email, password });
    if (validation.error) {
      const { formErrors, fieldErrors } = validation.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
      return;
    }

    loginMutation.mutate(
      {
        email: validation.data.email,
        password: validation.data.password,
      },
      {
        onSuccess: () => navigate("/"),
        onError: (error) => {
          const message = ApiRequest.extractApiErrors(error);
          displayErrors(message);
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmitEvent}>
        <div className="form">
          <div>
            <div className="entry">
              <label className="">Email</label>
              <input
                className="input-control"
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="forgot-password">
              <Link to="">Forgot password?</Link>
            </p>
            {loginMutation.isPending ? (
              <LoadingButton />
            ) : (
              <button className="btn">Login</button>
            )}
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
