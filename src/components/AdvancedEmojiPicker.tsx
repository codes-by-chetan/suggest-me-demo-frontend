import { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Smile,
  Heart,
  Coffee,
  Flag,
  Lightbulb,
  Clock,
  Search,
} from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  showSearch?: boolean;
}

interface EmojiData {
  emoji: string;
  name: string;
  keywords: string[];
}

const STORAGE_KEY = 'suggest-me-recent-emojis';

export function AdvancedEmojiPicker({
  onEmojiSelect,
  showSearch = true,
}: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recent');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent emojis from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentEmojis(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load recent emojis');
      }
    }
  }, []);

  const handleEmojiClick = (emoji: string) => {
    // Update recent emojis
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(
      0,
      32
    );
    setRecentEmojis(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    onEmojiSelect(emoji);
  };

  const emojiData: Record<string, EmojiData[]> = {
    smileys: [
      { emoji: '😀', name: 'grinning', keywords: ['face', 'smile', 'happy'] },
      { emoji: '😃', name: 'smiley', keywords: ['face', 'happy', 'joy'] },
      { emoji: '😄', name: 'smile', keywords: ['face', 'happy', 'joy'] },
      { emoji: '😁', name: 'grin', keywords: ['face', 'happy', 'smile'] },
      { emoji: '😆', name: 'laughing', keywords: ['happy', 'joy', 'lol'] },
      { emoji: '😅', name: 'sweat_smile', keywords: ['hot', 'happy'] },
      { emoji: '🤣', name: 'rofl', keywords: ['laughing', 'lol'] },
      { emoji: '😂', name: 'joy', keywords: ['tears', 'weep', 'happy', 'lol'] },
      { emoji: '🙂', name: 'slightly_smiling_face', keywords: ['smile'] },
      { emoji: '🙃', name: 'upside_down', keywords: ['silly'] },
      { emoji: '😉', name: 'wink', keywords: ['flirt', 'smile'] },
      { emoji: '😊', name: 'blush', keywords: ['smile', 'happy', 'pleased'] },
      { emoji: '😇', name: 'innocent', keywords: ['angel'] },
      { emoji: '🥰', name: 'smiling_face_with_hearts', keywords: ['love', 'adore'] },
      { emoji: '😍', name: 'heart_eyes', keywords: ['love', 'crush'] },
      { emoji: '🤩', name: 'star_struck', keywords: ['eyes', 'wow'] },
      { emoji: '😘', name: 'kissing_heart', keywords: ['love', 'kiss'] },
      { emoji: '😗', name: 'kissing', keywords: ['kiss'] },
      { emoji: '😚', name: 'kissing_closed_eyes', keywords: ['kiss'] },
      { emoji: '😙', name: 'kissing_smiling_eyes', keywords: ['kiss'] },
      { emoji: '🥲', name: 'smiling_face_with_tear', keywords: ['sad', 'cry', 'happy'] },
      { emoji: '😋', name: 'yum', keywords: ['tongue', 'lick'] },
      { emoji: '😛', name: 'stuck_out_tongue', keywords: ['silly'] },
      { emoji: '😜', name: 'stuck_out_tongue_winking_eye', keywords: ['silly', 'wink'] },
      { emoji: '🤪', name: 'zany', keywords: ['silly', 'crazy'] },
      { emoji: '😝', name: 'stuck_out_tongue_closed_eyes', keywords: ['silly'] },
      { emoji: '🤑', name: 'money_mouth', keywords: ['rich', 'dollar'] },
      { emoji: '🤗', name: 'hugging', keywords: ['hug'] },
      { emoji: '🤭', name: 'hand_over_mouth', keywords: ['quiet', 'secret'] },
      { emoji: '🤫', name: 'shushing', keywords: ['quiet', 'silent'] },
      { emoji: '🤔', name: 'thinking', keywords: ['hmm', 'think'] },
      { emoji: '🤐', name: 'zipper_mouth', keywords: ['secret', 'quiet'] },
      { emoji: '🤨', name: 'raised_eyebrow', keywords: ['suspicious'] },
      { emoji: '😐', name: 'neutral', keywords: ['meh'] },
      { emoji: '😑', name: 'expressionless', keywords: ['meh'] },
      { emoji: '😶', name: 'no_mouth', keywords: ['mute', 'quiet'] },
      { emoji: '😏', name: 'smirk', keywords: ['smug'] },
      { emoji: '😒', name: 'unamused', keywords: ['meh'] },
      { emoji: '🙄', name: 'rolling_eyes', keywords: ['eyeroll'] },
      { emoji: '😬', name: 'grimacing', keywords: ['awkward'] },
      { emoji: '🤥', name: 'lying', keywords: ['liar', 'pinocchio'] },
      { emoji: '😌', name: 'relieved', keywords: ['calm'] },
      { emoji: '😔', name: 'pensive', keywords: ['sad'] },
      { emoji: '😪', name: 'sleepy', keywords: ['tired'] },
      { emoji: '🤤', name: 'drooling', keywords: ['hungry'] },
      { emoji: '😴', name: 'sleeping', keywords: ['zzz', 'tired'] },
      { emoji: '😷', name: 'mask', keywords: ['sick', 'ill'] },
      { emoji: '🤒', name: 'thermometer', keywords: ['sick', 'ill'] },
      { emoji: '🤕', name: 'head_bandage', keywords: ['hurt', 'injured'] },
      { emoji: '🤢', name: 'nauseated', keywords: ['sick'] },
      { emoji: '🤮', name: 'vomiting', keywords: ['sick'] },
      { emoji: '🤧', name: 'sneezing', keywords: ['sick', 'achoo'] },
      { emoji: '🥵', name: 'hot', keywords: ['heat', 'sweating'] },
      { emoji: '🥶', name: 'cold', keywords: ['freezing'] },
      { emoji: '😎', name: 'sunglasses', keywords: ['cool'] },
      { emoji: '🤓', name: 'nerd', keywords: ['geek', 'glasses'] },
      { emoji: '🧐', name: 'monocle', keywords: ['stuffy'] },
      { emoji: '😕', name: 'confused', keywords: ['puzzled'] },
      { emoji: '😟', name: 'worried', keywords: ['concern'] },
      { emoji: '🙁', name: 'slightly_frowning', keywords: ['sad'] },
      { emoji: '☹️', name: 'frowning', keywords: ['sad'] },
      { emoji: '😮', name: 'open_mouth', keywords: ['surprise', 'wow'] },
      { emoji: '😯', name: 'hushed', keywords: ['surprise', 'wow'] },
      { emoji: '😲', name: 'astonished', keywords: ['amazed', 'wow'] },
      { emoji: '😳', name: 'flushed', keywords: ['embarrassed'] },
      { emoji: '🥺', name: 'pleading', keywords: ['puppy', 'eyes'] },
      { emoji: '😦', name: 'frowning_open_mouth', keywords: ['sad'] },
      { emoji: '😧', name: 'anguished', keywords: ['stunned'] },
      { emoji: '😨', name: 'fearful', keywords: ['scared', 'shocked'] },
      { emoji: '😰', name: 'cold_sweat', keywords: ['nervous'] },
      { emoji: '😥', name: 'disappointed_relieved', keywords: ['sad'] },
      { emoji: '😢', name: 'cry', keywords: ['sad', 'tear'] },
      { emoji: '😭', name: 'sob', keywords: ['sad', 'cry', 'bawling'] },
      { emoji: '😱', name: 'scream', keywords: ['horror', 'shocked'] },
      { emoji: '😖', name: 'confounded', keywords: ['confused'] },
      { emoji: '😣', name: 'persevere', keywords: ['struggle'] },
      { emoji: '😞', name: 'disappointed', keywords: ['sad'] },
      { emoji: '😓', name: 'sweat', keywords: ['hot'] },
      { emoji: '😩', name: 'weary', keywords: ['tired'] },
      { emoji: '😫', name: 'tired', keywords: ['exhausted'] },
      { emoji: '🥱', name: 'yawning', keywords: ['tired', 'bored'] },
      { emoji: '😤', name: 'triumph', keywords: ['smug', 'proud'] },
      { emoji: '😡', name: 'rage', keywords: ['angry', 'mad'] },
      { emoji: '😠', name: 'angry', keywords: ['mad', 'annoyed'] },
      { emoji: '🤬', name: 'cursing', keywords: ['angry', 'swearing'] },
      { emoji: '😈', name: 'smiling_imp', keywords: ['devil', 'evil'] },
      { emoji: '👿', name: 'imp', keywords: ['devil', 'evil'] },
      { emoji: '💀', name: 'skull', keywords: ['dead', 'danger'] },
      { emoji: '☠️', name: 'skull_crossbones', keywords: ['danger', 'pirate'] },
    ],
    gestures: [
      { emoji: '👋', name: 'wave', keywords: ['hello', 'hi', 'goodbye'] },
      { emoji: '🤚', name: 'raised_back_of_hand', keywords: ['stop'] },
      { emoji: '🖐️', name: 'hand_splayed', keywords: ['five', 'stop'] },
      { emoji: '✋', name: 'raised_hand', keywords: ['stop', 'high_five'] },
      { emoji: '🖖', name: 'vulcan', keywords: ['spock', 'star_trek'] },
      { emoji: '👌', name: 'ok_hand', keywords: ['okay', 'perfect'] },
      { emoji: '🤌', name: 'pinched_fingers', keywords: ['italian'] },
      { emoji: '🤏', name: 'pinching', keywords: ['small'] },
      { emoji: '✌️', name: 'victory', keywords: ['peace'] },
      { emoji: '🤞', name: 'fingers_crossed', keywords: ['luck', 'hope'] },
      { emoji: '🤟', name: 'love_you', keywords: ['ily'] },
      { emoji: '🤘', name: 'metal', keywords: ['rock'] },
      { emoji: '🤙', name: 'call_me', keywords: ['shaka'] },
      { emoji: '👈', name: 'point_left', keywords: ['left'] },
      { emoji: '👉', name: 'point_right', keywords: ['right'] },
      { emoji: '👆', name: 'point_up_2', keywords: ['up'] },
      { emoji: '🖕', name: 'middle_finger', keywords: ['rude'] },
      { emoji: '👇', name: 'point_down', keywords: ['down'] },
      { emoji: '☝️', name: 'point_up', keywords: ['up', 'index'] },
      { emoji: '👍', name: 'thumbsup', keywords: ['yes', 'good', 'like'] },
      { emoji: '👎', name: 'thumbsdown', keywords: ['no', 'bad', 'dislike'] },
      { emoji: '✊', name: 'fist', keywords: ['punch'] },
      { emoji: '👊', name: 'punch', keywords: ['fist_bump'] },
      { emoji: '🤛', name: 'left_fist', keywords: ['fist_bump'] },
      { emoji: '🤜', name: 'right_fist', keywords: ['fist_bump'] },
      { emoji: '👏', name: 'clap', keywords: ['applause', 'bravo'] },
      { emoji: '🙌', name: 'raised_hands', keywords: ['celebrate', 'hooray'] },
      { emoji: '👐', name: 'open_hands', keywords: ['hug'] },
      { emoji: '🤲', name: 'palms_up', keywords: ['prayer'] },
      { emoji: '🤝', name: 'handshake', keywords: ['deal', 'agreement'] },
      { emoji: '🙏', name: 'pray', keywords: ['thank_you', 'namaste', 'please'] },
      { emoji: '✍️', name: 'writing', keywords: ['write'] },
      { emoji: '💪', name: 'muscle', keywords: ['strong', 'bicep'] },
      { emoji: '🦾', name: 'mechanical_arm', keywords: ['prosthetic'] },
      { emoji: '🦿', name: 'mechanical_leg', keywords: ['prosthetic'] },
      { emoji: '🦵', name: 'leg', keywords: ['kick'] },
      { emoji: '🦶', name: 'foot', keywords: ['kick'] },
      { emoji: '👂', name: 'ear', keywords: ['hear', 'listen'] },
      { emoji: '🦻', name: 'ear_with_hearing_aid', keywords: ['accessibility'] },
      { emoji: '👃', name: 'nose', keywords: ['smell'] },
      { emoji: '🧠', name: 'brain', keywords: ['smart', 'intelligent'] },
      { emoji: '🦷', name: 'tooth', keywords: ['dentist'] },
      { emoji: '🦴', name: 'bone', keywords: ['skeleton'] },
      { emoji: '👀', name: 'eyes', keywords: ['look', 'watch'] },
      { emoji: '👁️', name: 'eye', keywords: ['look'] },
      { emoji: '👅', name: 'tongue', keywords: ['taste'] },
      { emoji: '👄', name: 'lips', keywords: ['kiss'] },
    ],
    hearts: [
      { emoji: '❤️', name: 'heart', keywords: ['love', 'red'] },
      { emoji: '🧡', name: 'orange_heart', keywords: ['love'] },
      { emoji: '💛', name: 'yellow_heart', keywords: ['love'] },
      { emoji: '💚', name: 'green_heart', keywords: ['love'] },
      { emoji: '💙', name: 'blue_heart', keywords: ['love'] },
      { emoji: '💜', name: 'purple_heart', keywords: ['love'] },
      { emoji: '🖤', name: 'black_heart', keywords: ['evil'] },
      { emoji: '🤍', name: 'white_heart', keywords: ['pure'] },
      { emoji: '🤎', name: 'brown_heart', keywords: ['love'] },
      { emoji: '💔', name: 'broken_heart', keywords: ['sad', 'heartbreak'] },
      { emoji: '❤️‍🔥', name: 'heart_on_fire', keywords: ['love', 'passion'] },
      { emoji: '❤️‍🩹', name: 'mending_heart', keywords: ['healing'] },
      { emoji: '💕', name: 'two_hearts', keywords: ['love'] },
      { emoji: '💞', name: 'revolving_hearts', keywords: ['love'] },
      { emoji: '💓', name: 'heartbeat', keywords: ['love', 'nervous'] },
      { emoji: '💗', name: 'heartpulse', keywords: ['love', 'nervous'] },
      { emoji: '💖', name: 'sparkling_heart', keywords: ['love'] },
      { emoji: '💘', name: 'cupid', keywords: ['love', 'arrow'] },
      { emoji: '💝', name: 'gift_heart', keywords: ['love', 'chocolates'] },
      { emoji: '💟', name: 'heart_decoration', keywords: ['love'] },
      { emoji: '☮️', name: 'peace', keywords: ['hippie'] },
      { emoji: '✝️', name: 'cross', keywords: ['christian'] },
      { emoji: '☪️', name: 'star_and_crescent', keywords: ['islam'] },
      { emoji: '🕉️', name: 'om', keywords: ['hinduism'] },
      { emoji: '☸️', name: 'wheel_of_dharma', keywords: ['buddhism'] },
      { emoji: '✡️', name: 'star_of_david', keywords: ['judaism'] },
      { emoji: '🔯', name: 'six_pointed_star', keywords: ['purple'] },
      { emoji: '🕎', name: 'menorah', keywords: ['hanukkah'] },
      { emoji: '☯️', name: 'yin_yang', keywords: ['balance'] },
      { emoji: '☦️', name: 'orthodox_cross', keywords: ['christianity'] },
      { emoji: '💟', name: 'heart_decoration', keywords: ['purple_square'] },
    ],
    nature: [
      { emoji: '🐶', name: 'dog', keywords: ['pet', 'animal'] },
      { emoji: '🐱', name: 'cat', keywords: ['pet', 'animal'] },
      { emoji: '🐭', name: 'mouse', keywords: ['animal'] },
      { emoji: '🐹', name: 'hamster', keywords: ['pet'] },
      { emoji: '🐰', name: 'rabbit', keywords: ['bunny', 'animal'] },
      { emoji: '🦊', name: 'fox', keywords: ['animal'] },
      { emoji: '🐻', name: 'bear', keywords: ['animal'] },
      { emoji: '🐼', name: 'panda', keywords: ['animal'] },
      { emoji: '🐨', name: 'koala', keywords: ['animal'] },
      { emoji: '🐯', name: 'tiger', keywords: ['animal'] },
      { emoji: '🦁', name: 'lion', keywords: ['animal'] },
      { emoji: '🐮', name: 'cow', keywords: ['animal'] },
      { emoji: '🐷', name: 'pig', keywords: ['animal'] },
      { emoji: '🐸', name: 'frog', keywords: ['animal'] },
      { emoji: '🐵', name: 'monkey', keywords: ['animal'] },
      { emoji: '🙈', name: 'see_no_evil', keywords: ['monkey'] },
      { emoji: '🙉', name: 'hear_no_evil', keywords: ['monkey'] },
      { emoji: '🙊', name: 'speak_no_evil', keywords: ['monkey'] },
      { emoji: '🐒', name: 'monkey2', keywords: ['animal'] },
      { emoji: '🐔', name: 'chicken', keywords: ['bird'] },
      { emoji: '🐧', name: 'penguin', keywords: ['bird'] },
      { emoji: '🐦', name: 'bird', keywords: ['animal'] },
      { emoji: '🐤', name: 'baby_chick', keywords: ['bird'] },
      { emoji: '🐣', name: 'hatching_chick', keywords: ['born', 'baby'] },
      { emoji: '🐥', name: 'hatched_chick', keywords: ['baby'] },
      { emoji: '🦆', name: 'duck', keywords: ['bird'] },
      { emoji: '🦅', name: 'eagle', keywords: ['bird'] },
      { emoji: '🦉', name: 'owl', keywords: ['bird', 'wise'] },
      { emoji: '🦇', name: 'bat', keywords: ['vampire'] },
      { emoji: '🐺', name: 'wolf', keywords: ['animal'] },
      { emoji: '🐗', name: 'boar', keywords: ['animal'] },
      { emoji: '🐴', name: 'horse', keywords: ['animal'] },
      { emoji: '🦄', name: 'unicorn', keywords: ['magical'] },
      { emoji: '🐝', name: 'bee', keywords: ['insect'] },
      { emoji: '🐛', name: 'bug', keywords: ['insect'] },
      { emoji: '🦋', name: 'butterfly', keywords: ['insect'] },
      { emoji: '🐌', name: 'snail', keywords: ['slow'] },
      { emoji: '🐞', name: 'beetle', keywords: ['bug', 'ladybug'] },
      { emoji: '🐜', name: 'ant', keywords: ['insect'] },
      { emoji: '🦟', name: 'mosquito', keywords: ['insect'] },
      { emoji: '🦗', name: 'cricket', keywords: ['insect'] },
      { emoji: '🕷️', name: 'spider', keywords: ['insect'] },
      { emoji: '🦂', name: 'scorpion', keywords: ['insect'] },
      { emoji: '🐢', name: 'turtle', keywords: ['slow', 'nature'] },
      { emoji: '🐍', name: 'snake', keywords: ['reptile'] },
      { emoji: '🦎', name: 'lizard', keywords: ['reptile'] },
      { emoji: '🦖', name: 't-rex', keywords: ['dinosaur'] },
      { emoji: '🦕', name: 'sauropod', keywords: ['dinosaur'] },
      { emoji: '🐙', name: 'octopus', keywords: ['sea'] },
      { emoji: '🦑', name: 'squid', keywords: ['sea'] },
      { emoji: '🦐', name: 'shrimp', keywords: ['seafood'] },
      { emoji: '🦞', name: 'lobster', keywords: ['seafood'] },
      { emoji: '🦀', name: 'crab', keywords: ['seafood'] },
      { emoji: '🐡', name: 'blowfish', keywords: ['fish'] },
      { emoji: '🐠', name: 'tropical_fish', keywords: ['fish'] },
      { emoji: '🐟', name: 'fish', keywords: ['seafood'] },
      { emoji: '🐬', name: 'dolphin', keywords: ['flipper'] },
      { emoji: '🐳', name: 'whale', keywords: ['sea'] },
      { emoji: '🐋', name: 'whale2', keywords: ['sea'] },
      { emoji: '🦈', name: 'shark', keywords: ['fish', 'sea'] },
      { emoji: '🌸', name: 'cherry_blossom', keywords: ['flower', 'spring'] },
      { emoji: '💮', name: 'white_flower', keywords: ['japanese'] },
      { emoji: '🏵️', name: 'rosette', keywords: ['flower'] },
      { emoji: '🌹', name: 'rose', keywords: ['flower'] },
      { emoji: '🥀', name: 'wilted_rose', keywords: ['flower'] },
      { emoji: '🌺', name: 'hibiscus', keywords: ['flower'] },
      { emoji: '🌻', name: 'sunflower', keywords: ['flower'] },
      { emoji: '🌼', name: 'blossom', keywords: ['flower'] },
      { emoji: '🌷', name: 'tulip', keywords: ['flower'] },
      { emoji: '🌱', name: 'seedling', keywords: ['plant'] },
      { emoji: '🌲', name: 'evergreen_tree', keywords: ['wood', 'forest'] },
      { emoji: '🌳', name: 'deciduous_tree', keywords: ['wood'] },
      { emoji: '🌴', name: 'palm_tree', keywords: ['tropical'] },
      { emoji: '🌵', name: 'cactus', keywords: ['desert'] },
      { emoji: '🌾', name: 'ear_of_rice', keywords: ['plant'] },
      { emoji: '🌿', name: 'herb', keywords: ['plant', 'leaf'] },
      { emoji: '☘️', name: 'shamrock', keywords: ['plant', 'irish'] },
      { emoji: '🍀', name: 'four_leaf_clover', keywords: ['luck'] },
      { emoji: '🍁', name: 'maple_leaf', keywords: ['canada', 'fall'] },
      { emoji: '🍂', name: 'fallen_leaf', keywords: ['autumn'] },
      { emoji: '🍃', name: 'leaves', keywords: ['plant'] },
    ],
    food: [
      { emoji: '🍇', name: 'grapes', keywords: ['fruit'] },
      { emoji: '🍈', name: 'melon', keywords: ['fruit'] },
      { emoji: '🍉', name: 'watermelon', keywords: ['fruit'] },
      { emoji: '🍊', name: 'tangerine', keywords: ['fruit'] },
      { emoji: '🍋', name: 'lemon', keywords: ['fruit'] },
      { emoji: '🍌', name: 'banana', keywords: ['fruit'] },
      { emoji: '🍍', name: 'pineapple', keywords: ['fruit'] },
      { emoji: '🥭', name: 'mango', keywords: ['fruit'] },
      { emoji: '🍎', name: 'apple', keywords: ['fruit'] },
      { emoji: '🍏', name: 'green_apple', keywords: ['fruit'] },
      { emoji: '🍐', name: 'pear', keywords: ['fruit'] },
      { emoji: '🍑', name: 'peach', keywords: ['fruit'] },
      { emoji: '🍒', name: 'cherries', keywords: ['fruit'] },
      { emoji: '🍓', name: 'strawberry', keywords: ['fruit'] },
      { emoji: '🥝', name: 'kiwi', keywords: ['fruit'] },
      { emoji: '🍅', name: 'tomato', keywords: ['vegetable'] },
      { emoji: '🥥', name: 'coconut', keywords: ['palm'] },
      { emoji: '🥑', name: 'avocado', keywords: ['fruit'] },
      { emoji: '🍆', name: 'eggplant', keywords: ['vegetable', 'aubergine'] },
      { emoji: '🥔', name: 'potato', keywords: ['vegetable'] },
      { emoji: '🥕', name: 'carrot', keywords: ['vegetable'] },
      { emoji: '🌽', name: 'corn', keywords: ['vegetable'] },
      { emoji: '🌶️', name: 'hot_pepper', keywords: ['spicy'] },
      { emoji: '🥒', name: 'cucumber', keywords: ['vegetable'] },
      { emoji: '🥬', name: 'leafy_green', keywords: ['vegetable'] },
      { emoji: '🥦', name: 'broccoli', keywords: ['vegetable'] },
      { emoji: '🧄', name: 'garlic', keywords: ['vegetable'] },
      { emoji: '🧅', name: 'onion', keywords: ['vegetable'] },
      { emoji: '🍄', name: 'mushroom', keywords: ['vegetable'] },
      { emoji: '🥜', name: 'peanuts', keywords: ['nut'] },
      { emoji: '🌰', name: 'chestnut', keywords: ['nut'] },
      { emoji: '🍞', name: 'bread', keywords: ['toast'] },
      { emoji: '🥐', name: 'croissant', keywords: ['bread', 'french'] },
      { emoji: '🥖', name: 'baguette', keywords: ['bread', 'french'] },
      { emoji: '🥨', name: 'pretzel', keywords: ['bread'] },
      { emoji: '🥯', name: 'bagel', keywords: ['bread'] },
      { emoji: '🥞', name: 'pancakes', keywords: ['breakfast'] },
      { emoji: '🧇', name: 'waffle', keywords: ['breakfast'] },
      { emoji: '🧀', name: 'cheese', keywords: ['dairy'] },
      { emoji: '🍖', name: 'meat_on_bone', keywords: ['meat'] },
      { emoji: '🍗', name: 'poultry_leg', keywords: ['meat', 'chicken'] },
      { emoji: '🥩', name: 'cut_of_meat', keywords: ['steak'] },
      { emoji: '🥓', name: 'bacon', keywords: ['meat'] },
      { emoji: '🍔', name: 'hamburger', keywords: ['burger'] },
      { emoji: '🍟', name: 'fries', keywords: ['french_fries'] },
      { emoji: '🍕', name: 'pizza', keywords: ['italian'] },
      { emoji: '🌭', name: 'hotdog', keywords: ['sausage'] },
      { emoji: '🥪', name: 'sandwich', keywords: ['bread'] },
      { emoji: '🌮', name: 'taco', keywords: ['mexican'] },
      { emoji: '🌯', name: 'burrito', keywords: ['mexican'] },
      { emoji: '🥙', name: 'stuffed_flatbread', keywords: ['pita'] },
      { emoji: '🧆', name: 'falafel', keywords: ['chickpea'] },
      { emoji: '🥚', name: 'egg', keywords: ['breakfast'] },
      { emoji: '🍳', name: 'cooking', keywords: ['breakfast', 'egg'] },
      { emoji: '🥘', name: 'paella', keywords: ['food'] },
      { emoji: '🍲', name: 'stew', keywords: ['food'] },
      { emoji: '🥣', name: 'bowl_with_spoon', keywords: ['breakfast', 'cereal'] },
      { emoji: '🥗', name: 'salad', keywords: ['healthy'] },
      { emoji: '🍿', name: 'popcorn', keywords: ['movie'] },
      { emoji: '🧈', name: 'butter', keywords: ['dairy'] },
      { emoji: '🧂', name: 'salt', keywords: ['seasoning'] },
      { emoji: '🥫', name: 'canned_food', keywords: ['soup'] },
      { emoji: '🍱', name: 'bento', keywords: ['japanese'] },
      { emoji: '🍘', name: 'rice_cracker', keywords: ['japanese'] },
      { emoji: '🍙', name: 'rice_ball', keywords: ['japanese'] },
      { emoji: '🍚', name: 'rice', keywords: ['japanese'] },
      { emoji: '🍛', name: 'curry', keywords: ['indian', 'spicy'] },
      { emoji: '🍜', name: 'ramen', keywords: ['noodles', 'japanese'] },
      { emoji: '🍝', name: 'spaghetti', keywords: ['pasta', 'italian'] },
      { emoji: '🍠', name: 'sweet_potato', keywords: ['vegetable'] },
      { emoji: '🍢', name: 'oden', keywords: ['japanese'] },
      { emoji: '🍣', name: 'sushi', keywords: ['japanese'] },
      { emoji: '🍤', name: 'fried_shrimp', keywords: ['tempura'] },
      { emoji: '🍥', name: 'fish_cake', keywords: ['japanese'] },
      { emoji: '🥮', name: 'moon_cake', keywords: ['chinese'] },
      { emoji: '🍡', name: 'dango', keywords: ['japanese', 'dessert'] },
      { emoji: '🥟', name: 'dumpling', keywords: ['chinese'] },
      { emoji: '🥠', name: 'fortune_cookie', keywords: ['prophecy'] },
      { emoji: '🥡', name: 'takeout_box', keywords: ['chinese'] },
      { emoji: '🦀', name: 'crab', keywords: ['seafood'] },
      { emoji: '🦞', name: 'lobster', keywords: ['seafood'] },
      { emoji: '🦐', name: 'shrimp', keywords: ['seafood'] },
      { emoji: '🦑', name: 'squid', keywords: ['seafood'] },
      { emoji: '🦪', name: 'oyster', keywords: ['seafood'] },
      { emoji: '🍦', name: 'icecream', keywords: ['dessert'] },
      { emoji: '🍧', name: 'shaved_ice', keywords: ['dessert'] },
      { emoji: '🍨', name: 'ice_cream', keywords: ['dessert'] },
      { emoji: '🍩', name: 'doughnut', keywords: ['dessert'] },
      { emoji: '🍪', name: 'cookie', keywords: ['dessert'] },
      { emoji: '🎂', name: 'birthday', keywords: ['cake', 'party'] },
      { emoji: '🍰', name: 'cake', keywords: ['dessert'] },
      { emoji: '🧁', name: 'cupcake', keywords: ['dessert'] },
      { emoji: '🥧', name: 'pie', keywords: ['dessert'] },
      { emoji: '🍫', name: 'chocolate_bar', keywords: ['dessert'] },
      { emoji: '🍬', name: 'candy', keywords: ['sweet'] },
      { emoji: '🍭', name: 'lollipop', keywords: ['candy'] },
      { emoji: '🍮', name: 'custard', keywords: ['dessert'] },
      { emoji: '🍯', name: 'honey_pot', keywords: ['sweet'] },
      { emoji: '🍼', name: 'baby_bottle', keywords: ['milk'] },
      { emoji: '🥛', name: 'milk', keywords: ['dairy', 'glass'] },
      { emoji: '☕', name: 'coffee', keywords: ['caffeine', 'morning'] },
      { emoji: '🍵', name: 'tea', keywords: ['green', 'breakfast'] },
      { emoji: '🧃', name: 'beverage_box', keywords: ['juice'] },
      { emoji: '🥤', name: 'cup_with_straw', keywords: ['soda'] },
      { emoji: '🍶', name: 'sake', keywords: ['japanese', 'alcohol'] },
      { emoji: '🍺', name: 'beer', keywords: ['drink', 'alcohol'] },
      { emoji: '🍻', name: 'beers', keywords: ['drinks', 'cheers'] },
      { emoji: '🥂', name: 'champagne_glass', keywords: ['toast', 'celebration'] },
      { emoji: '🍷', name: 'wine_glass', keywords: ['alcohol'] },
      { emoji: '🥃', name: 'tumbler_glass', keywords: ['whiskey', 'alcohol'] },
      { emoji: '🍸', name: 'cocktail', keywords: ['drink', 'alcohol'] },
      { emoji: '🍹', name: 'tropical_drink', keywords: ['summer', 'vacation'] },
      { emoji: '🧉', name: 'mate', keywords: ['drink'] },
      { emoji: '🍾', name: 'champagne', keywords: ['bottle', 'celebration'] },
      { emoji: '🧊', name: 'ice_cube', keywords: ['cold'] },
    ],
    activities: [
      { emoji: '⚽', name: 'soccer', keywords: ['sports', 'football'] },
      { emoji: '🏀', name: 'basketball', keywords: ['sports'] },
      { emoji: '🏈', name: 'football', keywords: ['sports'] },
      { emoji: '⚾', name: 'baseball', keywords: ['sports'] },
      { emoji: '🥎', name: 'softball', keywords: ['sports'] },
      { emoji: '🎾', name: 'tennis', keywords: ['sports'] },
      { emoji: '🏐', name: 'volleyball', keywords: ['sports'] },
      { emoji: '🏉', name: 'rugby_football', keywords: ['sports'] },
      { emoji: '🥏', name: 'flying_disc', keywords: ['frisbee'] },
      { emoji: '🎱', name: '8ball', keywords: ['pool', 'billiards'] },
      { emoji: '🪀', name: 'yo-yo', keywords: ['toy'] },
      { emoji: '🏓', name: 'ping_pong', keywords: ['sports'] },
      { emoji: '🏸', name: 'badminton', keywords: ['sports'] },
      { emoji: '🏒', name: 'hockey', keywords: ['sports'] },
      { emoji: '🏑', name: 'field_hockey', keywords: ['sports'] },
      { emoji: '🥍', name: 'lacrosse', keywords: ['sports'] },
      { emoji: '🏏', name: 'cricket', keywords: ['sports'] },
      { emoji: '🥅', name: 'goal', keywords: ['sports'] },
      { emoji: '⛳', name: 'golf', keywords: ['sports'] },
      { emoji: '🪁', name: 'kite', keywords: ['fly'] },
      { emoji: '🏹', name: 'archery', keywords: ['sports', 'bow'] },
      { emoji: '🎣', name: 'fishing_pole', keywords: ['fish'] },
      { emoji: '🤿', name: 'diving_mask', keywords: ['scuba'] },
      { emoji: '🥊', name: 'boxing_glove', keywords: ['sports'] },
      { emoji: '🥋', name: 'martial_arts_uniform', keywords: ['karate'] },
      { emoji: '🎽', name: 'running_shirt', keywords: ['marathon'] },
      { emoji: '🛹', name: 'skateboard', keywords: ['sports'] },
      { emoji: '🛼', name: 'roller_skate', keywords: ['sports'] },
      { emoji: '🛷', name: 'sled', keywords: ['snow', 'sledge'] },
      { emoji: '⛸️', name: 'ice_skate', keywords: ['skating'] },
      { emoji: '🥌', name: 'curling_stone', keywords: ['sports'] },
      { emoji: '🎿', name: 'ski', keywords: ['sports', 'snow'] },
      { emoji: '⛷️', name: 'skier', keywords: ['sports', 'snow'] },
      { emoji: '🏂', name: 'snowboarder', keywords: ['sports', 'snow'] },
      { emoji: '🪂', name: 'parachute', keywords: ['fly', 'skydiving'] },
      { emoji: '🏋️', name: 'weightlifter', keywords: ['gym', 'workout'] },
      { emoji: '🤼', name: 'wrestlers', keywords: ['sports'] },
      { emoji: '🤸', name: 'person_cartwheeling', keywords: ['gymnastics'] },
      { emoji: '⛹️', name: 'person_bouncing_ball', keywords: ['basketball'] },
      { emoji: '🤺', name: 'person_fencing', keywords: ['sports'] },
      { emoji: '🤾', name: 'person_playing_handball', keywords: ['sports'] },
      { emoji: '🏌️', name: 'person_golfing', keywords: ['sports'] },
      { emoji: '🏇', name: 'horse_racing', keywords: ['sports'] },
      { emoji: '🧘', name: 'person_in_lotus_position', keywords: ['yoga', 'meditation'] },
      { emoji: '🏄', name: 'surfer', keywords: ['sports', 'beach'] },
      { emoji: '🏊', name: 'swimmer', keywords: ['sports', 'pool'] },
      { emoji: '🤽', name: 'person_playing_water_polo', keywords: ['sports'] },
      { emoji: '🚣', name: 'person_rowing_boat', keywords: ['sports'] },
      { emoji: '🧗', name: 'person_climbing', keywords: ['sports'] },
      { emoji: '🚴', name: 'person_biking', keywords: ['sports', 'bicycle'] },
      { emoji: '🚵', name: 'person_mountain_biking', keywords: ['sports', 'bicycle'] },
      { emoji: '🤹', name: 'person_juggling', keywords: ['performance'] },
      { emoji: '🎪', name: 'circus_tent', keywords: ['festival'] },
      { emoji: '🎭', name: 'performing_arts', keywords: ['theater', 'drama'] },
      { emoji: '🎨', name: 'art', keywords: ['painting', 'palette'] },
      { emoji: '🎬', name: 'clapper', keywords: ['movie', 'film'] },
      { emoji: '🎤', name: 'microphone', keywords: ['sing', 'karaoke'] },
      { emoji: '🎧', name: 'headphones', keywords: ['music'] },
      { emoji: '🎼', name: 'musical_score', keywords: ['music'] },
      { emoji: '🎹', name: 'musical_keyboard', keywords: ['piano'] },
      { emoji: '🥁', name: 'drum', keywords: ['music'] },
      { emoji: '🎷', name: 'saxophone', keywords: ['music'] },
      { emoji: '🎺', name: 'trumpet', keywords: ['music'] },
      { emoji: '🎸', name: 'guitar', keywords: ['music'] },
      { emoji: '🪕', name: 'banjo', keywords: ['music'] },
      { emoji: '🎻', name: 'violin', keywords: ['music'] },
      { emoji: '🎲', name: 'game_die', keywords: ['dice', 'gambling'] },
      { emoji: '♟️', name: 'chess_pawn', keywords: ['chess'] },
      { emoji: '🎯', name: 'dart', keywords: ['target', 'bullseye'] },
      { emoji: '🎳', name: 'bowling', keywords: ['sports'] },
      { emoji: '🎮', name: 'video_game', keywords: ['gaming', 'controller'] },
      { emoji: '🎰', name: 'slot_machine', keywords: ['gambling'] },
      { emoji: '🧩', name: 'jigsaw', keywords: ['puzzle'] },
    ],
    objects: [
      { emoji: '⭐', name: 'star', keywords: ['night'] },
      { emoji: '✨', name: 'sparkles', keywords: ['shiny'] },
      { emoji: '🌟', name: 'glowing_star', keywords: ['shiny'] },
      { emoji: '💫', name: 'dizzy', keywords: ['star'] },
      { emoji: '⚡', name: 'zap', keywords: ['lightning', 'thunder'] },
      { emoji: '🔥', name: 'fire', keywords: ['flame', 'hot'] },
      { emoji: '💥', name: 'boom', keywords: ['collision', 'explode'] },
      { emoji: '💯', name: '100', keywords: ['score', 'perfect'] },
      { emoji: '✅', name: 'white_check_mark', keywords: ['done', 'complete'] },
      { emoji: '❌', name: 'x', keywords: ['cancel', 'no'] },
      { emoji: '❎', name: 'negative_squared_cross_mark', keywords: ['no'] },
      { emoji: '➕', name: 'heavy_plus_sign', keywords: ['add'] },
      { emoji: '➖', name: 'heavy_minus_sign', keywords: ['subtract'] },
      { emoji: '➗', name: 'heavy_division_sign', keywords: ['divide'] },
      { emoji: '✖️', name: 'heavy_multiplication_x', keywords: ['multiply'] },
      { emoji: '🎉', name: 'tada', keywords: ['party', 'celebration'] },
      { emoji: '🎊', name: 'confetti_ball', keywords: ['party'] },
      { emoji: '🎈', name: 'balloon', keywords: ['party', 'birthday'] },
      { emoji: '🎁', name: 'gift', keywords: ['present', 'birthday'] },
      { emoji: '🏆', name: 'trophy', keywords: ['award', 'winner'] },
      { emoji: '🥇', name: 'first_place', keywords: ['gold', 'winner'] },
      { emoji: '🥈', name: 'second_place', keywords: ['silver'] },
      { emoji: '🥉', name: 'third_place', keywords: ['bronze'] },
      { emoji: '🏅', name: 'medal', keywords: ['award'] },
      { emoji: '🎖️', name: 'military_medal', keywords: ['award'] },
      { emoji: '⚽', name: 'soccer', keywords: ['sports', 'football'] },
      { emoji: '🏀', name: 'basketball', keywords: ['sports'] },
      { emoji: '🏈', name: 'football', keywords: ['sports'] },
      { emoji: '📱', name: 'iphone', keywords: ['mobile', 'phone'] },
      { emoji: '💻', name: 'computer', keywords: ['laptop', 'work'] },
      { emoji: '⌨️', name: 'keyboard', keywords: ['computer'] },
      { emoji: '🖥️', name: 'desktop', keywords: ['computer'] },
      { emoji: '🖨️', name: 'printer', keywords: ['office'] },
      { emoji: '🖱️', name: 'mouse', keywords: ['computer'] },
      { emoji: '💽', name: 'minidisc', keywords: ['disk'] },
      { emoji: '💾', name: 'floppy_disk', keywords: ['save'] },
      { emoji: '💿', name: 'cd', keywords: ['disk'] },
      { emoji: '📀', name: 'dvd', keywords: ['disk'] },
      { emoji: '📷', name: 'camera', keywords: ['photo'] },
      { emoji: '📸', name: 'camera_with_flash', keywords: ['photo'] },
      { emoji: '📹', name: 'video_camera', keywords: ['film'] },
      { emoji: '🎥', name: 'movie_camera', keywords: ['film'] },
      { emoji: '📞', name: 'telephone_receiver', keywords: ['phone', 'call'] },
      { emoji: '☎️', name: 'telephone', keywords: ['phone'] },
      { emoji: '📟', name: 'pager', keywords: ['bbcall'] },
      { emoji: '📠', name: 'fax', keywords: ['machine'] },
      { emoji: '📺', name: 'tv', keywords: ['television'] },
      { emoji: '📻', name: 'radio', keywords: ['podcast'] },
      { emoji: '🎙️', name: 'microphone2', keywords: ['podcast'] },
      { emoji: '🎚️', name: 'level_slider', keywords: ['music'] },
      { emoji: '🎛️', name: 'control_knobs', keywords: ['music'] },
      { emoji: '🧭', name: 'compass', keywords: ['navigation'] },
      { emoji: '⏱️', name: 'stopwatch', keywords: ['time'] },
      { emoji: '⏲️', name: 'timer', keywords: ['clock'] },
      { emoji: '⏰', name: 'alarm_clock', keywords: ['morning'] },
      { emoji: '🕰️', name: 'clock', keywords: ['time'] },
      { emoji: '⌛', name: 'hourglass', keywords: ['time'] },
      { emoji: '⏳', name: 'hourglass_flowing_sand', keywords: ['time'] },
      { emoji: '📡', name: 'satellite', keywords: ['signal'] },
      { emoji: '🔋', name: 'battery', keywords: ['power'] },
      { emoji: '🔌', name: 'electric_plug', keywords: ['power'] },
      { emoji: '💡', name: 'bulb', keywords: ['idea', 'light'] },
      { emoji: '🔦', name: 'flashlight', keywords: ['light', 'torch'] },
      { emoji: '🕯️', name: 'candle', keywords: ['light'] },
      { emoji: '🪔', name: 'diya_lamp', keywords: ['light'] },
      { emoji: '🧯', name: 'fire_extinguisher', keywords: ['quench'] },
      { emoji: '🛢️', name: 'oil', keywords: ['barrell'] },
      { emoji: '💸', name: 'money_with_wings', keywords: ['dollar'] },
      { emoji: '💵', name: 'dollar', keywords: ['money'] },
      { emoji: '💴', name: 'yen', keywords: ['money'] },
      { emoji: '💶', name: 'euro', keywords: ['money'] },
      { emoji: '💷', name: 'pound', keywords: ['money'] },
      { emoji: '💰', name: 'moneybag', keywords: ['dollar', 'cream'] },
      { emoji: '💳', name: 'credit_card', keywords: ['subscription'] },
      { emoji: '💎', name: 'gem', keywords: ['diamond'] },
      { emoji: '⚖️', name: 'scales', keywords: ['law', 'balance'] },
      { emoji: '🧰', name: 'toolbox', keywords: ['mechanic'] },
      { emoji: '🔧', name: 'wrench', keywords: ['tool'] },
      { emoji: '🔨', name: 'hammer', keywords: ['tool'] },
      { emoji: '⚒️', name: 'hammer_pick', keywords: ['tools'] },
      { emoji: '🛠️', name: 'tools', keywords: ['build'] },
      { emoji: '⛏️', name: 'pick', keywords: ['mining'] },
      { emoji: '🔩', name: 'nut_and_bolt', keywords: ['handy'] },
      { emoji: '⚙️', name: 'gear', keywords: ['cog'] },
      { emoji: '🧱', name: 'brick', keywords: ['bricks'] },
      { emoji: '⛓️', name: 'chains', keywords: ['lock'] },
      { emoji: '🧲', name: 'magnet', keywords: ['attraction'] },
      { emoji: '🔫', name: 'gun', keywords: ['shoot', 'weapon'] },
      { emoji: '💣', name: 'bomb', keywords: ['boom'] },
      { emoji: '🧨', name: 'firecracker', keywords: ['dynamite'] },
      { emoji: '🪓', name: 'axe', keywords: ['chop', 'wood'] },
      { emoji: '🔪', name: 'knife', keywords: ['cut', 'chop'] },
      { emoji: '🗡️', name: 'dagger', keywords: ['weapon'] },
      { emoji: '⚔️', name: 'crossed_swords', keywords: ['weapon'] },
      { emoji: '🛡️', name: 'shield', keywords: ['protection'] },
      { emoji: '🚬', name: 'smoking', keywords: ['cigarette'] },
      { emoji: '⚰️', name: 'coffin', keywords: ['funeral'] },
      { emoji: '⚱️', name: 'urn', keywords: ['funeral'] },
      { emoji: '🏺', name: 'amphora', keywords: ['vase', 'jar'] },
      { emoji: '🔮', name: 'crystal_ball', keywords: ['fortune'] },
      { emoji: '📿', name: 'prayer_beads', keywords: ['dhikr'] },
      { emoji: '🧿', name: 'nazar_amulet', keywords: ['bead', 'charm'] },
      { emoji: '💈', name: 'barber', keywords: ['haircut'] },
      { emoji: '⚗️', name: 'alembic', keywords: ['distilling'] },
      { emoji: '🔭', name: 'telescope', keywords: ['stars', 'space'] },
      { emoji: '🔬', name: 'microscope', keywords: ['science', 'laboratory'] },
      { emoji: '🕳️', name: 'hole', keywords: ['burrow'] },
      { emoji: '🩹', name: 'adhesive_bandage', keywords: ['heal'] },
      { emoji: '🩺', name: 'stethoscope', keywords: ['health'] },
      { emoji: '💊', name: 'pill', keywords: ['health', 'medicine'] },
      { emoji: '💉', name: 'syringe', keywords: ['health', 'needle'] },
      { emoji: '🩸', name: 'drop_of_blood', keywords: ['period'] },
      { emoji: '🧬', name: 'dna', keywords: ['genetics'] },
      { emoji: '🦠', name: 'microbe', keywords: ['virus', 'germs'] },
      { emoji: '🧫', name: 'petri_dish', keywords: ['bacteria'] },
      { emoji: '🧪', name: 'test_tube', keywords: ['chemistry', 'experiment'] },
      { emoji: '🌡️', name: 'thermometer', keywords: ['temperature', 'hot'] },
      { emoji: '🧹', name: 'broom', keywords: ['clean', 'sweep'] },
      { emoji: '🧺', name: 'basket', keywords: ['laundry'] },
      { emoji: '🧻', name: 'toilet_paper', keywords: ['roll'] },
      { emoji: '🚽', name: 'toilet', keywords: ['wc'] },
      { emoji: '🚰', name: 'potable_water', keywords: ['drinking'] },
      { emoji: '🚿', name: 'shower', keywords: ['bath'] },
      { emoji: '🛁', name: 'bathtub', keywords: ['bath'] },
      { emoji: '🛀', name: 'bath', keywords: ['shower'] },
      { emoji: '🧼', name: 'soap', keywords: ['wash'] },
      { emoji: '🪒', name: 'razor', keywords: ['shave'] },
      { emoji: '🧽', name: 'sponge', keywords: ['cleaning'] },
      { emoji: '🧴', name: 'lotion_bottle', keywords: ['moisturizer'] },
      { emoji: '🛎️', name: 'bellhop', keywords: ['service'] },
      { emoji: '🔑', name: 'key', keywords: ['lock', 'password'] },
      { emoji: '🗝️', name: 'key2', keywords: ['lock'] },
      { emoji: '🚪', name: 'door', keywords: ['house'] },
      { emoji: '🪑', name: 'chair', keywords: ['sit'] },
      { emoji: '🛋️', name: 'couch', keywords: ['sofa'] },
      { emoji: '🛏️', name: 'bed', keywords: ['sleep'] },
      { emoji: '🖼️', name: 'frame_photo', keywords: ['art'] },
      { emoji: '🛍️', name: 'shopping_bags', keywords: ['mall'] },
      { emoji: '🛒', name: 'shopping_cart', keywords: ['trolley'] },
      { emoji: '🎁', name: 'gift', keywords: ['present', 'birthday'] },
      { emoji: '🎀', name: 'ribbon', keywords: ['decoration'] },
      { emoji: '🎏', name: 'flags', keywords: ['fish'] },
      { emoji: '🎐', name: 'wind_chime', keywords: ['bell'] },
      { emoji: '🧧', name: 'red_envelope', keywords: ['gift'] },
      { emoji: '✉️', name: 'envelope', keywords: ['letter', 'email'] },
      { emoji: '📩', name: 'envelope_with_arrow', keywords: ['email', 'inbox'] },
      { emoji: '📨', name: 'incoming_envelope', keywords: ['email', 'inbox'] },
      { emoji: '📧', name: 'e-mail', keywords: ['email'] },
      { emoji: '💌', name: 'love_letter', keywords: ['email', 'envelope'] },
      { emoji: '📥', name: 'inbox_tray', keywords: ['email'] },
      { emoji: '📤', name: 'outbox_tray', keywords: ['email'] },
      { emoji: '📦', name: 'package', keywords: ['shipping', 'box'] },
      { emoji: '🏷️', name: 'label', keywords: ['tag'] },
      { emoji: '📪', name: 'mailbox_closed', keywords: ['email'] },
      { emoji: '📫', name: 'mailbox', keywords: ['email'] },
      { emoji: '📬', name: 'mailbox_with_mail', keywords: ['email'] },
      { emoji: '📭', name: 'mailbox_with_no_mail', keywords: ['email'] },
      { emoji: '📮', name: 'postbox', keywords: ['email'] },
      { emoji: '📯', name: 'postal_horn', keywords: ['envelope'] },
      { emoji: '📜', name: 'scroll', keywords: ['paper'] },
      { emoji: '📃', name: 'page_with_curl', keywords: ['document'] },
      { emoji: '📄', name: 'page_facing_up', keywords: ['document'] },
      { emoji: '📑', name: 'bookmark_tabs', keywords: ['mark'] },
      { emoji: '🔖', name: 'bookmark', keywords: ['mark'] },
      { emoji: '🏷️', name: 'label', keywords: ['tag'] },
      { emoji: '💰', name: 'moneybag', keywords: ['dollar', 'cream'] },
      { emoji: '💴', name: 'yen', keywords: ['money'] },
      { emoji: '💵', name: 'dollar', keywords: ['money'] },
      { emoji: '💶', name: 'euro', keywords: ['money'] },
      { emoji: '💷', name: 'pound', keywords: ['money'] },
      { emoji: '💸', name: 'money_with_wings', keywords: ['dollar'] },
      { emoji: '💳', name: 'credit_card', keywords: ['subscription'] },
      { emoji: '🧾', name: 'receipt', keywords: ['accounting'] },
      { emoji: '💹', name: 'chart', keywords: ['green-square', 'graph'] },
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
          emojiObj.keywords.some((keyword) => keyword.includes(query))
        ) {
          results.push(emojiObj);
        }
      });
    });

    return results;
  }, [searchQuery]);

  const displayEmojis = searchQuery
    ? filteredEmojis
    : activeTab === 'recent'
    ? recentEmojis
    : emojiData[activeTab as keyof typeof emojiData]?.map((e) => e.emoji) || [];

  return (
    <div className="w-full flex flex-col h-full">
      {/* Search Bar */}
      {showSearch && (
        <div className="p-3 border-b">
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
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start px-2 h-12 bg-muted/50">
          <TabsTrigger value="recent" className="px-2 py-1.5" title="Recent">
            <Clock className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="smileys" className="px-2 py-1.5" title="Smileys & People">
            <Smile className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="gestures" className="px-2 py-1.5" title="Gestures">
            <span className="text-base">👋</span>
          </TabsTrigger>
          <TabsTrigger value="hearts" className="px-2 py-1.5" title="Hearts & Symbols">
            <Heart className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="nature" className="px-2 py-1.5" title="Animals & Nature">
            <span className="text-base">🐶</span>
          </TabsTrigger>
          <TabsTrigger value="food" className="px-2 py-1.5" title="Food & Drink">
            <Coffee className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="activities" className="px-2 py-1.5" title="Activities">
            <span className="text-base">⚽</span>
          </TabsTrigger>
          <TabsTrigger value="objects" className="px-2 py-1.5" title="Objects">
            <Lightbulb className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 h-[280px]">
          <div className="p-3">
            {searchQuery && filteredEmojis ? (
              // Search Results
              filteredEmojis.length > 0 ? (
                <div className="grid grid-cols-8 gap-1">
                  {filteredEmojis.map((emojiObj, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emojiObj.emoji)}
                      className="text-2xl p-2 hover:bg-muted rounded transition-colors active:scale-95 relative group"
                      title={emojiObj.name}
                    >
                      {emojiObj.emoji}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {emojiObj.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No emojis found</p>
                </div>
              )
            ) : activeTab === 'recent' ? (
              // Recent Emojis
              recentEmojis.length > 0 ? (
                <div className="grid grid-cols-8 gap-1">
                  {recentEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl p-2 hover:bg-muted rounded transition-colors active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent emojis</p>
                  <p className="text-xs mt-1">Your recently used emojis will appear here</p>
                </div>
              )
            ) : (
              // Category Emojis
              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-8 gap-1">
                  {(emojiData[activeTab as keyof typeof emojiData] || []).map(
                    (emojiObj, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emojiObj.emoji)}
                        className="text-2xl p-2 hover:bg-muted rounded transition-colors active:scale-95 relative group"
                        title={emojiObj.name}
                      >
                        {emojiObj.emoji}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                          {emojiObj.name}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </TabsContent>
            )}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
