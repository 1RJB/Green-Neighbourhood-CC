import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';

function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  Learning
                </Typography>
              </Link>
              <Link to="/tutorials" ><Typography>Tutorials</Typography></Link>
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} element={<Tutorials />} />
            <Route path={"/tutorials"} element={<Tutorials />} />
            <Route path={"/addtutorial"} element={<AddTutorial />} />
            <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
            <Route path={"/form"} element={<MyForm />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
