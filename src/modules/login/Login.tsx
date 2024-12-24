import React, {ChangeEvent, useState, useMemo, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate, useLocation} from 'react-router-dom';
import {AppDispatch, RootState} from '../../store';
import LoginForm from './layouts/LoginForm';
import {login, loginViaMicrosoft} from './loginSlice';
import { string } from "yup";
import useLocalStorage from "core/hooks/useLocalStorage";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogined = useSelector((state: RootState) => state.login.isLogined);
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useLocalStorage<string>(
    "access_token",
    ""
  );
  const from = useMemo(() => {
    // @ts-ignore
    return location.state ? location.state.from?.pathname : "/";
  }, [location]);

  useEffect(() => {
    if (isLogined) {
      // navigate("/dashboard", { replace: true });
      window.location.href='/dashboard';
    }
  }, [isLogined, navigate, from]);

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onDefaultLoginButtonClick = async () => {
    const schema = string().email("Invalid Email");
    try {
      schema.validateSync(email);
      const response = await dispatch(login({ email, password })).unwrap();
      setAccessToken(response.access_token);
    } catch (error: any) {
      console.error("LOGIN: ", error);
      setEmailErrorMessage(error.message);
    }
  };
  const onMicrosoftLoginButtonClick = () => {
    dispatch(loginViaMicrosoft());
  };
  return (
    <LoginForm
      email={email}
      emailErrorMessage={emailErrorMessage}
      password={password}
      onEmailChange={onEmailChange}
      onPasswordChange={onPasswordChange}
      onDefaultLoginButtonClick={onDefaultLoginButtonClick}
      onMicrosoftLoginButtonClick={onMicrosoftLoginButtonClick}
    />
  );
}

export default Login;
