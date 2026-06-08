import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import FileUpload from '@/components/FileUpload';
import ActionIcon from '@/components/ActionIcon';
import Card from '@/components/Card';
import { Heart, MessageCircle, Share2, Bookmark, Mail, Lock, User, Send } from 'lucide-react';
import { useState } from 'react';

export default function ComponentShowcase() {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSave = () => {
        setProcessing(true);
        setTimeout(() => setProcessing(false), 2000);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-bold text-[#1F6F5F] uppercase tracking-widest mb-1.5">Showcase</p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Component Library
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        A preview of the reusable components built for the project.
                    </p>
                </div>
            }
        >
            <Head title="Component Showcase" />

            <div className="space-y-12">
                {/* Buttons Section */}
                <section>
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6">Buttons</h2>
                    <Card>
                        <Card.Body className="flex flex-wrap gap-4">
                            <Button variant="primary">Primary Button</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="danger">Danger</Button>
                            <Button variant="ghost">Ghost Button</Button>
                            <Button variant="primary" processing={processing} onClick={handleSave}>
                                {processing ? 'Processing' : 'Click for Loading'}
                            </Button>
                            <Button variant="primary" icon={Send}>With Icon</Button>
                        </Card.Body>
                        <Card.Footer className="flex gap-4">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </Card.Footer>
                    </Card>
                </section>

                {/* Inputs Section */}
                <section>
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6">Form Elements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <Card.Header title="Text Inputs" subtitle="Standard and icon-supported inputs" />
                            <Card.Body className="space-y-4">
                                <Input label="Full Name" placeholder="John Doe" />
                                <Input label="Email Address" type="email" icon={Mail} placeholder="john@example.com" />
                                <Input label="Password" type="password" icon={Lock} placeholder="••••••••" />
                                <Input label="Invalid Input" error="This field is required" placeholder="Error state" />
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Header title="TextArea & File" subtitle="Post content and uploads" />
                            <Card.Body className="space-y-4">
                                <TextArea label="Post Content" placeholder="What's on your mind?" />
                                <FileUpload label="Attachment" accept="image/*" />
                            </Card.Body>
                        </Card>
                    </div>
                </section>

                {/* Social Icons Section */}
                <section>
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6">Social Interactions</h2>
                    <Card>
                        <Card.Body>
                            <div className="flex items-center gap-8">
                                <ActionIcon
                                    icon={Heart}
                                    isActive={liked}
                                    onClick={() => setLiked(!liked)}
                                    count={liked ? 129 : 128}
                                    label="Like"
                                />
                                <ActionIcon
                                    icon={MessageCircle}
                                    count={24}
                                    label="Comment"
                                />
                                <ActionIcon
                                    icon={Share2}
                                    label="Share"
                                />
                                <ActionIcon
                                    icon={Bookmark}
                                    isActive={saved}
                                    onClick={() => setSaved(!saved)}
                                    activeClassName="text-[#1F6F5F] bg-[#1F6F5F]/8 dark:bg-[#1F6F5F]/10"
                                    label="Save"
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </section>

                {/* Card Variations */}
                <section>
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6">Card Variations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Card className="hover:border-[#1F6F5F]/30 transition-colors cursor-pointer">
                            <Card.Body className="flex flex-col items-center text-center py-10">
                                <div className="w-16 h-16 rounded-2xl bg-[#1F6F5F]/10 text-[#1F6F5F] flex items-center justify-center mb-4">
                                    <User size={32} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Profile</h3>
                                <p className="text-xs text-gray-500 mt-1">Manage your info</p>
                            </Card.Body>
                        </Card>

                        <Card className="hover:border-[#1F6F5F]/30 transition-colors cursor-pointer">
                            <Card.Body className="flex flex-col items-center text-center py-10">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                                    <Mail size={32} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Messages</h3>
                                <p className="text-xs text-gray-500 mt-1">Check your inbox</p>
                            </Card.Body>
                        </Card>

                        <Card className="hover:border-[#1F6F5F]/30 transition-colors cursor-pointer">
                            <Card.Body className="flex flex-col items-center text-center py-10">
                                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                                    <Bookmark size={32} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Bookmarks</h3>
                                <p className="text-xs text-gray-500 mt-1">Saved items</p>
                            </Card.Body>
                        </Card>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
