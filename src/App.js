import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {Home, CreateRoom, Navigation, Room} from "./components"

function App() {
    return (
        <div className="App">
            <Router>
                <Navigation/>
                <Switch>
                    <Route path="/" exact component={() => <Home/>}/>
                    <Route path="/create" exact component={() => <CreateRoom/>}/>
                    <Route path="/room/:id" exact component={() => <Room/>}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;