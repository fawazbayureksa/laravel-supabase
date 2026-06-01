import { useState } from "react";
import { Ellipsis } from "lucide-react";

export default function Overflow() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full hover:bg-gray-100"
            >
                <Ellipsis size={20} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                        Edit Post
                    </button>

                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                        Delete Post
                    </button>

                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                        Report
                    </button>
                </div>
            )}
        </div>
    );
}
