"use client"
import Link from 'next/link'
import { useSession, signOut, signIn } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

function Navbar() {
  const {data:session, status} = useSession();
  const user = session?.user as User;

  return (
    <nav>
      <div>
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">AnonyMsg</a>
        { status === "authenticated" ? 
          ( 
            <>
              <span className="mr-4">Welcome, {user?.username || user?.email}! </span> 
              <Button className="w-full md:w-auto" onClick={() => signOut()}> Logout </Button> 
            </>
          ) : 
          ( 
            <Link href={"/sign-in"}>
              <Button className="w-full md:w-auto">Login</Button>
            </Link> 
          )
        }
      </div>
    </nav>
  )
}

export default Navbar