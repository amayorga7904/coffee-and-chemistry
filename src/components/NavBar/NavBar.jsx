import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';
import Nav from 'react-bootstrap/Nav';

export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <Nav fill variant="tabs" defaultActiveKey="/matches/new">
      <Nav.Item>
        <Nav.Link href="/matches/new">ℂ&ℂ</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/matches">Matches</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/messages">Messages</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/profile">Profile</Nav.Link>
      </Nav.Item>
      <span>Welcome, {user.name}!</span>
      <Nav.Item>
        <Nav.Link href="" onClick={handleLogOut}>
          Log Out
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
