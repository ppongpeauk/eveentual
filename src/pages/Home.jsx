import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <p>home</p>
    </>
  )
}