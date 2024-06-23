import "./App.css";
import UserContext from "./Components/Context/Context.jsx";
// import ToggleColorMode from "./Components/ToggleColorMode.jsx";
import Views from "./Components/Views.jsx";

function App() {
  return (
    <UserContext>
      <Views />
      {/* <ToggleColorMode /> */}
    </UserContext>
  );
}

export default App;
