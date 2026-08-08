"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation';

function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const pathName = usePathname();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">AnonyMsg</Link>
        {status === "authenticated" ?
          (
            <>
              <span className="mr-4">Welcome, {user?.username || user?.email}! </span>

              <div className="flex items-center gap-2 md:gap-5">
                { pathName !== "/dashboard" &&
                  <Button asChild className="w-fit md:w-auto bg-slate-100 text-black">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                }

                <Button className="w-fit md:w-auto bg-slate-100 text-black" onClick={() => signOut()}> Logout </Button>
              </div>
            </>
          ) :
          (
            <Link href={"/sign-in"}>
              <Button className="w-fit md:w-auto bg-slate-100 text-black" variant="outline">Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar