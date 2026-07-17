import "./App.css";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ChallengeView from "./pages/challenge-view.jsx";
import HomePage from "./pages/home-page.jsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/:home?" element={<HomePage />}>
                    <Route path="/:home?/challenges" element={<div>TESTING PAGE 2</div>}/>
                    <Route path="/:home?/about" element={<div>TESTING PAGE 3</div>}/>
                    <Route path="/:home?/more" element={<div>TESTING PAGE 4</div>}/>
                </Route>

                <Route path="/challenge/*" element={<ChallengeView />} />
            </Routes>
        </Router>

    );
}

export default App;
