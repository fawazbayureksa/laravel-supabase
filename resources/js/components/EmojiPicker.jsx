import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emojiCategories = {
    smileys: {
        label: '😀',
        emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤔', '🫣', '🤭', '🫢', '🤫', '🤥', '😶', '😐', '😑', '😬', '🫨', '🫠', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '😵‍💫', '🫥', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '👽', '👾', '🤖', '🎃']
    },
    gestures: {
        label: '👋',
        emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🫶', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🧠', '👀', '👅', '👄', '💋', '❤️', '💖', '🔥', '✨']
    },
    hearts: {
        label: '❤️',
        emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🎈', '🎉', '🎊', '🎀', '🎁', '🎂', '🌟', '⭐', '✨', '⚡', '💥', '💯', '💤', '💨']
    },
    animals: {
        label: '🐱',
        emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🕷️', '🐢', '🐍', '🐙', '🦑', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐆', '🦓', '🦍', '🐘', '🦛', '🦒', '🦘', '🐕', '🐈', '🐇', '🐾', '🐉', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃']
    },
    food: {
        label: '🍏',
        emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🧅', '🧄', '🍞', '🥐', '🥖', '🥨', '🥞', '🧇', '🧀', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🍳', '🍲', '🥗', '🍿', '🧈', '🧂', '🍱', '🍚', '🍛', '🍜', '🍝', '🍣', '🍤', '🍡', '🥟', '🍦', '🍧', '🍩', '🍪', '🎂', '🍫', '🍬', '🍭', '🍮', '🍯', '🥛', '☕', '🍵', '🍶', '🍷', '🍸', '🍺', '🥃', '🥤']
    }
};

export default function EmojiPicker({ onSelectEmoji, placement = 'top' }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeCategory, setActiveCategory] = useState('smileys');
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiPickerRef]);

    const handleEmojiClick = (e, emoji) => {
        e.stopPropagation();
        onSelectEmoji(emoji);
    };

    const placementClasses = {
        top: 'absolute bottom-12 left-0',
        bottom: 'absolute top-12 left-0',
        'top-right': 'absolute bottom-12 right-0',
        'bottom-right': 'absolute top-12 right-0'
    };

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-full text-[#1F6F5F] hover:bg-[#1F6F5F]/5 transition-all ${showEmojiPicker ? 'bg-[#1F6F5F]/10' : ''}`}
            >
                <Smile size={20} />
            </button>
            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div
                        ref={emojiPickerRef}
                        initial={{ opacity: 0, y: placement.includes('top') ? 10 : -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: placement.includes('top') ? 10 : -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`p-5 w-80 bg-white dark:bg-[#1c1c1c] border border-gray-100 dark:border-white/5 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col ${placementClasses[placement] || placementClasses.top}`}
                    >
                        {/* Category Selector */}
                        <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 px-3 py-2 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Emojis</span>
                            <div className="flex gap-0.5">
                                {Object.keys(emojiCategories).map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setActiveCategory(cat)}
                                        className={`text-sm p-1 rounded hover:bg-gray-200/50 dark:hover:bg-white/5 transition-all ${activeCategory === cat ? 'scale-110 bg-gray-200/80 dark:bg-white/10' : ''}`}
                                    >
                                        {emojiCategories[cat].label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Emojis Grid */}
                        <div className="p-2 h-56 overflow-y-auto grid grid-cols-6 gap-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
                            {emojiCategories[activeCategory].emojis.map((emoji, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={(e) => handleEmojiClick(e, emoji)}
                                    className="text-lg p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all transform hover:scale-115 active:scale-90"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
