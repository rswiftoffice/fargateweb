import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppDrawer from "./Drawer";

const MainLayout = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("");
  const onMenuItemClick = (menuKey: string) => {
    setSelectedMenu(menuKey);
    navigate(`${menuKey}`);
  };
  return (
    <>
      <AppDrawer onMenuItemClick={onMenuItemClick} />
    </>
  );
};

export default MainLayout;
