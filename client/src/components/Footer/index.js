import { useContext } from "react";
import UserContext from "../../utils/UserContext";

const Footer = () => {
  const { user } = useContext(UserContext);
  return (
    <div>
      {user.name} - {user.email}
    </div>
  );
};

export default Footer;
