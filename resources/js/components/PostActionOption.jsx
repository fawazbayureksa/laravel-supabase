import { Menu } from "@headlessui/react";
import {
    Ellipsis,
    ChevronRight,
    Bookmark,
    EyeOff,
    UserMinus,
    Shield,
    UserX,
    AlertCircle,
    Link,
} from "lucide-react";

export default function PostActionMenu({ post }) {
    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const url = post
            ? `${window.location.origin}/posts/${post.id}`
            : window.location.href;

        navigator.clipboard
            .writeText(url)
            .then(() => {
                alert("Link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    return (
        <Menu
            as="div"
            className="relative inline-block text-left bg-white dark:bg-[#1a1a1a]"
        >
            <Menu.Button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
            >
                <Ellipsis size={20} />
            </Menu.Button>

            <Menu.Items
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-72 origin-top-right rounded-[22px] bg-white dark:bg-[#262626] border dark:border-white/[0.08] shadow-2xl focus:outline-none overflow-hidden z-50"
            >
                {/* Section 1 */}
                <div className="border-b border-white/[0.08]">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left dark:text-white transition-colors text-[15px] font-semibold ${
                                    active ? "bg-white/10" : ""
                                }`}
                            >
                                <span>Add to feed</span>
                                <ChevronRight
                                    size={18}
                                    className="opacity-80"
                                />
                            </button>
                        )}
                    </Menu.Item>
                </div>

                {/* Section 2 */}
                <div className="border-b border-white/[0.08]">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left dark:text-white transition-colors text-[15px] font-semibold ${
                                    active ? "bg-white/10" : ""
                                }`}
                            >
                                <span>Save</span>
                                <Bookmark size={18} className="opacity-80" />
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left dark:text-white transition-colors text-[15px] font-semibold ${
                                    active ? "bg-white/10" : ""
                                }`}
                            >
                                <span>Not interested</span>
                                <EyeOff size={18} className="opacity-80" />
                            </button>
                        )}
                    </Menu.Item>
                </div>

                {/* Section 3 */}
                <div className="border-b border-white/[0.08]">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left dark:text-white transition-colors text-[15px] font-semibold ${
                                    active ? "bg-white/10" : ""
                                }`}
                            >
                                <span>Mute</span>
                                <UserMinus size={18} className="opacity-80" />
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left dark:text-white transition-colors text-[15px] font-semibold ${
                                    active ? "bg-white/10" : ""
                                }`}
                            >
                                <span>Restrict</span>
                                <Shield size={18} className="opacity-80" />
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left text-[#FF453A] hover:text-[#FF453A] transition-colors text-[15px] font-semibold ${
                                    active ? "bg-white/10" : ""
                                }`}
                            >
                                <span>Block</span>
                                <UserX size={18} className="text-[#FF453A]" />
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left text-[#FF453A] hover:text-[#FF453A] transition-colors text-[15px] font-semibold ${
                                    active ? "bg-white/10" : ""
                                }`}
                            >
                                <span>Report</span>
                                <AlertCircle
                                    size={18}
                                    className="text-[#FF453A]"
                                />
                            </button>
                        )}
                    </Menu.Item>
                </div>

                {/* Section 4 */}
                <div>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={handleCopyLink}
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left dark:text-white transition-colors text-[15px] font-semibold ${
                                    active ? "bg-white/10" : ""
                                }`}
                            >
                                <span>Copy link</span>
                                <Link size={18} className="opacity-80" />
                            </button>
                        )}
                    </Menu.Item>
                </div>
            </Menu.Items>
        </Menu>
    );
}
