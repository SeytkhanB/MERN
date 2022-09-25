
import {useEffect} from 'react';

export default function Dashboard() {

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1')
      const data = await res.json()
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <h1>Dashboard</h1>
    </>
  )
}