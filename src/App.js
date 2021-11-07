import { useState } from "react";
import GoogleLogin from "react-google-login";
import "./App.css";
import axios from "axios";
const info = JSON.parse(localStorage.getItem("userInfo"));
function App() {
  console.log(info);
  const [userInfo, setUserInfo] = useState(info || {});
  const handleSuccess = async (userData) => {
    try {
      axios
        .post(
          `${process.env.REACT_APP_BASEPATH}/api/google-login`,
          { token: userData.tokenId },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          localStorage.setItem("userInfo", JSON.stringify(response.data));
          setUserInfo(response.data);
        });
    } catch (error) {}
  };
  const handleFailure = (data) => {
    alert(data);
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUserInfo({});
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React google login</h1>
      </header>
      {Object.keys(userInfo).length ? (
        <div className="App-content">
          <h3>You are logged in as: {userInfo.email}</h3>
          <button className="logout-btn" onClick={logoutHandler}>
            Log out
          </button>
        </div>
      ) : (
        <GoogleLogin
          buttonText="Login with Google"
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
          cookiePolicy={"single_host_origin"}
        ></GoogleLogin>
      )}
    </div>
  );
}

export default App;
