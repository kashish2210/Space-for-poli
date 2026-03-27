import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Siren, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function EmergencyButton() {
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);

  const handleEmergencyClick = () => {
    if (isLocating) return;
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      navigate("/emergency/national");
      return;
    }

    setIsLocating(true);
    toast.info("Detecting your location for emergency routing...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using free Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          
          if (!response.ok) throw new Error("Failed to fetch location data");
          
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.state || "local";
          
          // Create a URL-friendly slug
          const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          
          setIsLocating(false);
          navigate(`/emergency/${citySlug}`);
          toast.success(`Connected to ${city} Emergency Hub`);
        } catch (error) {
          console.error("Geocoding error:", error);
          setIsLocating(false);
          toast.error("Could not determine exact city, routing to general emergency hub.");
          navigate("/emergency/local");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        let errorMsg = "Could not get your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied.";
        }
        toast.error(`${errorMsg} Routing to general emergency hub.`);
        navigate("/emergency/local");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <button
      onClick={handleEmergencyClick}
      disabled={isLocating}
      className={`
        relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
        font-bold text-sm tracking-wide text-white transition-all overflow-hidden
        ${isLocating ? "bg-red-900/50 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0"}
      `}
    >
      <AnimatePresence mode="wait">
        {isLocating ? (
          <motion.div
            key="locating"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Locating...</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <Siren className="h-4 w-4" />
            <span>EMERGENCY SOS</span>
            
            {/* Pulsing effect */}
            <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
            <div className="absolute -inset-1 bg-red-500/30 blur-sm animate-pulse pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
