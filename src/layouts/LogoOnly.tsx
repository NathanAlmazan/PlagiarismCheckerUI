import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

function LogoOnly() {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%'
      }}
    >
      <Outlet />
    </Box>
  )
}

export default LogoOnly