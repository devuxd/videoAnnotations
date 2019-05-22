import Link from 'next/link'

export default function About() {
    return (
      <div>
        <Link href="index">
           <a>Click here for client side navigation</a> 
        </Link> 
        <a href="/index">Click her for server side navigation </a>
        <p>This is the about page</p>
      </div>
    )
  }
  