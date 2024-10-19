import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";

interface TypingEffectTextProps {
  text: string;
  onTypingComplete: () => void;
}

const TypingEffectText: React.FC<TypingEffectTextProps> = ({ text, onTypingComplete }) => {
  const [displayResponse, setDisplayResponse] = useState("");
  const [completedTyping, setCompletedTyping] = useState(false);

  useEffect(() => {
    setCompletedTyping(false);
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayResponse(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);
        onTypingComplete(); // Notify that typing is complete
      }
    }, 20);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <Text>
      {displayResponse}
      {!completedTyping && <Text style={styles.cursor}>|</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  cursor: {
    fontSize: 16,
    color: "#000",
    opacity: 1,
  },
});

export default TypingEffectText;
