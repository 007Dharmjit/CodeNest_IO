import CodeEditorProvider from "./context/CodeEditorContext.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Loginform from "./components/Auth/Loginform.jsx";
import SignupForm from "./components/Auth/SignupForm.jsx";
import Layout from "./Pages/Layout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Editor from "./Pages/Editor.jsx";
import Problem from "./Pages/Problemset.jsx";
import ProblemDescription from "./Pages/ProblemDescription";
import { ToastContainer } from "react-toastify";
import FoldersDetail from "./Pages/FoldersDetail.jsx";
import Account from "./Pages/Account.jsx";
import AddFriends from "./Pages/AddFriends.jsx";
import FriendContextProvider from "./context/FriendContext.jsx";
import MessagePage from "./Pages/Message.jsx";
import Myproblems from "./Pages/Myproblems.jsx";
const App = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      <CodeEditorProvider>
        <AuthProvider>
          <FriendContextProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/Account" element={<Account />} />
                  <Route path="/problemset" element={<Problem />} />
                  <Route path="/Editor" element={<Editor />} />
                  <Route path="/Folder" element={<FoldersDetail />} />
                  <Route path="/addfriends" element={<AddFriends />} />
                  <Route path="/MessagePage" element={<MessagePage />} />
                  <Route path="/:username/problems" element={<Myproblems />} />
                </Route>
                <Route
                  path="/problemset/:problemTitle/description"
                  element={<ProblemDescription />}
                />

                <Route path="/SignupForm" element={<SignupForm />} />
                <Route path="/Loginform" element={<Loginform />} />
              </Routes>
            </BrowserRouter>
          </FriendContextProvider>
        </AuthProvider>
      </CodeEditorProvider>
    </>
  );
};

export default App;
