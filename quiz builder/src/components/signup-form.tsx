import React, { useState } from "react";

const SignUpForm = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.email !== "" && input.password !== "") {
      //dispatch action from hooks
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
          Have an account? <a href="/auth/login">Login</a>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
