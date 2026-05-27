import React, { useState } from 'react';
import Modal from './Modal';
import { 
    X, 
    Image as ImageIcon, 
    Smile, 
    MapPin, 
    Calendar,
    MoreHorizontal
} from 'lucide-react';
import Button from './Button';
import TextArea from './TextArea';
import EmojiPicker from './EmojiPicker';



export default function CommentModal({
    show,
    onClose,
    post,
    user,
    onSubmit,
    processing
}) {
    const [body, setBody] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = React.useRef(null);
    const textareaRef = React.useRef(null);

    const insertEmoji = (emoji) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            const newContent = before + emoji + after;
            setBody(newContent);
            
            setTimeout(() => {
                textarea.focus();
                const newCursorPos = start + emoji.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        } else {
            setBody(prev => prev + emoji);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = () => {
        if (!body.trim() && !selectedImage) return;
        onSubmit(body, selectedImage);
        setBody('');
        removeImage();
    };

    if (!post) return null;


    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#161616]/80 backdrop-blur-md z-10">
                <button 
                    onClick={onClose}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                    <X size={20} className="text-gray-900 dark:text-white" />
                </button>
                <h3 className="font-bold text-gray-900 dark:text-white">Reply</h3>
                <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <MoreHorizontal size={20} className="text-gray-500" />
                </button>
            </div>

            <div className="px-4 pb-4 overflow-y-auto max-h-[70vh]">
                {/* Parent Post */}
                <div className="flex gap-3 mt-2">
                    <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1F6F5F] to-[#2a917c] flex items-center justify-center text-white font-bold shadow-lg shadow-[#1F6F5F]/20 text-lg overflow-hidden">
                            {post.user?.profile?.profil_picture ? (
                                <img src={post.user.profile.profil_picture} alt={post.user.name} className="w-full h-full object-cover" />
                            ) : (
                                post.user?.name?.[0] || 'U'
                            )}
                        </div>
                        <div className="w-0.5 flex-1 bg-gray-200 dark:bg-white/10 mt-2 mb-1 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 pt-1">
                            <span className="font-bold text-gray-900 dark:text-white truncate">
                                {post.user?.name}
                            </span>
                            <span className="text-gray-500 text-sm">
                                @{post.user?.username || 'anonymous'} • {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="mt-2 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {post.body}
                        </div>
                        <div className="mt-3 text-gray-500 text-sm">
                            Replying to <span className="text-[#1F6F5F] font-medium">@{post.user?.username || 'anonymous'}</span>
                        </div>
                    </div>
                </div>

                {/* Reply Section */}
                <div className="flex gap-3 mt-4">
                     <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1F6F5F] to-[#2a917c] flex items-center justify-center text-white font-bold shadow-lg shadow-[#1F6F5F]/20 text-lg overflow-hidden">
                            {user?.profile?.profil_picture ? (
                                <img src={user.profile.profil_picture} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.[0] || 'U'
                            )}
                        </div>
                    <div className="flex-1">
                        <TextArea
                            ref={textareaRef}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder={`Reply to ${post.user?.name}...`}
                            className="w-full bg-transparent border-none focus:ring-0 text-lg px-0 py-2 min-h-[120px] dark:text-white"
                            rows={3}
                            autoFocus
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mt-2 relative rounded-xl overflow-hidden group max-w-sm">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-auto max-h-[200px] object-cover rounded-xl"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Action Icons & Post Button */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-1 ml-12">
                    <button 
                        className="p-2 rounded-full text-[#1F6F5F] hover:bg-[#1F6F5F]/5 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon size={20} />
                    </button>
                    <EmojiPicker onSelectEmoji={insertEmoji} placement="top" />
                    <button className="p-2 rounded-full text-[#1F6F5F] hover:bg-[#1F6F5F]/5 transition-all">
                        <Calendar size={20} />
                    </button>
                </div>
                <Button 
                    variant="primary" 
                    size="sm" 
                    className="px-6 rounded-full font-bold"
                    onClick={handleSubmit}
                    disabled={(!body.trim() && !selectedImage) || processing}
                >
                    Post
                </Button>
            </div>
        </Modal>
    );
}
