import { Anchor, Layout} from "antd";
import { useSession } from 'next-auth/react'
import { SessionProvider } from "next-auth/react"

const { Link } = Anchor;
const { Header } = Layout;

export default function PageHeader() {
    const { data: session } = useSession()

    return (
        <SessionProvider session={session} refetchInterval={5 * 60}> 
            <Header style={{ backgroundColor: "#DADADA" }}>
                <div className="header">
                    <Anchor targetOffset="65">
                        <div id="logo">
                            <Link href="/" title="MESEKAI" />
                        </div>
                        <Link href="/#base" title="Home" />
                        <Link href="/#about" title="About" />
                        <Link href="/#members" title="Team" />
                        {!session && (<Link href='/api/auth/signin' title="Sign In"></Link>)}
                        {session && (<Link href='/api/auth/signout' title="Sign Out"></Link>)}
                    </Anchor>
                </div>
            </Header>          
        </SessionProvider>            
    )}



