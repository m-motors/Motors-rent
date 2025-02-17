import "../styles/register.css";
import DropdownMenu from "../components/common/DropdownMenu";

function Register() {
  return (
    <div>
      <DropdownMenu />
      <form id="registerForm">
        FirstName :
        <input type="text" id="name" placeholder="Name" required />
        LastName :
        <input type="text" id="lastname" placeholder="Lastname" required />
        email : <input type="email" id="email" placeholder="Email" required />
        password :
        <input type="password" id="password" placeholder="Password" required />
        confirm password :
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
