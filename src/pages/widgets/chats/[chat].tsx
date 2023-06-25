import { useEffect, useState } from 'react'

import { Text } from "@chakra-ui/react";
import { Home, OrgView } from "@components";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Widget, toggleMsgLoader, addResponseMessage, setQuickButtons } from "@proteus-ai/react-chat-widget";

import '@proteus-ai/react-chat-widget/lib/styles.css';

const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

const Chat: NextPage = () => {
    const [color, setColor] = useState('blue')
  // During hydration `useEffect` is called. `window` is available in `useEffect`. In this case because we know we're in the browser checking for window is not needed. If you need to read something from window that is fine.
  // By calling `setColor` in `useEffect` a render is triggered after hydrating, this causes the "browser specific" value to be available. In this case 'red'.
  useEffect(() => setColor('red'), [])
    /*
    * 
    * 1. Basic browser check first to know its been called from a iframe and not from the browser.
    * 2. Perform Auth checks with the detail from the URL and fetch chat variables
    * 3. confirm calling url is valid from the fetched chat variables
    * 4. show chat widget
    * Query the org details:
    * Use ".Query.org" from "@org/graphql" (see: src/components/OrgView/components/SideBar/components/OrgActionList.tsx)
    * Query the chat widget details
    */
    const { data: session } = useSession();
    const location = useRouter();

    if (inIframe()) { // Not in iframe
        return (
            <Text>Dey play</Text>
        );
    } else { // In iframe
        const { chat, orgId } = location.query;
        
        const handleNewUserMessage = (newMessage: string) => {
            toggleMsgLoader();
            setTimeout(() => {
              toggleMsgLoader();
              // Now send the message throught the backend API
              if (newMessage === 'breakfast') {
                setQuickButtons([
                    {label: 'Nigerian', value: 'Nigerian'},
                    {label: 'English', value: 'English'},
                    {label: 'Italian', value: 'Italian'},
                    {label: 'Dutch', value: 'Dutch'},
                ]);
              } else {
                addResponseMessage(newMessage);
              }
            }, 1500);
        }
        const handleQuickButtonClicked = (e: any) => {
            addResponseMessage('Selected ' + e);
            setQuickButtons([]);
        }


        return (
            <Widget 
                title={'chat.title'}
                subtitle="powered by Proteus"
                senderPlaceHolder="Ask a question ..."
                primaryColor='green'
                secondaryColor='purple'
                handleNewUserMessage={handleNewUserMessage}
                handleQuickButtonClicked={handleQuickButtonClicked}
                imagePreview
            />
        );
    }
};

export default Chat;
