import React, { ChangeEvent, useState } from "react";

const LoginForm = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleSubmitEvent = (e: SubmitEvent) => {
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
    <form action="">
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
            <a href="">Forgot password?</a>
          </p>

          <button className="btn">Login</button>
        </div>
        <div>
          Are you new? <a href="">Create an Account</a>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
