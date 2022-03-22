import { Button } from "antd"
import Image from 'next/image'
import { useSession, getSession } from 'next-auth/react'
import React, { useState, useEffect} from 'react'
import { SessionProvider } from "next-auth/react"

export default function Landing(){
    const { data: session } = useSession()
    const [enterButton, setOnOrOff] = useState(true);

    useEffect(() => {
        const toggleButton = async() => {
            const secureSession = await getSession()
            !secureSession ? setOnOrOff(true) : setOnOrOff(false)
        }
        toggleButton()
    }, [])
    
    return (
        <SessionProvider session={session} refetchInterval={5 * 60}> 
            <div id="base">
                <div id="Title">Mesekai</div>
                {!session && (<div id="desc">
                    Sign in to explore our virtual world with just a webcam!
                </div>)}
                {session && (<div id="desc">
                    {session ? ` Hello ${session.user.name}, `: ''}
                    step into a virtual world with just a webcam!
                </div>)}
                <div id="button-middle">
                    <Image src="/misc/front-page-char.png" width="1276px" height="859px"/>
                        <Button disabled={enterButton} type="primary" size={"large"} href="/mesekai">Enter</Button>
                    <br/>
                </div>
            </div>
        </SessionProvider>  
    );
}