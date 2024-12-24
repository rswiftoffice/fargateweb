import {useEffect, useState} from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import useLocalStorage from "core/hooks/useLocalStorage";
import {
  AuthenticatedUser,
  getCurrentUser,
  setCurrentRole,
  setLogin,
} from "modules/login/loginSlice";
import { setTokenToRequests } from "api";
import { UserRoles } from "core/types/db-enum";

function PrivateRoute({ children }: { children: JSX.Element }) {
  let location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [isDispatching, setIsDispatching] = useState(false);
  const [accessToken, setAccessToken] = useLocalStorage<string>(
    "access_token",
    ""
  );
  const navigate = useNavigate();
  const [savedCurrentRole, setSavedCurrentRole] =
    useLocalStorage<UserRoles | null>("current_role", null);

  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );

  // useEffect(() => {
  //   setIsDispatching(true)
    if (location.pathname === "/auth/microsoft/success") {
      const params = new URLSearchParams(location.search);
      const msAccessToken = params.get("access_token");
      if (msAccessToken) {
        setAccessToken(msAccessToken);
      }
    }
    if (accessToken && !currentUser) {
      setTokenToRequests(accessToken);
      dispatch(getCurrentUser())
        .unwrap()
        .then((user: AuthenticatedUser) => {
          dispatch(setLogin(true));
          if (user?.roles?.length) {
            if (!savedCurrentRole || !user.roles.includes(savedCurrentRole)) {
              setSavedCurrentRole(user.roles[0]);
              dispatch(setCurrentRole(user.roles[0]));
            } else {
              dispatch(setCurrentRole(savedCurrentRole));
            }
          }
          if (location.pathname === "/auth/microsoft/success") {
            window.location.href="/dashboard";
          }
        })
        .catch((e) => {
          dispatch(setLogin(false));
          navigate("/login");
        });
    }
  //   setIsDispatching(false)
  // }, [
  //   dispatch,
  //   accessToken,
  //   currentUser,
  //   navigate,
  //   savedCurrentRole,
  //   setSavedCurrentRole,
  //   location.pathname,
  //   location.search,
  //   setAccessToken,
  // ]);


  if (currentUser) {
    return children;
  }
  if (!accessToken && !isDispatching) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <></>;
}

export default PrivateRoute;
