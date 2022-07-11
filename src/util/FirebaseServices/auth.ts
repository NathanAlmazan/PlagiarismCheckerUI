import app from "./instance";
import { getAuth } from "firebase/auth";

const firebaseAuth = getAuth(app);

export default firebaseAuth;