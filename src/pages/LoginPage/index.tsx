import React, { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput";
import { observer } from "mobx-react-lite";
import User from "../../mobx/user";
import { useHistory } from "react-router-dom";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import { gapi } from "gapi-script";
const clientId =
  "100816583468-qr2j2edfsofd3mor6lk9prnqbuqu7a1d.apps.googleusercontent.com";
const Login = observer(() => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleSubmit = () => {
    //fetching is done here
    if (email === "admin" && password === "1234512345") {
      User.assignUser({
        surname: "adminov",
        name: "admin",
        id: 123,
        isAuth: true,
      });
    }
    console.log(User);
    history.push(User.pageToRedirect);
    User.pageToRedirect = "/";
  };

  const onSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ): void => {
    console.log(response);
    if ("profileObj" in response) {
      User.assignUser({
        surname: response?.profileObj?.familyName,
        name: response?.profileObj?.givenName,
        id: 123,
        isAuth: true,
      });
    }
  };
  const onLogoutSuccess = () => {
    console.log("logout success");
    User.logOutUser();
  };
  const onFailure = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ): void => {
    console.log(response);
  };

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", start);
  }, []);
  return (
    <div className={"tw-flex tw-justify-center"}>
      <div
        className={
          "tw-my-20 tw-border tw-drop-shadow-md tw-border-secondary tw-h-96 tw-w-1/2 tw-rounded"
        }
      >
        <div
          className={
            "tw-flex-col tw-flex tw-justify-center tw-items-center tw-h-full"
          }
        >
          <div className={"tw-font-bold tw-text-3xl"}>Log In</div>
          <CustomInput
            setValue={setEmail}
            topText={"E-Mail"}
            placeholder={"Email"}
          />
          <CustomInput
            setValue={setPassword}
            topText={"Password"}
            placeholder={"Password"}
          />
          <button
            onClick={onHandleSubmit}
            className={
              "tw-w-1/2 tw-bg-main tw-text-white tw-h-12 tw-rounded-2xl tw-mt-4"
            }
          >
            Confirm
          </button>
          <div className={"tw-mt-4"}>
            Dont have an account?{" "}
            <button
              className={"tw-text-main"}
              onClick={() => {
                history.push("/signup");
              }}
            >
              Sign up
            </button>
            <GoogleLogin
              clientId={clientId}
              buttonText={"Login"}
              onSuccess={onSuccess}
              onFailure={onFailure}
              isSignedIn={true}
              cookiePolicy={"single_host_origin"}
            />
            <GoogleLogout
              clientId={clientId}
              buttonText={"logout"}
              onLogoutSuccess={onLogoutSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Login;
