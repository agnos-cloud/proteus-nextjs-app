import { useEffect, useState } from 'react'
import { useQuery } from "@apollo/client";
import dynamic from "next/dynamic";

import { Text } from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { ChatWidget, SearchChatWidgetsVariable } from '@/features/chat-widget/types';
import ChatWidgetOps from "@chat-widget/graphql";

const Chat: NextPage = () => {
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
    const { chat, orgId } = location.query;

    const ChatWidget = dynamic(() => import("./ReactChatWidget"), { ssr: false}); // dynamic import for client side rendering

    const { data, loading, error } = useQuery<ChatWidget, any>(ChatWidgetOps.Query.chatWidget, {
        variables: {
            id: chat,
        }
    });
    
    
    const inIframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    if(inIframe() && data) {
        const {chatWidget} = data;
        return (
            <ChatWidget props={chatWidget} />
        );
    }
};

export default Chat;
