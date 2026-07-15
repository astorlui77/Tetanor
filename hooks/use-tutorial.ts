import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TUTORIAL_SEEN_KEY = "@tetonor_tutorial_seen";

export function useTutorial() {
  const [tutorialSeen, setTutorialSeen] = useState<boolean | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Cargar estado al montar
  useEffect(() => {
    loadTutorialStatus();
  }, []);

  const loadTutorialStatus = async () => {
    try {
      const seen = await AsyncStorage.getItem(TUTORIAL_SEEN_KEY);
      setTutorialSeen(seen === "true");
      
      // Si es primera vez, mostrar tutorial automáticamente
      if (seen !== "true") {
        setShowTutorial(true);
      }
    } catch (error) {
      console.error("Error loading tutorial status:", error);
      setTutorialSeen(false);
    }
  };

  const markTutorialAsSeen = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, "true");
      setTutorialSeen(true);
    } catch (error) {
      console.error("Error saving tutorial status:", error);
    }
  };

  const openTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    if (!tutorialSeen) {
      markTutorialAsSeen();
    }
  };

  const resetTutorial = async () => {
    try {
      await AsyncStorage.removeItem(TUTORIAL_SEEN_KEY);
      setTutorialSeen(false);
    } catch (error) {
      console.error("Error resetting tutorial:", error);
    }
  };

  return {
    tutorialSeen,
    showTutorial,
    openTutorial,
    closeTutorial,
    resetTutorial,
  };
}
