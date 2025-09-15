import React from "react";
import {HashRouter} from "react-router-dom";
import AppRouter from "./routes/App-Routes.js";
import { AuthProvider } from "./services/AuthProvider.js";
import { ThemeProvider } from "./components/darkMode/ThemeProvider.js";
import { TranslationProvider } from "./services/TranslationProvider.js";

import './styles/main.css';

function App() {
    return (
        <TranslationProvider>
            <AuthProvider>
                <ThemeProvider>
                    <HashRouter>
                        <AppRouter/>
                    </HashRouter>
                </ThemeProvider>
            </AuthProvider>
        </TranslationProvider>

    );
}

export default App;