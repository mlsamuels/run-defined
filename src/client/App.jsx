import "./App.css";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ChallengeView from "./pages/challenge-view.jsx";
import HomePage from "./pages/home-page.jsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/:home?" element={<HomePage />}>
                    <Route path="/:home?/hi" element={<div>TESTING</div>}/>
                </Route>

                <Route path="/challenge/*" element={<ChallengeView />} />
            </Routes>
        </Router>

    );
}

export default App;
