import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/style.css";
import MainPage from './Components/MainPage';

class App extends Component {
    render() {
        return (
            <div>
            <Router>
                <div>
                    <nav className="navbar navbar-dark bg-dark">
                        <div className="navbar-nav mr-auto nav">
                            <li className="nav-item">
                                <Link to={"/"} className="nav-link">
                                    <img src='/android-chrome-192x192.png' alt='logo' className='logo-image' />
                                    <span className='ml-2 mr-2 font-weight-bold'>Hooks Temp Email Service</span>
                                </Link>
                            </li>
                        </div>
                    </nav>
                    </div>
                    <div className="container mt-3">
                        <Switch>
                            <Route exact path='/' component={MainPage} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
