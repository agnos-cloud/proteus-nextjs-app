import React from 'react';
import { Widget, toggleMsgLoader, addResponseMessage, setQuickButtons } from "@proteus-ai/react-chat-widget";

import '@proteus-ai/react-chat-widget/lib/styles.css';

export default function ReactChatWidget(props: any) {  
  const { name, logo, primaryColor, secondaryColor } = props.props;

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
      title={name}
      subtitle="powered by Proteus"
      senderPlaceHolder="Ask a question ..."
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      handleNewUserMessage={handleNewUserMessage}
      handleQuickButtonClicked={handleQuickButtonClicked}
      imagePreview
    />
  )
}
