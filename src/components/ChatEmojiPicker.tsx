import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Smile,
  Heart,
  Coffee,
  Lightbulb,
  Clock,
  Search,
} from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  showSearch?: boolean;
}

interface EmojiData {
  emoji: string;
  name: string;
  keywords: string[];
}

const STORAGE_KEY = "suggest-me-recent-emojis";

export function ChatEmojiPicker({
  onEmojiSelect,
  showSearch = true,
}: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [recentEmojis, setRecentEmojis] = useState<string[]>(
    [],
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent emojis from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentEmojis(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load recent emojis");
      }
    }
  }, []);

  const handleEmojiClick = (emoji: string) => {
    // Update recent emojis
    const updated = [
      emoji,
      ...recentEmojis.filter((e) => e !== emoji),
    ].slice(0, 32);
    setRecentEmojis(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    onEmojiSelect(emoji);
  };

  const emojiData: Record<string, EmojiData[]> = {
    smileys: [
      {
        emoji: "😀",
        name: "grinning",
        keywords: ["face", "smile", "happy"],
      },
      {
        emoji: "😃",
        name: "smiley",
        keywords: ["face", "happy", "joy"],
      },
      {
        emoji: "😄",
        name: "smile",
        keywords: ["face", "happy", "joy"],
      },
      {
        emoji: "😁",
        name: "grin",
        keywords: ["face", "happy", "smile"],
      },
      {
        emoji: "😆",
        name: "laughing",
        keywords: ["happy", "joy", "lol"],
      },
      {
        emoji: "😅",
        name: "sweat_smile",
        keywords: ["hot", "happy"],
      },
      {
        emoji: "🤣",
        name: "rofl",
        keywords: ["laughing", "lol"],
      },
      {
        emoji: "😂",
        name: "joy",
        keywords: ["tears", "weep", "happy", "lol"],
      },
      {
        emoji: "🙂",
        name: "slightly_smiling_face",
        keywords: ["smile"],
      },
      { emoji: "🙃", name: "upside_down", keywords: ["silly"] },
      {
        emoji: "😉",
        name: "wink",
        keywords: ["flirt", "smile"],
      },
      {
        emoji: "😊",
        name: "blush",
        keywords: ["smile", "happy", "pleased"],
      },
      { emoji: "😇", name: "innocent", keywords: ["angel"] },
      {
        emoji: "🥰",
        name: "smiling_face_with_hearts",
        keywords: ["love", "adore"],
      },
      {
        emoji: "😍",
        name: "heart_eyes",
        keywords: ["love", "crush"],
      },
      {
        emoji: "🤩",
        name: "star_struck",
        keywords: ["eyes", "wow"],
      },
      {
        emoji: "😘",
        name: "kissing_heart",
        keywords: ["love", "kiss"],
      },
      { emoji: "😗", name: "kissing", keywords: ["kiss"] },
      {
        emoji: "😚",
        name: "kissing_closed_eyes",
        keywords: ["kiss"],
      },
      {
        emoji: "😙",
        name: "kissing_smiling_eyes",
        keywords: ["kiss"],
      },
      {
        emoji: "🥲",
        name: "smiling_face_with_tear",
        keywords: ["sad", "cry", "happy"],
      },
      {
        emoji: "😵",
        name: "dizzy_face",
        keywords: ["sad", "cry", "happy"],
      },
      {
        emoji: "😋",
        name: "yum",
        keywords: ["tongue", "lick"],
      },
      {
        emoji: "😛",
        name: "stuck_out_tongue",
        keywords: ["silly"],
      },
      {
        emoji: "😜",
        name: "stuck_out_tongue_winking_eye",
        keywords: ["silly", "wink"],
      },
      {
        emoji: "🤪",
        name: "zany",
        keywords: ["silly", "crazy"],
      },
      {
        emoji: "😝",
        name: "stuck_out_tongue_closed_eyes",
        keywords: ["silly"],
      },
      {
        emoji: "🤑",
        name: "money_mouth",
        keywords: ["rich", "dollar"],
      },
      { emoji: "🤗", name: "hugging", keywords: ["hug"] },
      {
        emoji: "🤭",
        name: "hand_over_mouth",
        keywords: ["quiet", "secret"],
      },
      {
        emoji: "🤫",
        name: "shushing",
        keywords: ["quiet", "silent"],
      },
      {
        emoji: "🤔",
        name: "thinking",
        keywords: ["hmm", "think"],
      },
      {
        emoji: "🤐",
        name: "zipper_mouth",
        keywords: ["secret", "quiet"],
      },
      {
        emoji: "🤨",
        name: "raised_eyebrow",
        keywords: ["suspicious"],
      },
      { emoji: "😐", name: "neutral", keywords: ["meh"] },
      {
        emoji: "😑",
        name: "expressionless",
        keywords: ["meh"],
      },
      {
        emoji: "😶",
        name: "no_mouth",
        keywords: ["mute", "quiet"],
      },
      { emoji: "😏", name: "smirk", keywords: ["smug"] },
      { emoji: "😒", name: "unamused", keywords: ["meh"] },
      {
        emoji: "🙄",
        name: "rolling_eyes",
        keywords: ["eyeroll"],
      },
      { emoji: "😬", name: "grimacing", keywords: ["awkward"] },
      {
        emoji: "🤥",
        name: "lying",
        keywords: ["liar", "pinocchio"],
      },
      { emoji: "😌", name: "relieved", keywords: ["calm"] },
      { emoji: "😔", name: "pensive", keywords: ["sad"] },
      { emoji: "😪", name: "sleepy", keywords: ["tired"] },
      { emoji: "🤤", name: "drooling", keywords: ["hungry"] },
      {
        emoji: "😴",
        name: "sleeping",
        keywords: ["zzz", "tired"],
      },
      { emoji: "😷", name: "mask", keywords: ["sick", "ill"] },
      {
        emoji: "🤒",
        name: "thermometer",
        keywords: ["sick", "ill"],
      },
      {
        emoji: "🤕",
        name: "head_bandage",
        keywords: ["hurt", "injured"],
      },
      { emoji: "🤢", name: "nauseated", keywords: ["sick"] },
      { emoji: "🤮", name: "vomiting", keywords: ["sick"] },
      {
        emoji: "🤧",
        name: "sneezing",
        keywords: ["sick", "achoo"],
      },
      {
        emoji: "🥵",
        name: "hot",
        keywords: ["heat", "sweating"],
      },
      { emoji: "🥶", name: "cold", keywords: ["freezing"] },
      { emoji: "😎", name: "sunglasses", keywords: ["cool"] },
      {
        emoji: "🤓",
        name: "nerd",
        keywords: ["geek", "glasses"],
      },
      { emoji: "🧐", name: "monocle", keywords: ["stuffy"] },
      { emoji: "😕", name: "confused", keywords: ["puzzled"] },
      { emoji: "😟", name: "worried", keywords: ["concern"] },
      {
        emoji: "🙁",
        name: "slightly_frowning",
        keywords: ["sad"],
      },
      { emoji: "☹️", name: "frowning", keywords: ["sad"] },
      {
        emoji: "😮",
        name: "open_mouth",
        keywords: ["surprise", "wow"],
      },
      {
        emoji: "😯",
        name: "hushed",
        keywords: ["surprise", "wow"],
      },
      {
        emoji: "😲",
        name: "astonished",
        keywords: ["amazed", "wow"],
      },
      {
        emoji: "😳",
        name: "flushed",
        keywords: ["embarrassed"],
      },
      {
        emoji: "🥺",
        name: "pleading",
        keywords: ["puppy", "eyes"],
      },
      {
        emoji: "😦",
        name: "frowning_open_mouth",
        keywords: ["sad"],
      },
      { emoji: "😧", name: "anguished", keywords: ["stunned"] },
      {
        emoji: "😨",
        name: "fearful",
        keywords: ["scared", "shocked"],
      },
      {
        emoji: "😰",
        name: "cold_sweat",
        keywords: ["nervous"],
      },
      {
        emoji: "😥",
        name: "disappointed_relieved",
        keywords: ["sad"],
      },
      { emoji: "😢", name: "cry", keywords: ["sad", "tear"] },
      {
        emoji: "😭",
        name: "sob",
        keywords: ["sad", "cry", "bawling"],
      },
      {
        emoji: "😱",
        name: "scream",
        keywords: ["horror", "shocked"],
      },
      {
        emoji: "😖",
        name: "confounded",
        keywords: ["confused"],
      },
      {
        emoji: "😣",
        name: "persevere",
        keywords: ["struggle"],
      },
      { emoji: "😞", name: "disappointed", keywords: ["sad"] },
      { emoji: "😓", name: "sweat", keywords: ["hot"] },
      { emoji: "😩", name: "weary", keywords: ["tired"] },
      { emoji: "😫", name: "tired", keywords: ["exhausted"] },
      {
        emoji: "🥱",
        name: "yawning",
        keywords: ["tired", "bored"],
      },
      {
        emoji: "😤",
        name: "triumph",
        keywords: ["smug", "proud"],
      },
      { emoji: "😡", name: "rage", keywords: ["angry", "mad"] },
      {
        emoji: "😠",
        name: "angry",
        keywords: ["mad", "annoyed"],
      },
      {
        emoji: "🤬",
        name: "cursing",
        keywords: ["angry", "swearing"],
      },
      {
        emoji: "😈",
        name: "smiling_imp",
        keywords: ["devil", "evil"],
      },
      { emoji: "👿", name: "imp", keywords: ["devil", "evil"] },
      {
        emoji: "💀",
        name: "skull",
        keywords: ["dead", "danger"],
      },
      {
        emoji: "☠️",
        name: "skull_crossbones",
        keywords: ["danger", "pirate"],
      },
    ],
    gestures: [
      {
        emoji: "👋",
        name: "wave",
        keywords: ["hello", "hi", "goodbye"],
      },
      {
        emoji: "🤚",
        name: "raised_back_of_hand",
        keywords: ["stop"],
      },
      {
        emoji: "🖐️",
        name: "hand_splayed",
        keywords: ["five", "stop"],
      },
      {
        emoji: "✋",
        name: "raised_hand",
        keywords: ["stop", "high_five"],
      },
      {
        emoji: "🖖",
        name: "vulcan",
        keywords: ["spock", "star_trek"],
      },
      {
        emoji: "👌",
        name: "ok_hand",
        keywords: ["okay", "perfect"],
      },
      {
        emoji: "🤌",
        name: "pinched_fingers",
        keywords: ["italian"],
      },
      { emoji: "🤏", name: "pinching", keywords: ["small"] },
      { emoji: "✌️", name: "victory", keywords: ["peace"] },
      {
        emoji: "🤞",
        name: "fingers_crossed",
        keywords: ["luck", "hope"],
      },
      { emoji: "🤟", name: "love_you", keywords: ["ily"] },
      { emoji: "🤘", name: "metal", keywords: ["rock"] },
      { emoji: "🤙", name: "call_me", keywords: ["shaka"] },
      { emoji: "👈", name: "point_left", keywords: ["left"] },
      { emoji: "👉", name: "point_right", keywords: ["right"] },
      { emoji: "👆", name: "point_up_2", keywords: ["up"] },
      {
        emoji: "🖕",
        name: "middle_finger",
        keywords: ["rude"],
      },
      { emoji: "👇", name: "point_down", keywords: ["down"] },
      {
        emoji: "☝️",
        name: "point_up",
        keywords: ["up", "index"],
      },
      {
        emoji: "👍",
        name: "thumbsup",
        keywords: ["yes", "good", "like"],
      },
      {
        emoji: "👎",
        name: "thumbsdown",
        keywords: ["no", "bad", "dislike"],
      },
      { emoji: "✊", name: "fist", keywords: ["punch"] },
      { emoji: "👊", name: "punch", keywords: ["fist_bump"] },
      {
        emoji: "🤛",
        name: "left_fist",
        keywords: ["fist_bump"],
      },
      {
        emoji: "🤜",
        name: "right_fist",
        keywords: ["fist_bump"],
      },
      {
        emoji: "👏",
        name: "clap",
        keywords: ["applause", "bravo"],
      },
      {
        emoji: "🙌",
        name: "raised_hands",
        keywords: ["celebrate", "hooray"],
      },
      { emoji: "👐", name: "open_hands", keywords: ["hug"] },
      { emoji: "🤲", name: "palms_up", keywords: ["prayer"] },
      {
        emoji: "🤝",
        name: "handshake",
        keywords: ["deal", "agreement"],
      },
      {
        emoji: "🙏",
        name: "pray",
        keywords: ["thank_you", "namaste", "please"],
      },
      { emoji: "✍️", name: "writing", keywords: ["write"] },
      {
        emoji: "💪",
        name: "muscle",
        keywords: ["strong", "bicep"],
      },
    ],
    hearts: [
      { emoji: "❤️", name: "heart", keywords: ["love", "red"] },
      { emoji: "🧡", name: "orange_heart", keywords: ["love"] },
      { emoji: "💛", name: "yellow_heart", keywords: ["love"] },
      { emoji: "💚", name: "green_heart", keywords: ["love"] },
      { emoji: "💙", name: "blue_heart", keywords: ["love"] },
      { emoji: "💜", name: "purple_heart", keywords: ["love"] },
      { emoji: "🖤", name: "black_heart", keywords: ["evil"] },
      { emoji: "🤍", name: "white_heart", keywords: ["pure"] },
      { emoji: "🤎", name: "brown_heart", keywords: ["love"] },
      {
        emoji: "💔",
        name: "broken_heart",
        keywords: ["sad", "heartbreak"],
      },
      {
        emoji: "❤️‍🔥",
        name: "heart_on_fire",
        keywords: ["love", "passion"],
      },
      {
        emoji: "❤️‍🩹",
        name: "mending_heart",
        keywords: ["healing"],
      },
      { emoji: "💕", name: "two_hearts", keywords: ["love"] },
      {
        emoji: "💞",
        name: "revolving_hearts",
        keywords: ["love"],
      },
      {
        emoji: "💓",
        name: "heartbeat",
        keywords: ["love", "nervous"],
      },
      {
        emoji: "💗",
        name: "heartpulse",
        keywords: ["love", "nervous"],
      },
      {
        emoji: "💖",
        name: "sparkling_heart",
        keywords: ["love"],
      },
      {
        emoji: "💘",
        name: "cupid",
        keywords: ["love", "arrow"],
      },
      {
        emoji: "💝",
        name: "gift_heart",
        keywords: ["love", "chocolates"],
      },
      {
        emoji: "💟",
        name: "heart_decoration",
        keywords: ["love"],
      },
    ],
    nature: [
      { emoji: "🐶", name: "dog", keywords: ["pet", "animal"] },
      { emoji: "🐱", name: "cat", keywords: ["pet", "animal"] },
      { emoji: "🐭", name: "mouse", keywords: ["animal"] },
      { emoji: "🐹", name: "hamster", keywords: ["pet"] },
      {
        emoji: "🐰",
        name: "rabbit",
        keywords: ["bunny", "animal"],
      },
      { emoji: "🦊", name: "fox", keywords: ["animal"] },
      { emoji: "🐻", name: "bear", keywords: ["animal"] },
      { emoji: "🐼", name: "panda", keywords: ["animal"] },
      { emoji: "🐨", name: "koala", keywords: ["animal"] },
      { emoji: "🐯", name: "tiger", keywords: ["animal"] },
      { emoji: "🦁", name: "lion", keywords: ["animal"] },
      { emoji: "🐮", name: "cow", keywords: ["animal"] },
      { emoji: "🐷", name: "pig", keywords: ["animal"] },
      { emoji: "🐸", name: "frog", keywords: ["animal"] },
      { emoji: "🐵", name: "monkey", keywords: ["animal"] },
      {
        emoji: "🙈",
        name: "see_no_evil",
        keywords: ["monkey"],
      },
      {
        emoji: "🙉",
        name: "hear_no_evil",
        keywords: ["monkey"],
      },
      {
        emoji: "🙊",
        name: "speak_no_evil",
        keywords: ["monkey"],
      },
      {
        emoji: "🌸",
        name: "cherry_blossom",
        keywords: ["flower", "spring"],
      },
      { emoji: "🌹", name: "rose", keywords: ["flower"] },
      { emoji: "🌺", name: "hibiscus", keywords: ["flower"] },
      { emoji: "🌻", name: "sunflower", keywords: ["flower"] },
      { emoji: "🌼", name: "blossom", keywords: ["flower"] },
      { emoji: "🌷", name: "tulip", keywords: ["flower"] },
      { emoji: "🌱", name: "seedling", keywords: ["plant"] },
      {
        emoji: "🌲",
        name: "evergreen_tree",
        keywords: ["wood", "forest"],
      },
      {
        emoji: "🌳",
        name: "deciduous_tree",
        keywords: ["wood"],
      },
      {
        emoji: "🌴",
        name: "palm_tree",
        keywords: ["tropical"],
      },
      { emoji: "🌵", name: "cactus", keywords: ["desert"] },
      {
        emoji: "🍀",
        name: "four_leaf_clover",
        keywords: ["luck"],
      },
      {
        emoji: "🍁",
        name: "maple_leaf",
        keywords: ["canada", "fall"],
      },
      {
        emoji: "🍂",
        name: "fallen_leaf",
        keywords: ["autumn"],
      },
    ],
    food: [
      { emoji: "🍇", name: "grapes", keywords: ["fruit"] },
      { emoji: "🍉", name: "watermelon", keywords: ["fruit"] },
      { emoji: "🍊", name: "tangerine", keywords: ["fruit"] },
      { emoji: "🍋", name: "lemon", keywords: ["fruit"] },
      { emoji: "🍌", name: "banana", keywords: ["fruit"] },
      { emoji: "🍍", name: "pineapple", keywords: ["fruit"] },
      { emoji: "🍎", name: "apple", keywords: ["fruit"] },
      { emoji: "🍑", name: "peach", keywords: ["fruit"] },
      { emoji: "🍒", name: "cherries", keywords: ["fruit"] },
      { emoji: "🍓", name: "strawberry", keywords: ["fruit"] },
      { emoji: "🍕", name: "pizza", keywords: ["italian"] },
      { emoji: "🍔", name: "hamburger", keywords: ["burger"] },
      {
        emoji: "🍟",
        name: "fries",
        keywords: ["french_fries"],
      },
      { emoji: "🌭", name: "hotdog", keywords: ["sausage"] },
      { emoji: "🌮", name: "taco", keywords: ["mexican"] },
      { emoji: "🌯", name: "burrito", keywords: ["mexican"] },
      { emoji: "🍿", name: "popcorn", keywords: ["movie"] },
      { emoji: "🍱", name: "bento", keywords: ["japanese"] },
      {
        emoji: "🍜",
        name: "ramen",
        keywords: ["noodles", "japanese"],
      },
      {
        emoji: "🍝",
        name: "spaghetti",
        keywords: ["pasta", "italian"],
      },
      { emoji: "🍣", name: "sushi", keywords: ["japanese"] },
      { emoji: "🍦", name: "icecream", keywords: ["dessert"] },
      { emoji: "🍩", name: "doughnut", keywords: ["dessert"] },
      { emoji: "🍪", name: "cookie", keywords: ["dessert"] },
      {
        emoji: "🎂",
        name: "birthday",
        keywords: ["cake", "party"],
      },
      { emoji: "🍰", name: "cake", keywords: ["dessert"] },
      {
        emoji: "🍫",
        name: "chocolate_bar",
        keywords: ["dessert"],
      },
      { emoji: "🍬", name: "candy", keywords: ["sweet"] },
      { emoji: "🍭", name: "lollipop", keywords: ["candy"] },
      {
        emoji: "☕",
        name: "coffee",
        keywords: ["caffeine", "morning"],
      },
      {
        emoji: "🍵",
        name: "tea",
        keywords: ["green", "breakfast"],
      },
      {
        emoji: "🥤",
        name: "cup_with_straw",
        keywords: ["soda"],
      },
      {
        emoji: "🍺",
        name: "beer",
        keywords: ["drink", "alcohol"],
      },
      {
        emoji: "🍻",
        name: "beers",
        keywords: ["drinks", "cheers"],
      },
      {
        emoji: "🍷",
        name: "wine_glass",
        keywords: ["alcohol"],
      },
      {
        emoji: "🍸",
        name: "cocktail",
        keywords: ["drink", "alcohol"],
      },
    ],
    activities: [
      {
        emoji: "⚽",
        name: "soccer",
        keywords: ["sports", "football"],
      },
      { emoji: "🏀", name: "basketball", keywords: ["sports"] },
      { emoji: "🏈", name: "football", keywords: ["sports"] },
      { emoji: "⚾", name: "baseball", keywords: ["sports"] },
      { emoji: "🎾", name: "tennis", keywords: ["sports"] },
      { emoji: "🏐", name: "volleyball", keywords: ["sports"] },
      {
        emoji: "🎱",
        name: "8ball",
        keywords: ["pool", "billiards"],
      },
      {
        emoji: "🎮",
        name: "video_game",
        keywords: ["gaming", "controller"],
      },
      {
        emoji: "🎬",
        name: "clapper",
        keywords: ["movie", "film"],
      },
      {
        emoji: "🎤",
        name: "microphone",
        keywords: ["sing", "karaoke"],
      },
      { emoji: "🎧", name: "headphones", keywords: ["music"] },
      {
        emoji: "🎼",
        name: "musical_score",
        keywords: ["music"],
      },
      {
        emoji: "🎹",
        name: "musical_keyboard",
        keywords: ["piano"],
      },
      { emoji: "🎸", name: "guitar", keywords: ["music"] },
      {
        emoji: "🎨",
        name: "art",
        keywords: ["painting", "palette"],
      },
      {
        emoji: "🎭",
        name: "performing_arts",
        keywords: ["theater", "drama"],
      },
      {
        emoji: "🎪",
        name: "circus_tent",
        keywords: ["festival"],
      },
      {
        emoji: "🎯",
        name: "dart",
        keywords: ["target", "bullseye"],
      },
      { emoji: "🎳", name: "bowling", keywords: ["sports"] },
      {
        emoji: "🎿",
        name: "ski",
        keywords: ["sports", "snow"],
      },
      {
        emoji: "🏂",
        name: "snowboarder",
        keywords: ["sports", "snow"],
      },
      {
        emoji: "🏊",
        name: "swimmer",
        keywords: ["sports", "pool"],
      },
      {
        emoji: "🚴",
        name: "person_biking",
        keywords: ["sports", "bicycle"],
      },
      {
        emoji: "🧗",
        name: "person_climbing",
        keywords: ["sports"],
      },
    ],
    objects: [
      { emoji: "⭐", name: "star", keywords: ["night"] },
      { emoji: "✨", name: "sparkles", keywords: ["shiny"] },
      {
        emoji: "🌟",
        name: "glowing_star",
        keywords: ["shiny"],
      },
      { emoji: "💫", name: "dizzy", keywords: ["star"] },
      {
        emoji: "⚡",
        name: "zap",
        keywords: ["lightning", "thunder"],
      },
      { emoji: "🔥", name: "fire", keywords: ["flame", "hot"] },
      {
        emoji: "💥",
        name: "boom",
        keywords: ["collision", "explode"],
      },
      {
        emoji: "💯",
        name: "100",
        keywords: ["score", "perfect"],
      },
      {
        emoji: "✅",
        name: "white_check_mark",
        keywords: ["done", "complete"],
      },
      { emoji: "❌", name: "x", keywords: ["cancel", "no"] },
      {
        emoji: "🎉",
        name: "tada",
        keywords: ["party", "celebration"],
      },
      {
        emoji: "🎊",
        name: "confetti_ball",
        keywords: ["party"],
      },
      {
        emoji: "🎈",
        name: "balloon",
        keywords: ["party", "birthday"],
      },
      {
        emoji: "🎁",
        name: "gift",
        keywords: ["present", "birthday"],
      },
      {
        emoji: "🏆",
        name: "trophy",
        keywords: ["award", "winner"],
      },
      {
        emoji: "🥇",
        name: "first_place",
        keywords: ["gold", "winner"],
      },
      {
        emoji: "🥈",
        name: "second_place",
        keywords: ["silver"],
      },
      {
        emoji: "🥉",
        name: "third_place",
        keywords: ["bronze"],
      },
      {
        emoji: "📱",
        name: "iphone",
        keywords: ["mobile", "phone"],
      },
      {
        emoji: "💻",
        name: "computer",
        keywords: ["laptop", "work"],
      },
      { emoji: "⌨️", name: "keyboard", keywords: ["computer"] },
      { emoji: "🖱️", name: "mouse", keywords: ["computer"] },
      { emoji: "📷", name: "camera", keywords: ["photo"] },
      {
        emoji: "📸",
        name: "camera_with_flash",
        keywords: ["photo"],
      },
      { emoji: "🎥", name: "movie_camera", keywords: ["film"] },
      {
        emoji: "📞",
        name: "telephone_receiver",
        keywords: ["phone", "call"],
      },
      {
        emoji: "💡",
        name: "bulb",
        keywords: ["idea", "light"],
      },
      {
        emoji: "🔑",
        name: "key",
        keywords: ["lock", "password"],
      },
      { emoji: "🔨", name: "hammer", keywords: ["tool"] },
      { emoji: "🔧", name: "wrench", keywords: ["tool"] },
      { emoji: "⚙️", name: "gear", keywords: ["cog"] },
      {
        emoji: "💰",
        name: "moneybag",
        keywords: ["dollar", "cream"],
      },
      { emoji: "💵", name: "dollar", keywords: ["money"] },
      {
        emoji: "💳",
        name: "credit_card",
        keywords: ["subscription"],
      },
      { emoji: "💎", name: "gem", keywords: ["diamond"] },
      {
        emoji: "🎯",
        name: "dart",
        keywords: ["target", "bullseye"],
      },
    ],
  };

  const filteredEmojis = useMemo(() => {
    if (!searchQuery) return null;

    const query = searchQuery.toLowerCase();
    const results: EmojiData[] = [];

    Object.values(emojiData).forEach((category) => {
      category.forEach((emojiObj) => {
        if (
          emojiObj.name.includes(query) ||
          emojiObj.keywords.some((keyword) =>
            keyword.includes(query),
          )
        ) {
          results.push(emojiObj);
        }
      });
    });

    return results;
  }, [searchQuery, emojiData]);

  const displayEmojis = searchQuery
    ? filteredEmojis
    : activeTab === "recent"
      ? recentEmojis
      : emojiData[activeTab as keyof typeof emojiData]?.map(
          (e) => e.emoji,
        ) || [];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full flex flex-col h-full max-h-[400px]">
        {/* Search Bar */}
        {showSearch && (
          <div className="p-3 border-b flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="w-full justify-start px-2 h-12 bg-muted/50 flex-shrink-0">
            <TabsTrigger
              value="recent"
              className="px-2 py-1.5"
              title="Recent"
            >
              <Clock className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="smileys"
              className="px-2 py-1.5"
              title="Smileys & People"
            >
              <Smile className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="gestures"
              className="px-2 py-1.5"
              title="Gestures"
            >
              <span className="text-base">👋</span>
            </TabsTrigger>
            <TabsTrigger
              value="hearts"
              className="px-2 py-1.5"
              title="Hearts & Symbols"
            >
              <Heart className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="nature"
              className="px-2 py-1.5"
              title="Animals & Nature"
            >
              <span className="text-base">🐶</span>
            </TabsTrigger>
            <TabsTrigger
              value="food"
              className="px-2 py-1.5"
              title="Food & Drink"
            >
              <Coffee className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="px-2 py-1.5"
              title="Activities"
            >
              <span className="text-base">⚽</span>
            </TabsTrigger>
            <TabsTrigger
              value="objects"
              className="px-2 py-1.5"
              title="Objects"
            >
              <Lightbulb className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="overflow-y-auto min-h-[200px] max-h-[200px] scrollbar-hide">
            <div className="p-3">
              {searchQuery && filteredEmojis ? (
                // Search Results
                filteredEmojis.length > 0 ? (
                  <div className="grid grid-cols-8 gap-1">
                    {filteredEmojis.map((emojiObj, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              handleEmojiClick(emojiObj.emoji)
                            }
                            className="text-2xl w-10 h-10 flex items-center justify-center hover:bg-muted rounded-md transition-all duration-200 hover:scale-110 active:scale-95"
                          >
                            <span className="inline-flex items-center justify-center transition-transform duration-150 hover:rotate-12">
                              {emojiObj.emoji}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="text-xs"
                        >
                          {emojiObj.name}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No emojis found</p>
                  </div>
                )
              ) : activeTab === "recent" ? (
                // Recent Emojis
                recentEmojis.length > 0 ? (
                  <div className="grid grid-cols-8 gap-1">
                    {recentEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-2xl w-10 h-10 flex items-center justify-center hover:bg-muted rounded-md transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <span className="inline-flex items-center justify-center transition-transform duration-150 hover:rotate-12">
                          {emoji}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent emojis</p>
                    <p className="text-xs mt-1">
                      Your recently used emojis will appear here
                    </p>
                  </div>
                )
              ) : (
                // Category Emojis
                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-8 gap-1">
                    {(
                      emojiData[
                        activeTab as keyof typeof emojiData
                      ] || []
                    ).map((emojiObj, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              handleEmojiClick(emojiObj.emoji)
                            }
                            className="text-2xl w-10 h-10 flex items-center justify-center hover:bg-muted rounded-md transition-all duration-200 hover:scale-110 active:scale-95"
                          >
                            <span className="inline-flex items-center justify-center transition-transform duration-150 hover:rotate-12">
                              {emojiObj.emoji}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="text-xs"
                        >
                          {emojiObj.name}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TabsContent>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}