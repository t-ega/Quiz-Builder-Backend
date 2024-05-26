import React from "react";

const LoginForm = () => {
  return (
    <div className="login">
      <div>
        <div className="entry">
          <label className="">Email</label>
          <input
            className="input-control"
            type="text"
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="entry">
          <label className="">Password</label>
          <input
            className="input-control"
            type="password"
            placeholder="***************"
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
  );
};

export default LoginForm;
