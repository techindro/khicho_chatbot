import { useState, useEffect, useRef, useCallback } from "react";
import Logo from "@components/logo";
import ImageCard from "@components/imagecard";
import { STYLES, SUGGESTIONS } from "../constants";
import { createImageJob, validatePrompt, generateImage, generateImageToImage, buildPrompt, downloadImage } from "@utils/imageGen";
import {
  Home, Compass, Sparkles, Archive, ImagePlus, X, LogOut, Sun, Moon, Settings2, CreditCard,
  Film, Play, Pause, RefreshCw, Volume2, Download, Copy, Dices, Wand2, Square, Tv, Smartphone, Image,
  Sprout, Palette, Camera, Zap, Cpu, Brush, Box, Gamepad2, Wand, Lightbulb, Globe
} from "lucide-react";

const renderStyleIcon = (lucideName) => {
  const iconMap = {
    Sprout, Palette, Camera, Zap, Cpu, Brush, Box, Image, Gamepad2, Wand
  };
  const IconComponent = iconMap[lucideName] || Image;
  return <IconComponent size={14} />;
};

const ENHANCERS = {
  realistic: [
    "cinematic lighting, volumetric atmosphere, highly detailed, 8k resolution, photorealistic, shot on 35mm lens",
    "golden hour lighting, soft shadows, sharp focus, hyper-detailed, DSLR photograph, professional color grading",
    "volumetric dust particles, dramatic side-lighting, cinematic composition, intricate textures, masterpiece, high fidelity",
    "moody atmosphere, raytraced reflections, highly detailed, studio lighting, award-winning photography, close-up details"
  ],
  ghibli: [
    "studio ghibli aesthetic, hand-painted watercolor background, nostalgic lighting, whimsical atmosphere, retro anime key art",
    "spirited away style, soft clouds, hand-drawn detailing, warm sun rays, pastel watercolor textures, anime key visual",
    "howl's moving castle vibe, lush green hills, soft natural lighting, magical fantasy atmosphere, intricate hand-painted scenery",
    "my neighbor totoro style, soft focus, nostalgic summer afternoon, hand-painted gouache style, high-quality anime art"
  ],
  anime: [
    "modern anime key visual, dynamic lighting, vibrant colors, detailed line art, digital painting, masterpiece",
    "makoto shinkai aesthetic, gorgeous starry sky, reflective water, highly detailed clouds, dramatic sunset lighting, anime wallpaper",
    "kyoto animation style, soft natural lighting, emotional atmosphere, delicate character art, high resolution anime key visual",
    "futuristic anime style, neon highlights, dynamic composition, clean lines, cell-shaded, high aesthetic value"
  ],
  cyberpunk: [
    "cyberpunk aesthetic, glowing neon signage, wet streets with puddle reflections, volumetric steam, dark moody atmosphere",
    "futuristic city street, hologram ads, rain-slicked pavement, dramatic purple and cyan neon lighting, retro-futurism style",
    "neon cyber-tech detailing, moody night city backdrop, soft lens flare, synthwave aesthetic, high-fidelity cyberpunk visual",
    "dark alleyway, glowing cables, cybernetic highlights, volumetric smoke, raytraced neon reflections, 8k cyberpunk key art"
  ],
  watercolor: [
    "delicate watercolor painting, soft color bleeding, fine paper texture, hand-drawn ink outlines, aesthetic pastel palette",
    "whimsical watercolor wash, elegant splatters, vintage sketch feel, organic textures, hand-painted masterwork",
    "soft gouache and watercolor blend, dreamy pastel tones, organic paint splashes, high artistic quality"
  ],
  "3d": [
    "3d render, octane render, stylized cg illustration, smooth clay texture, vibrant studio lighting, clean geometric shapes",
    "toy style 3d modeling, soft plastic materials, ambient occlusion, bright pastel colors, cute isometric rendering",
    "digital 3d art, glossy materials, soft shadows, raytraced reflections, dynamic studio key light, highly polished"
  ],
  cartoon: [
    "vibrant cartoon illustration, bold outlines, flat shading, playful character design, highly saturated colors, animated movie style",
    "cute disney style drawing, expressive features, soft lighting, whimsical background illustration, magical vector clean lines"
  ],
  oilpaint: [
    "classical oil painting, rich canvas texture, impasto brushstrokes, dramatic chiaroscuro lighting, masterwork museum quality",
    "baroque style oil painting, deep color tones, realistic shadows, textured canvas, fine art classical composition"
  ],
  pixel: [
    "retro 16-bit pixel art, detailed dithered shading, nostalgic arcade game aesthetic, clean grid structure, colorful sprite visual",
    "cozy pixel scene, pixelated textures, isometric retro style, vibrant limited color palette, 8-bit aesthetic"
  ],
  fantasy: [
    "epic fantasy illustration, ethereal mythical glow, magical spell details, high fantasy digital painting, dramatic light rays",
    "dungeons and dragons concept art, magical atmosphere, glowing crystal light, dynamic epic composition, fantasy landscape"
  ]
};

const BHOJPURI_TRANSLATIONS = {
  "The universe spans infinitely, holding secrets beyond our wild imagination.": 
    "ई ब्रह्मांड अनंत बा, जवने में अइसन रहस्य छिपल बा जेकरा बारे में हमनी के सोच भी ना सकीं।",
  "For generations, humanity has gazed upon the stars, dreaming of a journey into the deep void.": 
    "सदियन से हमनी के पुरखा लोग आसमान के तारा देख के सोचत रहल हं कि कवना दिन आसमान में जाईं जा।",
  "Now, the time has come. We are stepping into the cosmos, navigating warp gates towards new frontiers.": 
    "अब समय आ गइल बा, हमनी के तारा के ओर कदम बढ़ावत बानी जा, नया दुनिया खोजे खातिर।",
  "Deep in the quiet forest, nature whispers ancient secrets to those who stop to listen.": 
    "शांत जंगल के गहराई में, प्रकृति हमनी के पुरान रहस्य सुनावत बिया, बस सुने वाला चाहीं।",
  "Every mountain peak stands as a testament of time, holding the skies in everlasting embrace.": 
    "हर पहाड़ के चोटी समय के गवाह बा, आसमान के गले लगा के रखले बा।",
  "This planet is our only home. It is a masterpiece created in silence, meant to be preserved forever.": 
    "ई धरती हमनी के एकलौता घर बा, एकरा के बचा के रखल हमनी के फ़र्ज़ बा।",
  "Artificial Intelligence is redefining the canvas of human thought, spark-plugging the digital renaissance.": 
    "आर्टिफिशियल इंटेलिजेंस इंसान के सोच के बदलत बा, एक नया क्रांति लावत बा।",
  "Humanoid robots are stepping out of science fiction, learning to create and think alongside us.": 
    "इंसान जइसन रोबोट अब कहानी से बाहर आके हमनी के साथ काम करत बाड़े।",
  "We stand at the edge of a new horizon. A cybernetic future where design merges with algorithms.": 
    "हमनी के एक नया मोड़ पर खड़ा बानी जा, जहाँ तकनीक और इंसान एक हो जाई।"
};

const translateToBhojpuri = (text, topic) => {
  if (BHOJPURI_TRANSLATIONS[text]) {
    return BHOJPURI_TRANSLATIONS[text];
  }
  if (text.includes("Let us dive into the wonderful world of")) {
    return `चलीं जा ${topic || "विषय"} के सुंदर दुनिया में घूम के आवल जाओ, जहाँ सोच के कोई सीमा नईखे।`;
  }
  if (text.includes("Every single angle reveals a deeper mystery and intricate story")) {
    return `हर एक कोना से ${topic || "विषय"} के बारे में एक नया रहस्य और कहानी पता चलत बा।`;
  }
  if (text.includes("A true masterpiece captured in the flow of time, celebrating the art of visual imagination.")) {
    return "समय के बहाव में छिपल एगो असली नमूना बा, जेकरा के देख के दिल खुश हो जाई।";
  }
  return text;
};

const HINDI_TRANSLATIONS = {
  "The universe spans infinitely, holding secrets beyond our wild imagination.": 
    "ब्रह्मांड अनंत दूरी तक फैला हुआ है, जिसमें हमारी कल्पना से भी परे रहस्य छिपे हुए हैं।",
  "For generations, humanity has gazed upon the stars, dreaming of a journey into the deep void.": 
    "पीढ़ियों से, मानवता ने तारों की ओर देखा है, और गहरी शून्यता की यात्रा का सपना देखा है।",
  "Now, the time has come. We are stepping into the cosmos, navigating warp gates towards new frontiers.": 
    "अब, वह समय आ गया है। हम ब्रह्मांड में कदम रख रहे हैं, नए क्षितिजों की ओर बढ़ रहे हैं।",
  "Deep in the quiet forest, nature whispers ancient secrets to those who stop to listen.": 
    "शांत जंगल की गहराई में, प्रकृति उन लोगों को प्राचीन रहस्य सुनाती है जो सुनने के लिए रुकते हैं।",
  "Every mountain peak stands as a testament of time, holding the skies in everlasting embrace.": 
    "हर पहाड़ की चोटी समय के प्रमाण के रूप में खड़ी है, जो आसमान को गले लगाए हुए है।",
  "This planet is our only home. It is a masterpiece created in silence, meant to be preserved forever.": 
    "यह ग्रह हमारा एकमात्र घर है। यह मौन में बनाई गई एक उत्कृष्ट कृति है, जिसे हमेशा के लिए संरक्षित किया जाना है।",
  "Artificial Intelligence is redefining the canvas of human thought, spark-plugging the digital renaissance.": 
    "आर्टिफिशियल इंटेलिजेंस मानव विचार के कैनवास को फिर से परिभाषित कर रहा है, एक नई डिजिटल क्रांति ला रहा है।",
  "Humanoid robots are stepping out of science fiction, learning to create and think alongside us.": 
    "ह्यूमनॉइड रोबोट विज्ञान कथाओं से बाहर आ रहे हैं, हमारे साथ मिलकर बनाना और सोचना सीख रहे हैं।",
  "We stand at the edge of a new horizon. A cybernetic future where design merges with algorithms.": 
    "हम एक नए क्षितिज के किनारे पर खड़े हैं। एक साइबरनेटिक भविष्य जहां डिजाइन एल्गोरिदम के साथ विलीन हो जाता है।"
};

const translateToHindi = (text, topic) => {
  if (HINDI_TRANSLATIONS[text]) {
    return HINDI_TRANSLATIONS[text];
  }
  if (text.includes("Let us dive into the wonderful world of")) {
    return `आइए हम ${topic || "विषय"} की अद्भुत दुनिया में गोता लगाएँ, जहाँ रचनात्मकता की कोई सीमा नहीं है।`;
  }
  if (text.includes("Every single angle reveals a deeper mystery and intricate story")) {
    return `हर एक कोण ${topic || "विषय"} के निर्माण के पीछे एक गहरा रहस्य और जटिल कहानी प्रकट करता है।`;
  }
  if (text.includes("A true masterpiece captured in the flow of time, celebrating the art of visual imagination.")) {
    return "समय के प्रवाह में कैद एक सच्ची उत्कृष्ट कृति, जो दृश्य कल्पना की कला का जश्न मनाती है।";
  }
  return text;
};

const getVoiceForCharacter = (charType, voices) => {
  if (charType === "us-male") {
    return voices.find(v => v.lang.startsWith("en-US") && (v.name.includes("David") || v.name.includes("Guy") || v.name.includes("Male"))) || voices.find(v => v.lang.startsWith("en-US"));
  }
  if (charType === "us-female") {
    return voices.find(v => v.lang.startsWith("en-US") && (v.name.includes("Zira") || v.name.includes("Zira") || v.name.includes("Female") || v.name.includes("Google") || v.name.includes("Jenny"))) || voices.find(v => v.lang.startsWith("en-US"));
  }
  if (charType === "in-male") {
    return voices.find(v => (v.lang.startsWith("en-IN") || v.lang.startsWith("hi-IN")) && (v.name.includes("Ravi") || v.name.includes("Male") || v.name.includes("Hindi") || v.name.includes("हिन्दी"))) || voices.find(v => v.lang.startsWith("en-IN")) || voices.find(v => v.lang.startsWith("hi-IN")) || voices[0];
  }
  if (charType === "in-female") {
    return voices.find(v => (v.lang.startsWith("en-IN") || v.lang.startsWith("hi-IN")) && (v.name.includes("Heera") || v.name.includes("Swara") || v.name.includes("Female") || v.name.includes("Google") || v.name.includes("Neerja"))) || voices.find(v => v.lang.startsWith("en-IN")) || voices.find(v => v.lang.startsWith("hi-IN")) || voices[0];
  }
  if (charType === "hi-male") {
    return voices.find(v => v.lang.startsWith("hi-IN") && (v.name.includes("Hemant") || v.name.includes("Male") || v.name.includes("Hari"))) || voices.find(v => v.lang.startsWith("hi-IN")) || voices.find(v => v.lang.startsWith("en-IN")) || voices[0];
  }
  if (charType === "hi-female") {
    return voices.find(v => v.lang.startsWith("hi-IN") && (v.name.includes("Kalpana") || v.name.includes("Female") || v.name.includes("Google हिन्दी") || v.name.includes("Madhur"))) || voices.find(v => v.lang.startsWith("hi-IN")) || voices.find(v => v.lang.startsWith("en-IN")) || voices[0];
  }
  if (charType === "bhojpuri") {
    return voices.find(v => v.lang.startsWith("hi-IN")) || voices.find(v => v.lang.startsWith("en-IN")) || voices[0];
  }
  return null;
};

export default function Dashboard({ user, hfToken, ideogramApiKey, currentTier, onPricingClick, onLogout, theme, toggleTheme }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalCopied, setModalCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("create"); // "create" | "video"

  // Video Studio States
  const [videoTopic, setVideoTopic] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoLoadingStep, setVideoLoadingStep] = useState("");
  const [videoScenes, setVideoScenes] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState("in-female");
  const [systemVoices, setSystemVoices] = useState([]);
  const [captionStyle, setCaptionStyle] = useState("yellow"); // "yellow" | "white"
  const [captionColor, setCaptionColor] = useState("#fbbf24");
  const [captionSize, setCaptionSize] = useState(20);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9");

  // Load system voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setSystemVoices(voices);
    };
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleModalCopy = () => {
    if (!selectedImage) return;
    navigator.clipboard.writeText(selectedImage.prompt);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 1500);
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    const styleEnhancers = ENHANCERS[style] || [
      "highly detailed, cinematic lighting, 8k resolution, masterpiece composition, award-winning artistic style",
      "dramatic lighting, soft depth of field, vibrant colors, composition, high fidelity, 4k",
      "volumetric atmosphere, rich color palette, intricate detailing, professional creative grading, masterpiece"
    ];
    const randomIndex = Math.floor(Math.random() * styleEnhancers.length);
    const modifier = styleEnhancers[randomIndex];
    const trimmed = prompt.trim();
    const separator = trimmed.endsWith(",") ? " " : trimmed.length > 0 ? ", " : "";
    setPrompt((p) => `${p.trim()}${separator}${modifier}`);
  };

  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem("khicho_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const successfulImages = images.filter((img) => img.status === "done");
      localStorage.setItem("khicho_history", JSON.stringify(successfulImages.slice(0, 50)));
    } catch (err) {
      console.error("Failed to save history:", err);
    }
  }, [images]);

  const generate = useCallback(async () => {
    const { valid, error: validError } = validatePrompt(prompt);
    if (!valid && !uploadedImage) return setError(validError);
    if (loading) return;

    setError("");
    setLoading(true);
    const selectedStyle = STYLES.find((s) => s.id === style);
    const fullPrompt = buildPrompt(prompt.trim() || "stylize this image", selectedStyle);

    const placeholders = Array.from({ length: count }, (_, i) =>
      createImageJob(prompt.trim(), selectedStyle, i, aspectRatio)
    );
    setImages((prev) => [...placeholders, ...prev]);

    // Generate one at a time to avoid Pollinations rate limits
    for (let i = 0; i < placeholders.length; i++) {
      const ph = placeholders[i];
      if (i > 0) await new Promise((r) => setTimeout(r, 1500));

      try {
        let url;
        if (uploadedImage) {
          url = await generateImageToImage(uploadedImage, fullPrompt, hfToken, aspectRatio);
        } else {
          url = await generateImage(fullPrompt, i, currentTier, ideogramApiKey, aspectRatio);
        }
        setImages((prev) =>
          prev.map((img) =>
            img.id === ph.id ? { ...img, url, status: "done" } : img
          )
        );
      } catch (err) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === ph.id ? { ...img, status: "error", error: err.message } : img
          )
        );
      }
    }
    setLoading(false);
  }, [prompt, style, count, loading, hfToken, uploadedImage, aspectRatio]);

  const handleDownloadAll = useCallback(async () => {
    const doneImages = images.filter((img) => img.status === "done");
    if (doneImages.length === 0) return;
    for (const img of doneImages) {
      await new Promise((r) => setTimeout(r, 400));
      await downloadImage(img.url, `khicho-${img.id}.jpg`);
    }
  }, [images]);

  const deleteImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  // Audio Playback Controllers for Video Studio
  const speechRef = useRef(null);

  const stopPlayback = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
    if (speechRef.current) {
      speechRef.current.onend = null;
      speechRef.current = null;
    }
  }, []);

  const playSceneAudio = useCallback((index) => {
    if (!videoScenes || !videoScenes[index]) return;
    window.speechSynthesis.cancel();
    
    const scene = videoScenes[index];
    const characterVoice = getVoiceForCharacter(selectedCharacter, systemVoices);
    
    let speakText = scene.script;
    if (selectedCharacter === "bhojpuri") {
      speakText = translateToBhojpuri(scene.script, videoTopic);
    } else if (selectedCharacter === "hi-female" || selectedCharacter === "hi-male") {
      speakText = translateToHindi(scene.script, videoTopic);
    }

    const utterance = new SpeechSynthesisUtterance(speakText);
    if (characterVoice) {
      utterance.voice = characterVoice;
    }
    
    utterance.onend = () => {
      if (index < videoScenes.length - 1) {
        setActiveSceneIndex(index + 1);
        playSceneAudio(index + 1);
      } else {
        setPlaying(false);
        setActiveSceneIndex(0);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error, falling back to scene duration:", e);
      setTimeout(() => {
        if (index < videoScenes.length - 1) {
          setActiveSceneIndex(index + 1);
          playSceneAudio(index + 1);
        } else {
          setPlaying(false);
          setActiveSceneIndex(0);
        }
      }, scene.duration * 1000);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [videoScenes, selectedCharacter, systemVoices, videoTopic]);

  const handlePlayToggle = () => {
    if (playing) {
      stopPlayback();
    } else {
      setPlaying(true);
      const startIdx = activeSceneIndex >= videoScenes.length ? 0 : activeSceneIndex;
      setActiveSceneIndex(startIdx);
      playSceneAudio(startIdx);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const generateVideo = async () => {
    if (!videoTopic.trim() || videoLoading) return;
    setError("");
    setVideoLoading(true);
    setVideoLoadingStep("Creating story script...");
    
    const query = videoTopic.toLowerCase();
    let templateScenes = [];
    
    if (query.includes("space") || query.includes("universe") || query.includes("star") || query.includes("planet") || query.includes("black hole")) {
      templateScenes = [
        {
          script: "The universe spans infinitely, holding secrets beyond our wild imagination.",
          prompt: "swirling colorful space nebula, glowing stars, cinematic volumetric lighting, 8k resolution, futuristic digital art",
          duration: 5
        },
        {
          script: "For generations, humanity has gazed upon the stars, dreaming of a journey into the deep void.",
          prompt: "an astronaut standing on the moon surface looking at the glowing blue Earth, hyper-detailed, photorealistic",
          duration: 6
        },
        {
          script: "Now, the time has come. We are stepping into the cosmos, navigating warp gates towards new frontiers.",
          prompt: "futuristic warp spaceship traveling through a glowing dimensional wormhole, raytraced neon render, 8k",
          duration: 6
        }
      ];
    } else if (query.includes("nature") || query.includes("forest") || query.includes("river") || query.includes("mountain") || query.includes("green") || query.includes("lake")) {
      templateScenes = [
        {
          script: "Deep in the quiet forest, nature whispers ancient secrets to those who stop to listen.",
          prompt: "magical sunlit forest, giant ancient trees, glowing river stream, soft volumetric fog, studio ghibli anime style",
          duration: 5
        },
        {
          script: "Every mountain peak stands as a testament of time, holding the skies in everlasting embrace.",
          prompt: "massive snow-capped mountain peaks surrounding a crystal clear lake at golden hour, realistic DSLR photo",
          duration: 6
        },
        {
          script: "This planet is our only home. It is a masterpiece created in silence, meant to be preserved forever.",
          prompt: "a floating green island in a glowing sky, plants and waterfalls, surreal fantasy digital painting, high resolution",
          duration: 6
        }
      ];
    } else if (query.includes("tech") || query.includes("ai") || query.includes("robot") || query.includes("future") || query.includes("cyber")) {
      templateScenes = [
        {
          script: "Artificial Intelligence is redefining the canvas of human thought, spark-plugging the digital renaissance.",
          prompt: "glowing blue abstract neural network brain, floating cybernetic code particles, dark background, cyberpunk art",
          duration: 5
        },
        {
          script: "Humanoid robots are stepping out of science fiction, learning to create and think alongside us.",
          prompt: "a sleek white humanoid robot standing next to an easel and painting oil art, soft studio lighting, 3d render",
          duration: 6
        },
        {
          script: "We stand at the edge of a new horizon. A cybernetic future where design merges with algorithms.",
          prompt: "futuristic cyberpunk neon skyscraper city at night, flying hover vehicles, raytraced puddle reflections, 8k",
          duration: 6
        }
      ];
    } else {
      const topic = videoTopic.trim();
      templateScenes = [
        {
          script: `Let us dive into the wonderful world of ${topic}, where creativity knows no bounds.`,
          prompt: `${topic} in a beautiful cinematic landscape, golden hour lighting, hyper-detailed, 8k, photorealistic`,
          duration: 5
        },
        {
          script: `Every single angle reveals a deeper mystery and intricate story behind the creation of ${topic}.`,
          prompt: `macro detailed close-up shot of ${topic}, professional studio lighting, DSLR camera, sharp focus, 4k`,
          duration: 6
        },
        {
          script: "A true masterpiece captured in the flow of time, celebrating the art of visual imagination.",
          prompt: `stylized fantasy watercolor painting of ${topic}, soft color bleeding, fine paper texture, artistic masterpiece`,
          duration: 6
        }
      ];
    }

    try {
      const renderedScenes = [];
      for (let idx = 0; idx < templateScenes.length; idx++) {
        setVideoLoadingStep(`Rendering scene ${idx + 1} of 3...`);
        const scene = templateScenes[idx];
        const imageUrl = await generateImage(scene.prompt, idx, currentTier, ideogramApiKey, videoAspectRatio);
        renderedScenes.push({
          ...scene,
          id: `scene-${idx}-${Date.now()}`,
          url: imageUrl,
          aspectRatio: videoAspectRatio
        });
      }
      setVideoScenes(renderedScenes);
      setActiveSceneIndex(0);
      setPlaying(false);
    } catch (err) {
      console.error("Video generation failed:", err);
      setError(`Failed to generate video: ${err.message}`);
    } finally {
      setVideoLoading(false);
      setVideoLoadingStep("");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return setError("Image must be under 5MB");
      setUploadedImage(file);
      setError("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  return (
    <div className="mj-app">
      {/* Sidebar */}
      <aside className="mj-sidebar">
        <Logo size="sm" showMark />
        <div style={{ width: 32, height: 1, background: "var(--border)", margin: "8px 0" }} />
        <button
          className={`mj-sidebar-btn ${activeTab === "create" ? "active" : ""}`}
          onClick={() => { stopPlayback(); setActiveTab("create"); }}
          title="Create Art"
        >
          <Sparkles size={20} />
        </button>
        <button
          className={`mj-sidebar-btn ${activeTab === "video" ? "active" : ""}`}
          onClick={() => setActiveTab("video")}
          title="Video Studio"
        >
          <Film size={20} />
        </button>
        <button className="mj-sidebar-btn" title="Explore"><Compass size={20} /></button>
        <button className="mj-sidebar-btn" title="Archive"><Archive size={20} /></button>
        <button className="mj-sidebar-btn" onClick={onPricingClick} title="Subscription"><CreditCard size={20} /></button>
        <div className="mj-sidebar-spacer" />
        <button className="mj-sidebar-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="mj-sidebar-btn" onClick={onLogout} title="Log out">
          <LogOut size={18} />
        </button>
      </aside>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <nav className="mj-mobile-nav">
        <button
          className={`mj-mobile-nav-btn ${activeTab === "create" ? "active" : ""}`}
          onClick={() => { stopPlayback(); setActiveTab("create"); }}
          title="Create Art"
        >
          <Sparkles size={20} />
        </button>
        <button
          className={`mj-mobile-nav-btn ${activeTab === "video" ? "active" : ""}`}
          onClick={() => setActiveTab("video")}
          title="Video Studio"
        >
          <Film size={20} />
        </button>
        <button className="mj-mobile-nav-btn" onClick={onPricingClick} title="Subscription">
          <CreditCard size={20} />
        </button>
        <button className="mj-mobile-nav-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="mj-mobile-nav-btn" onClick={onLogout} title="Log out">
          <LogOut size={20} />
        </button>
      </nav>

      {/* Main */}
      <main className="mj-main">
        {activeTab === "create" ? (
          <>
            <header className="mj-topbar">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
                  {images.length > 0 ? `${images.length} creations` : "Create"}
                </span>
                {images.filter((img) => img.status === "done").length > 0 && (
                  <button
                    onClick={handleDownloadAll}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    <Download size={12} /> Save All
                  </button>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  onClick={onPricingClick}
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: currentTier === "Free" ? "var(--text-muted)" : currentTier === "Starter" ? "#3b82f6" : currentTier === "Pro" ? "#8b5cf6" : "#ef4444",
                    background: currentTier === "Free" ? "rgba(255,255,255,0.03)" : currentTier === "Starter" ? "rgba(59,130,246,0.1)" : currentTier === "Pro" ? "rgba(139,92,246,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${currentTier === "Free" ? "var(--border)" : currentTier === "Starter" ? "rgba(59,130,246,0.2)" : currentTier === "Pro" ? "rgba(139,92,246,0.2)" : "rgba(239,68,68,0.2)"}`,
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = currentTier === "Free" ? "var(--border-hover)" : currentTier === "Starter" ? "#3b82f6" : currentTier === "Pro" ? "#8b5cf6" : "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = currentTier === "Free" ? "var(--border)" : currentTier === "Starter" ? "rgba(59,130,246,0.2)" : currentTier === "Pro" ? "rgba(139,92,246,0.2)" : "rgba(239,68,68,0.2)";
                  }}
                >
                  {currentTier === "Free" ? "Free Member" : `${currentTier} Tier`}
                </div>
                <div className="mj-user-pill">
                  <div className="mj-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</div>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{user.name}</span>
                </div>
              </div>
            </header>

            <div className="mj-gallery animate-slide-up">
              {images.length === 0 ? (
                <div className="mj-gallery-empty">
                  <Sparkles size={32} strokeWidth={1} color="var(--text-muted)" />
                  <h2>What will you imagine?</h2>
                  <p>Type a prompt below and press Enter to generate stunning AI art in seconds.</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
                    {SUGGESTIONS.slice(0, 3).map((s, i) => (
                      <button key={i} className="mj-prompt-btn" onClick={() => setPrompt(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              ) : (
                 <div className="mj-gallery-grid">
                   {images.map((img) => (
                     <ImageCard 
                       key={img.id} 
                       item={img} 
                       onDelete={deleteImage} 
                       onImageClick={() => img.status === "done" && setSelectedImage(img)}
                     />
                   ))}
                 </div>
              )}
            </div>
          </>
        ) : (
          /* Video Studio Panel JSX */
          <div className="mj-video-studio animate-slide-up">
            <div className="mj-video-main">
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, color: "var(--text-primary)", textAlign: "left" }}>
                    Video Studio <span style={{ fontSize: "12px", background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, marginLeft: "8px" }}>BETA</span>
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
                    Generate scripts, voiceovers, and matching AI visuals to create presentations.
                  </p>
                </div>
              </div>

              {/* Video Player or Setup */}
              {!videoScenes ? (
                /* Generator Setup Box */
                <div style={{
                  background: "linear-gradient(135deg, var(--surface) 0%, rgba(139, 92, 246, 0.03) 100%)",
                  border: "1px solid var(--border)",
                  borderRadius: "24px",
                  padding: "48px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "28px",
                  textAlign: "center",
                  minHeight: "440px",
                  boxShadow: "var(--shadow-md)"
                }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                    <Film size={28} style={{ margin: "auto" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Create your AI Video Presentation</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "460px", lineHeight: 1.5 }}>
                      Describe your topic in one sentence. We will automatically generate the narration script, render matching images with AI, and sync a voice actor!
                    </p>
                  </div>
                  
                  <div style={{ width: "100%", maxWidth: "600px" }}>
                    <textarea
                      value={videoTopic}
                      onChange={(e) => setVideoTopic(e.target.value)}
                      placeholder="e.g. A fascinating journey through black holes in deep space..."
                      style={{
                        width: "100%",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        padding: "16px",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        resize: "none",
                        height: "90px",
                        outline: "none",
                        lineHeight: 1.5,
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
                      }}
                    />
                    
                    {/* Presets Grid */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
                      {[
                        { label: "Deep Space Exploration 🌌", value: "A fascinating journey through black holes and nebulae in deep space" },
                        { label: "Magical Fantasy Forest 🌿", value: "An ancient magical forest with glowing trees and mystical streams" },
                        { label: "Cyberpunk Future City 🌃", value: "A futuristic cyberpunk metropolis with glowing neon lights and flying cars" },
                        { label: "Future of Robots 🤖", value: "The rise of friendly humanoid robots helping humans paint and design" }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => setVideoTopic(preset.value)}
                          style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                            padding: "6px 12px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#8b5cf6";
                            e.currentTarget.style.color = "var(--text-primary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.color = "var(--text-secondary)";
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {error && (
                      <p style={{ color: "var(--error)", fontSize: "12px", textAlign: "left", marginTop: "6px" }}>{error}</p>
                    )}
                  </div>

                  <button
                    onClick={generateVideo}
                    disabled={videoLoading || !videoTopic.trim()}
                    style={{
                      padding: "14px 40px",
                      background: "var(--button-bg)",
                      color: "var(--button-text)",
                      border: "none",
                      borderRadius: "9999px",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: videoTopic.trim() && !videoLoading ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      opacity: videoTopic.trim() && !videoLoading ? 1 : 0.5,
                      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                      transition: "all 0.2s"
                    }}
                  >
                    {videoLoading ? (
                      <>
                        <RefreshCw size={16} className="spin" style={{ animation: "spin 1s linear infinite" }} />
                        {videoLoadingStep}
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Generate Video Storyboard
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Active Video Editor Box */
                <>
                  {/* Player Canvas */}
                  <div 
                    className="mj-video-player"
                    style={{
                      aspectRatio: videoAspectRatio === "16:9" ? "16/9" : videoAspectRatio === "9:16" ? "9/16" : videoAspectRatio === "3:4" ? "3/4" : videoAspectRatio === "4:5" ? "4/5" : "1"
                    }}
                  >
                    <img
                      src={videoScenes[activeSceneIndex].url}
                      alt={`Scene ${activeSceneIndex + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    


                    {/* Simple Play Overlay on Pause */}
                    {!playing && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button
                          onClick={handlePlayToggle}
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "var(--button-bg)",
                            color: "var(--button-text)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "var(--shadow-lg)"
                          }}
                        >
                          <Play size={28} style={{ marginLeft: "4px" }} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Progress Segments */}
                  <div style={{ display: "flex", gap: "6px", width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden", marginTop: "12px" }}>
                    {videoScenes.map((_, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          flex: 1, 
                          height: "100%", 
                          background: idx === activeSceneIndex ? "var(--accent)" : idx < activeSceneIndex ? "rgba(139, 92, 246, 0.4)" : "transparent",
                          borderRadius: "3px",
                          transition: "background 0.3s ease"
                        }} 
                      />
                    ))}
                  </div>

                  {/* Player Controls Bar */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--surface)",
                    padding: "16px 24px",
                    borderRadius: "16px",
                    border: "1px solid var(--border)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <button
                        onClick={handlePlayToggle}
                        style={{
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {playing ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
                      </button>
                      
                      <button
                        onClick={() => { stopPlayback(); setVideoScenes(null); }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                      >
                        Reset Video
                      </button>
                    </div>

                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                      Scene {activeSceneIndex + 1} of {videoScenes.length}
                    </span>
                  </div>

                  {/* Storyboard Timeline Editor */}
                  <div>
                    <h3 style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 600, marginBottom: "12px", textAlign: "left" }}>
                      Storyboard Timeline
                    </h3>
                    <div className="mj-video-timeline">
                      {videoScenes.map((scene, idx) => (
                        <div
                          key={scene.id}
                          className={`mj-timeline-card ${activeSceneIndex === idx ? "active" : ""}`}
                          onClick={() => {
                            setActiveSceneIndex(idx);
                            if (playing) {
                              playSceneAudio(idx);
                            }
                          }}
                        >
                          <div 
                            className="mj-timeline-thumb"
                            style={{
                              aspectRatio: videoAspectRatio === "16:9" ? "16/9" : videoAspectRatio === "9:16" ? "9/16" : videoAspectRatio === "3:4" ? "3/4" : videoAspectRatio === "4:5" ? "4/5" : "1"
                            }}
                          >
                            <img src={scene.url} alt={`Scene ${idx + 1}`} />
                            <span style={{
                              position: "absolute",
                              bottom: "6px",
                              left: "6px",
                              background: "rgba(0,0,0,0.6)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              color: "white",
                              fontWeight: 600
                            }}>
                              Scene {idx + 1}
                            </span>
                          </div>
                          <textarea
                            className="mj-timeline-textarea"
                            value={scene.script}
                            onChange={(e) => {
                              const text = e.target.value;
                              setVideoScenes((prev) =>
                                prev.map((s, sIdx) => sIdx === idx ? { ...s, script: text } : s)
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Type script voiceover..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right column: Settings */}
            <div className="mj-video-sidebar">
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>Studio Settings</h3>
              
              {/* Video Aspect Ratio */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                  Aspect Ratio
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {["16:9", "9:16", "3:4", "4:5", "1:1"].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setVideoAspectRatio(ratio)}
                      style={{
                        padding: "6px",
                        background: videoAspectRatio === ratio ? "var(--accent)" : "var(--bg-secondary)",
                        color: videoAspectRatio === ratio ? "white" : "var(--text-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        fontSize: "11px",
                        cursor: "pointer"
                      }}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Voice Selection */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px" }}>
                  <Volume2 size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} /> Narration Voice
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { id: "hi-female", label: "Hindi Female", desc: "Kalpana / Google हिन्दी" },
                    { id: "hi-male", label: "Hindi Male", desc: "Hemant / Hari Accent" },
                    { id: "in-female", label: "Indian English Female", desc: "Heera / Swara Accent" },
                    { id: "in-male", label: "Indian English Male", desc: "Ravi Accent" },
                    { id: "us-female", label: "US Female", desc: "Zira / Jenny Accent" },
                    { id: "us-male", label: "US Male", desc: "David Accent" },
                    { id: "bhojpuri", label: "Bhojpuri Bhaiya", desc: "Bhojpuri Script Dialect" }
                  ].map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        stopPlayback();
                        setSelectedCharacter(char.id);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        background: selectedCharacter === char.id ? "rgba(139, 92, 246, 0.08)" : "var(--bg-secondary)",
                        border: `1px solid ${selectedCharacter === char.id ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "12px",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                        transition: "all 0.2s"
                      }}
                    >
                      <Globe size={16} style={{ color: "var(--accent)" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>{char.label}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{char.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>



              {/* Guide Note */}
              <div style={{
                marginTop: "16px",
                borderTop: "1px solid var(--border)",
                paddingTop: "16px",
                fontSize: "11px",
                color: "var(--text-muted)",
                lineHeight: 1.5
              }}>
                <strong style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Lightbulb size={12} style={{ color: "var(--accent)" }} /> Tip:</strong> You can edit the text inside the timeline cards to change the voice narration! Click any card to preview that scene.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom prompt bar */}
      {activeTab === "create" && (
        <div className="mj-prompt-dock animate-slide-up">
        <div className="mj-prompt-bar">
          {uploadedImage && (
            <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
              <img
                src={URL.createObjectURL(uploadedImage)}
                alt="Reference"
                style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }}
              />
              <button
                onClick={() => setUploadedImage(null)}
                style={{
                  position: "absolute", top: -6, right: -6,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              ><X size={10} /></button>
            </div>
          )}

          <textarea
            className="mj-prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Imagine..."
            rows={1}
          />

          {error && (
            <p style={{ color: "var(--error)", fontSize: 12, marginTop: 6 }}>{error}</p>
          )}

          <div className="mj-prompt-toolbar">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: "none" }} />
            <button className="mj-prompt-btn" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={14} /> Image
            </button>
            <button className="mj-prompt-btn" onClick={() => {
              const randomIndex = Math.floor(Math.random() * SUGGESTIONS.length);
              setPrompt(SUGGESTIONS[randomIndex]);
            }} title="Get a random prompt suggestion">
              <Dices size={14} /> Surprise Me
            </button>
            <button className="mj-prompt-btn" onClick={handleEnhancePrompt} title="Enhance prompt with cinematic style modifiers">
              <Wand2 size={14} /> Enhance
            </button>
            <button
              className={`mj-prompt-btn ${showSettings ? "active" : ""}`}
              onClick={() => setShowSettings((s) => !s)}
            >
              <Settings2 size={14} /> Settings
            </button>

            {showSettings && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "10px" }}>
                <div className="mj-style-scroll hide-scrollbar" style={{ width: "100%", margin: 0 }}>
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      className={`mj-prompt-btn ${style === s.id ? "active" : ""}`}
                      onClick={() => setStyle(s.id)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      {renderStyleIcon(s.lucideName)} {s.label}
                    </button>
                  ))}
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, marginRight: "6px" }}>Aspect Ratio:</span>
                  {["1:1", "16:9", "9:16", "3:4", "4:5"].map((ratio) => (
                    <button
                      key={ratio}
                      className={`mj-prompt-btn ${aspectRatio === ratio ? "active" : ""}`}
                      onClick={() => setAspectRatio(ratio)}
                      style={{ 
                        fontSize: "11px", 
                        padding: "4px 8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      {ratio === "1:1" && <Square size={12} />}
                      {ratio === "16:9" && <Tv size={12} />}
                      {ratio === "9:16" && <Smartphone size={12} />}
                      {ratio === "3:4" && <Image size={12} />}
                      {ratio === "4:5" && <Image size={12} />}
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mj-count-toggle">
              {[1, 2, 4].map((n) => (
                <button key={n} className={count === n ? "active" : ""} onClick={() => setCount(n)}>
                  {n}
                </button>
              ))}
            </div>

            <button className="mj-generate-btn" onClick={generate} disabled={loading}>
              {loading ? (
                <>
                  <div style={{
                    width: 14, height: 14,
                    border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "var(--button-text)",
                    borderRadius: "50%", animation: "spin 0.8s linear infinite",
                  }} />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Imagine
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Lightbox / Detail Viewer Modal */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            padding: "20px",
            animation: "fadeIn 0.2s ease"
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div
            style={{
              width: "min(900px, 95vw)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
              boxShadow: "var(--shadow-xl)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10
              }}
            >
              <X size={16} />
            </button>

            {/* Modal Content Wrapper */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", flex: 1, overflow: "hidden" }}>
              {/* Image Container */}
              <div style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", aspectRatio: "1" }}>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>

              {/* Details Sidebar */}
              <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "20px", background: "var(--bg-secondary)", textAlign: "left" }}>
                <div>
                  <span style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "#8b5cf6",
                    background: "rgba(139, 92, 246, 0.08)",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    display: "inline-block",
                    marginBottom: "16px"
                  }}>
                    Generation Details
                  </span>

                  <h4 style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>Prompt</h4>
                  <div style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "16px",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    marginBottom: "20px",
                    maxHeight: "150px",
                    overflowY: "auto"
                  }}>
                    {selectedImage.prompt}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <h4 style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>Style</h4>
                      <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                        {STYLES.find((s) => s.id === selectedImage.style)?.label || "Default"}
                      </span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>Created At</h4>
                      <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                        {new Date(selectedImage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={async () => {
                      await downloadImage(selectedImage.url, `khicho-${selectedImage.id}.jpg`);
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "var(--button-bg)",
                      color: "var(--button-text)",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <Download size={14} /> Download High-Res
                  </button>
                  <button
                    onClick={handleModalCopy}
                    style={{
                      padding: "12px 16px",
                      background: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    {modalCopied ? (
                      <>✓ Copied</>
                    ) : (
                      <><Copy size={14} /> Copy Prompt</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
