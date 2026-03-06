import { useState, useCallback, useEffect } from 'react';
import './index.css';
import LandingScreen from './components/LandingScreen';
import SearchingScreen from './components/SearchingScreen';
import ChatScreen from './components/ChatScreen';
import { useSocket } from './hooks/useSocket';


export default function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'searching' | 'chat'
  const [matchData, setMatchData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [peerTyping, setPeerTyping] = useState(false);
  const [chatEndedInfo, setChatEndedInfo] = useState(null);

  const onMatched = useCallback(({ sessionId, peerCollege, peerName }) => {
    setMatchData(prev => ({ ...prev, peerCollege, peerName, sessionId }));
    setScreen('chat');
  }, []);

  const onMessage = useCallback((msg) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const onChatEnded = useCallback(({ reason }) => {
    setChatEndedInfo({ reason });
    let text = 'The chat has been closed';
    if (reason === 'peer_disconnected') text = 'Your mate disconnected';
    else if (reason === 'user_ended') text = 'Your mate ended the chat';
    else if (reason === 'you_disconnected') text = 'You disconnected';

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text, time }]);
  }, []);

  const onPeerTyping = useCallback(({ isTyping }) => {
    setPeerTyping(isTyping);
  }, []);

  const onError = useCallback((err) => {
    alert(err.message);
    setScreen('landing');
  }, []);

  const socket = useSocket({ onMatched, onMessage, onChatEnded, onPeerTyping, onError });

  const handleStart = ({ name, college, gender, chatType }) => {
    // The UI 'gender' field is actually 'Looking For'
    const lookingFor = gender;
    // We'll guess the user's gender for now
    const myGender = lookingFor === 'He' ? 'She' : (lookingFor === 'She' ? 'He' : 'Others');

    setMatchData({ name, college, lookingFor, myGender, chatType });
    setMessages([]);
    setChatEndedInfo(null);
    setPeerTyping(false);

    socket.connect();
    socket.joinQueue({ name, college, gender: myGender, lookingFor });
    setScreen('searching');
  };

  const handleCancelSearch = () => {
    socket.leaveQueue();
    socket.disconnect();
    setScreen('landing');
  };

  const handleEndChat = () => {
    socket.endChat();
  };

  const handleNextMatch = () => {
    setMessages([]);
    setChatEndedInfo(null);
    setPeerTyping(false);

    socket.findNextMatch({});
    setScreen('searching');
  };

  if (screen === 'searching') {
    return <SearchingScreen onCancel={handleCancelSearch} />;
  }

  if (screen === 'chat') {
    return (
      <ChatScreen
        matchCollege={matchData?.peerCollege || 'Somewhere'}
        matchName={matchData?.peerName || 'someone'}
        messages={messages}
        onSendMessage={async (text) => {
          const success = await socket.sendMessage(text);
          if (success) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { id: Date.now(), sender: 'me', text, time }]);
          }
        }}
        onSendTyping={socket.sendTyping}
        onEnd={handleEndChat}
        onNextMatch={handleNextMatch}
        peerTyping={peerTyping}
        chatEndedInfo={chatEndedInfo}
      />
    );
  }

  return <LandingScreen onStartChat={handleStart} />;
}
