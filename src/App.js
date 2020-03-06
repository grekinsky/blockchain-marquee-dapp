import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/shared/NavBar';
import Box from '@material-ui/core/Box';
import Home from './components/home/Home';

function App() {
    return (
        <Router>
            <div>
                <NavBar />
                <Box m={3}>
                    <Home />
                </Box>
            </div>
        </Router>
    );
}

export default App;
