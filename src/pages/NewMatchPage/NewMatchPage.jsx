import { useState } from "react";
import { getToken, getUser } from '../../utilities/users-service'
import axios from "axios";

const ACCOUNTS_URL = '/api/accounts/public'

export default function NewMatchPage() {
  const [accounts, setAccounts] = useState([])

  const getAccounts = async () => {
    try {
      const token = getToken()
      const currentUser = getUser()
      const response = await axios.get(`${ACCOUNTS_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setAccounts(response.data)
    } catch (error) {
      console.log('accounts not reached', error)
    }
  }

    return (
      <>
      <h1>Discover New Chemistry</h1>
        <ul>
          {accounts.map((account) => (
            <li key={account._id}>
              {account.name}
            </li>
          ))}
        </ul>
      </>
    );
  }