import { redirect } from 'next/navigation'

// Root redirects straight to the account portal.
// Middleware will catch unauthenticated users and send them to /login.
export default function Home() {
    redirect('/account')
}
