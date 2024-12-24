import { ListItemButton, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";

function ListItemLink(props: any) {
  const { icon, name, href, sx } = props;
  return (
    <Link to={href} style={{ textDecoration: "none", color: "black" }}>
      <ListItemButton sx={sx}>
        <ListItemIcon>{icon}</ListItemIcon>
        <div
          style={{
            width: 160,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
      </ListItemButton>
    </Link>
  );
}

export default ListItemLink;
