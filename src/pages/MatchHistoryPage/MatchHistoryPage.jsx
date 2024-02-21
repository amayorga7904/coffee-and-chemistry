import { checkToken } from '../../utilities/users-service';

export default function MatchHistoryPage() {
  async function handleCheckToken() {
    const expDate = await checkToken();
    console.log(expDate);
  }
  
  return (
    <>
      <h1>Your Matches</h1>
      <button onClick={handleCheckToken}>Check When My Login Expires</button>
    </>
  );
}