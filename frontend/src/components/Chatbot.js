import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Chat, Close, Send } from '@mui/icons-material';
const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user', timestamp: new Date() };
      setMessages([...messages, userMessage]);
      setIsTyping(true);

      try {
        const response = await fetch('http://localhost:5000/api/chatbot/response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from chatbot');
        }

        const data = await response.json();
        const botResponse = { text: data.response, sender: 'bot', timestamp: new Date() };
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        const errorResponse = { text: 'Sorry, there was an error processing your request.', sender: 'bot', timestamp: new Date() };
        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsTyping(false);
      }

      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <Fab
        color="primary"
        aria-label="chatbot"
        onClick={handleToggle}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
      >
        <Chat />
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={open}
        onClose={handleToggle}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Chat with Modern Mart</Typography>
          <IconButton onClick={handleToggle}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ flexGrow: 1, p: 0, overflowY: 'auto', maxHeight: 'calc(80vh - 120px)' }}>
      <List sx={{ p: 2 }}>
        {messages.map((message, index) => (
          <ListItem key={index} sx={{ alignItems: 'flex-start', mb: 1 }}>
            <Avatar sx={{ mr: 2, bgcolor: message.sender === 'bot' ? 'primary.main' : 'secondary.main' }}>
              {message.sender === 'bot' ? 'M' : (typeof user !== 'undefined' && user ? user.firstName.charAt(0).toUpperCase() : 'U')}
            </Avatar>
            <ListItemText
              primary={
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      bgcolor: message.sender === 'bot' ? 'grey.100' : 'primary.light',
                      color: message.sender === 'bot' ? 'text.primary' : 'white',
                      p: 1,
                      borderRadius: 2,
                      maxWidth: '70%'
                    }}
                  >
                    {message.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: 'block' }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
            {isTyping && (
              <ListItem sx={{ alignItems: 'flex-start', mb: 1 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  M
                </Avatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mr: 1 }}
                      >
                        Modern Mart is typing
                      </Typography>
                      <CircularProgress size={16} />
                    </Box>
                  }
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chatbot;
