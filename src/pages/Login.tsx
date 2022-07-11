// mui
import Container from "@mui/material/Container";
// components
import "../styles.css";
import Signin from "../components/Auth/Signin";

function Login() {
  return (
    <Container sx={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Signin />
    </Container>
  )
}

export default Login