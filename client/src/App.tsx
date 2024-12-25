import "./App.css";
import Chat from "./components/Chat";
import { Route, Routes } from "react-router-dom";
import Form from "./components/Form";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
