import "./App.css";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ChallengeView from "./pages/challenge-view.jsx";
import HomePage from "./pages/home-page/home-page.jsx";
import HomeHomePage from "./pages/home-page/home-home-page.jsx";
import HomeChallengesPage from "./pages/home-page/home-challenges-page.jsx";
import HomeAboutPage from "./pages/home-page/home-about-page.jsx";
import HomeMorePage from "./pages/home-page/home-more-page.jsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/:home?" element={<HomePage />}>
                    <Route path="/:home?" element={HomeHomePage()}/>
                    <Route path="/:home?/challenges" element={HomeChallengesPage()}/>
                    <Route path="/:home?/about" element={HomeAboutPage()}/>
                    <Route path="/:home?/more" element={HomeMorePage()}/>
                </Route>

                <Route path="/challenge/*" element={<ChallengeView />} />
            </Routes>
        </Router>

    );
}

export default App;
