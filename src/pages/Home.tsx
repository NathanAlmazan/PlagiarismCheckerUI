import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';
import { useAuth } from "../hocs/AuthProvider";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.teacher) navigate("/teacher/app");
      else if (user.student) navigate("/student/app");
    }
  }, [user, navigate])

  return (
    <Box sx={{ 
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
     }}>
        <img src="https://swingsearch.com/wp-content/uploads/2020/02/cropped-logo-new-p.png" alt="LOGO" style={{ width: 100, height: 100 }} />
        <Box sx={{ width: 120, mt: 3 }}>
            <LinearProgress />
        </Box>
    </Box>
  )
}

export default Home